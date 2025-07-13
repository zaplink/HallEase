'use client';

import React, { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch, UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import { Check, ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Combobox } from '@/components/combobox';
import { DatePickerDemo } from '@/components/ui/DatePicker';
import {
	eventTypeOptions,
	ReserveLectureFormData,
	// defaultReserveLectureFormData,
	// SubmissionType,
} from './reserve.lecture.data';
import { useBooking } from './useReserveLecture';
import { supabase } from '@/lib/supabaseClient';

// Form schema with all steps
const formSchema = z.object({
	// Step 1: Course Information
	course: z.string().min(2, 'Course is required'),
	description: z.string().optional(),
	type: z.string().min(1, 'Lecture type is required'),

	// Step 2: Date and Time
	date: z.date({ required_error: 'Date is required' }),
	startHour: z.string().min(1, 'Start hour is required'),
	startMinute: z.string().min(1, 'Start minute is required'),
	endHour: z.string().min(1, 'End hour is required'),
	endMinute: z.string().min(1, 'End minute is required'),

	// Step 3: Venue
	hallOpt: z.string().min(1, 'Hall selection method is required'),
	hall: z.string().optional(), // Only required if hallOpt is 'manual'

	// Step 4: Equipment & Extras
	equipment: z.array(z.string()).optional(), // Array of selected equipment IDs
	additionalNotes: z.string().optional(),
	additionalDocuments: z
		.any()
		.optional()
		.refine(
			(files) => {
				if (!files || files.length === 0) return true; // Optional field
				const file = files[0];
				return file.size <= 10 * 1024 * 1024; // 10MB limit
			},
			{ message: 'File size must be less than 10MB' }
		), // File upload with size validation

	// Step 5: Confirmation
	acceptTerms: z.boolean().refine((val) => val === true, {
		message: 'You must confirm the accuracy of your information to proceed',
	}),
});

type FormData = z.infer<typeof formSchema>;

type Step = {
	id: string;
	title: string;
	description: string;
};

const steps: Step[] = [
	{
		id: 'information',
		title: 'Information',
		description: 'Course and lecture details',
	},
	{
		id: 'datetime',
		title: 'Date & Time',
		description: 'Schedule your lecture',
	},
	{
		id: 'venue',
		title: 'Venue',
		description: 'Hall selection',
	},
	{
		id: 'extras',
		title: 'Extras',
		description: 'Equipment & notes',
	},
	{
		id: 'review',
		title: 'Review & Submit',
		description: 'Confirm your information',
	},
];

function Stepper({
	currentStep,
	steps,
}: {
	currentStep: number;
	steps: Step[];
}) {
	return (
		<div className='w-full py-6'>
			<div className='flex items-center justify-between w-full'>
				{steps.map((step, index) => (
					<React.Fragment key={step.id}>
						<div className='flex flex-col items-center'>
							<div
								className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
									index < currentStep
										? 'border-primary bg-primary text-primary-foreground'
										: index === currentStep
											? 'border-primary text-primary'
											: 'border-muted-foreground/25 text-muted-foreground'
								}`}
							>
								{index < currentStep ? (
									<Check className='h-5 w-5' />
								) : (
									<span className='text-sm font-medium'>
										{index + 1}
									</span>
								)}
							</div>
							<div className='mt-2 text-center'>
								<div
									className={`text-sm font-medium ${
										index <= currentStep
											? 'text-foreground'
											: 'text-muted-foreground'
									}`}
								>
									{step.title}
								</div>
								<div className='text-xs text-muted-foreground'>
									{step.description}
								</div>
							</div>
						</div>
						{index < steps.length - 1 && (
							<div
								className={`flex-1 h-px mx-4 ${
									index < currentStep
										? 'bg-primary'
										: 'bg-muted-foreground/25'
								}`}
							/>
						)}
					</React.Fragment>
				))}
			</div>
		</div>
	);
}

// Use Zod-inferred type that should match ReserveLectureFormData
type StepperFormData = FormData;

interface ReserveLectureStepperFormProps {
	onBackToSelection: () => void;
}

export default function ReserveLectureStepperForm({
	onBackToSelection,
}: ReserveLectureStepperFormProps) {
	const [currentStep, setCurrentStep] = useState(0);
	const [showSuccessDialog, setShowSuccessDialog] = useState(false);
	const { handleSubmit, isLoading, isSubmitted } = useBooking();
	const router = useRouter();

	const form = useForm<StepperFormData>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			course: '',
			description: '',
			type: '',
			date: undefined,
			startHour: '08',
			startMinute: '30',
			endHour: '10',
			endMinute: '30',
			hallOpt: 'availability',
			hall: '',
			equipment: [],
			additionalNotes: '',
			additionalDocuments: null,
			acceptTerms: false,
		},
		mode: 'onChange',
	});

	const watchedValues = useWatch({ control: form.control });
	const hallSelection = useWatch({
		control: form.control,
		name: 'hallOpt',
	});

	// Course code options with API fetch
	const [courseCodeOptions, setCourseCodeOptions] = useState<
		{ label: string; value: string }[]
	>([]);

	useEffect(() => {
		const fetchCourses = async () => {
			try {
				const { data, error } = await supabase
					.from('course')
					.select('id, char, digit, name');

				if (error) {
					console.error('Error fetching courses:', error);
					return;
				}

				if (data) {
					const options = data.map((course) => ({
						label: `${course.char} ${course.digit} - ${course.name}`,
						value: course.id,
					}));
					setCourseCodeOptions(options);
				}
			} catch (error) {
				console.error('Error fetching courses:', error);
			}
		};

		fetchCourses();
	}, []);

	const hallOptions = [
		{ value: 'availability', label: 'Availability' },
		{ value: 'manual', label: 'Manually' },
	];

	const [halls, setHalls] = useState<{ value: string; label: string }[]>([]);
	const [loadingHalls, setLoadingHalls] = useState(false);

	useEffect(() => {
		async function fetchHalls() {
			setLoadingHalls(true);
			try {
				const { createClient } = await import('@/lib/supabaseClient');
				const supabase = createClient();
				const { data, error } = await supabase
					.from('hall')
					.select('code')
					.eq('is_available', true);
				if (error) {
					setHalls([]);
				} else {
					setHalls(
						(data || []).map((hall: { code: string }) => ({
							value: hall.code,
							label: hall.code,
						}))
					);
				}
			} catch {
				setHalls([]);
			} finally {
				setLoadingHalls(false);
			}
		}
		fetchHalls();
	}, []);

	const validateCurrentStep = async () => {
		const fieldsToValidate = getFieldsForStep(currentStep);

		// Add conditional validation for hall field when manual selection is chosen
		if (currentStep === 2) {
			const hallOptValue = form.getValues('hallOpt');
			if (hallOptValue === 'manual') {
				fieldsToValidate.push('hall');
			}
		}

		const isValid = await form.trigger(fieldsToValidate);
		return isValid;
	};

	const getFieldsForStep = (step: number): (keyof StepperFormData)[] => {
		switch (step) {
			case 0:
				return ['course', 'type'];
			case 1:
				return [
					'date',
					'startHour',
					'startMinute',
					'endHour',
					'endMinute',
				];
			case 2:
				return ['hallOpt'];
			case 3:
				return [];
			case 4:
				return ['acceptTerms'];
			default:
				return [];
		}
	};

	const nextStep = async () => {
		const isValid = await validateCurrentStep();
		if (isValid && currentStep < steps.length - 1) {
			setCurrentStep(currentStep + 1);
		}
	};

	const prevStep = () => {
		if (currentStep > 0) {
			setCurrentStep(currentStep - 1);
		}
	};

	const onSubmit = async (data: StepperFormData) => {
		try {
			// Remove acceptTerms from the data before submission
			const { ...submissionData } = data;
			const result = await handleSubmit(
				submissionData as ReserveLectureFormData,
				'pending'
			);
			console.log('Lecture form submitted:', submissionData);
			// Show success dialog if submission was successful
			if (result) {
				setShowSuccessDialog(true);
			}
		} catch (error) {
			console.error('Submission error:', error);
		}
	};

	const saveDraft = async () => {
		const currentData = form.getValues();

		// For draft, require course code and date
		if (!currentData.course?.trim()) {
			toast.error('Course code is required to save a draft');
			return;
		}

		if (!currentData.date) {
			toast.error('Date must be selected to save a draft');
			return;
		}

		try {
			await handleSubmit(currentData, 'draft');
			toast.success('Draft saved successfully!');
		} catch (error) {
			toast.error('Failed to save draft');
			console.error('Draft save error:', error);
		}
	};

	return (
		<div className='w-full mx-auto'>
			<Card className='min-h-[calc(100vh-200px)] flex flex-col'>
				<CardContent className='px-6 flex flex-col flex-1'>
					{/* Stepper */}
					<Stepper currentStep={currentStep} steps={steps} />
					<Separator className='mb-4' />

					{/* Form Content */}
					<div className='flex-1 flex flex-col'>
						<Form {...form}>
							<form className='w-full flex-1 flex flex-col'>
								<div className='flex-1'>
									{/* Step 1: Course Information */}
									{currentStep === 0 && (
										<CourseInformationStep
											form={form}
											courseCodeOptions={
												courseCodeOptions
											}
										/>
									)}

									{/* Step 2: Date and Time */}
									{currentStep === 1 && (
										<DateTimeStep form={form} />
									)}

									{/* Step 3: Venue Selection */}
									{currentStep === 2 && (
										<VenueStep
											form={form}
											hallOptions={hallOptions}
											halls={halls}
											hallSelection={hallSelection}
											loadingHalls={loadingHalls}
										/>
									)}

									{/* Step 4: Equipment & Notes */}
									{currentStep === 3 && (
										<ExtrasStep form={form} />
									)}

									{/* Step 5: Review & Submit */}
									{currentStep === 4 && (
										<ReviewStep
											form={form}
											watchedValues={watchedValues}
											courseCodeOptions={
												courseCodeOptions
											}
											halls={halls}
										/>
									)}
								</div>
							</form>
						</Form>
					</div>

					{/* Navigation Buttons - Always at bottom */}
					<div className='mt-6 pt-6 border-t flex justify-between'>
						{currentStep === 0 ? (
							<Button
								type='button'
								variant='outline'
								onClick={onBackToSelection}
								disabled={isSubmitted}
								className='flex items-center gap-2'
							>
								<ChevronLeft className='h-4 w-4' />
								Back to Selection
							</Button>
						) : (
							<Button
								type='button'
								variant='outline'
								onClick={prevStep}
								disabled={isLoading || isSubmitted}
								className='flex items-center gap-2'
							>
								<ChevronLeft className='h-4 w-4' />
								Previous
							</Button>
						)}

						<div className='flex items-center gap-3'>
							<Button
								type='button'
								variant='outline'
								onClick={saveDraft}
								disabled={isLoading || isSubmitted}
							>
								Save Draft
							</Button>

							{currentStep < steps.length - 1 ? (
								<Button
									type='button'
									onClick={nextStep}
									disabled={isLoading || isSubmitted}
									className='flex items-center gap-2'
								>
									Next
									<ChevronRight className='h-4 w-4' />
								</Button>
							) : (
								<Button
									type='button'
									disabled={isLoading || isSubmitted}
									className='flex items-center gap-2'
									onClick={form.handleSubmit(onSubmit)}
								>
									{isSubmitted
										? 'Submitted ✓'
										: isLoading
											? 'Submitting...'
											: 'Submit Lecture Request'}
								</Button>
							)}
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Success Dialog */}
			<AlertDialog
				open={showSuccessDialog}
				onOpenChange={setShowSuccessDialog}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle className='flex items-center gap-2 text-green-600'>
							<CheckCircle className='h-5 w-5' />
							Lecture Request Submitted Successfully!
						</AlertDialogTitle>
						<AlertDialogDescription>
							Your lecture request has been submitted for
							approval. You&apos;ll receive a confirmation email
							shortly with further details.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogAction
							onClick={() => {
								setShowSuccessDialog(false);
								router.push('/reserve');
							}}
						>
							OK
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}

// Step Components
function CourseInformationStep({
	form,
	courseCodeOptions,
}: {
	form: UseFormReturn<StepperFormData>;
	courseCodeOptions: { label: string; value: string }[];
}) {
	return (
		<div className='space-y-6'>
			{/* Main row with separator - similar to event form */}
			<div className='grid grid-cols-2 gap-8 relative'>
				{/* Left side: Course Code and Lecture Type */}
				<div className='space-y-4'>
					<FormField
						control={form.control}
						name='course'
						render={({ field }) => (
							<FormItem className='flex flex-col'>
								<FormLabel>Course Code</FormLabel>
								<FormControl>
									<Combobox
										options={courseCodeOptions}
										value={field.value ?? ''}
										onChange={field.onChange}
										placeholder={
											courseCodeOptions.length === 0
												? 'Loading courses...'
												: 'Select Course Code'
										}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name='type'
						render={({ field }) => (
							<FormItem className='flex flex-col'>
								<FormLabel>Lecture Type</FormLabel>
								<FormControl>
									<Combobox
										options={eventTypeOptions}
										value={field.value ?? ''}
										onChange={field.onChange}
										placeholder='Select Lecture Type'
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				{/* Vertical separator */}
				<div className='absolute left-1/2 top-0 bottom-0 w-px bg-border transform -translate-x-1/2'></div>

				{/* Right side: Additional course info placeholder */}
				<div className='space-y-4'>
					<div className='p-4 bg-muted/50 rounded-lg h-full flex flex-col justify-center'>
						<h4 className='text-sm font-medium text-muted-foreground mb-2'>
							Course Information
						</h4>
						<p className='text-xs text-muted-foreground'>
							Select a course code to view additional details and
							ensure the lecture type matches your requirements.
						</p>
					</div>
				</div>
			</div>

			{/* Lecture Description (full width) */}
			<FormField
				control={form.control}
				name='description'
				render={({ field }) => (
					<FormItem className='flex flex-col'>
						<FormLabel>Lecture Description (Optional)</FormLabel>
						<FormControl>
							<Input
								placeholder='A supplementary lecture to discuss advanced concepts and practical applications.'
								value={field.value ?? ''}
								onChange={(e) => field.onChange(e.target.value)}
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
		</div>
	);
}

function DateTimeStep({ form }: { form: UseFormReturn<StepperFormData> }) {
	const [startTime, setStartTime] = useState('08:30');
	const [endTime, setEndTime] = useState('10:30');

	const addHoursToTime = (timeStr: string, hours: number) => {
		const [hourStr, minuteStr] = timeStr.split(':');
		const startHour = parseInt(hourStr);
		const startMinute = parseInt(minuteStr);

		const totalMinutes = startHour * 60 + startMinute + hours * 60;
		const newHour = Math.floor(totalMinutes / 60) % 24;
		const newMinute = totalMinutes % 60;

		// Round to nearest 5-minute interval
		const roundedMinute = Math.round(newMinute / 5) * 5;
		const finalHour = roundedMinute === 60 ? (newHour + 1) % 24 : newHour;
		const finalMinute = roundedMinute === 60 ? 0 : roundedMinute;

		return `${finalHour.toString().padStart(2, '0')}:${finalMinute.toString().padStart(2, '0')}`;
	};

	const handleStartTimeChange = (time: string) => {
		setStartTime(time);
		form.setValue('startHour', time.split(':')[0]);
		form.setValue('startMinute', time.split(':')[1]);
	};

	const handleEndTimeChange = (time: string) => {
		setEndTime(time);
		form.setValue('endHour', time.split(':')[0]);
		form.setValue('endMinute', time.split(':')[1]);
	};

	const handleDurationSelect = (hours: number) => {
		const newEndTime = addHoursToTime(startTime, hours);
		setEndTime(newEndTime);
		form.setValue('endHour', newEndTime.split(':')[0]);
		form.setValue('endMinute', newEndTime.split(':')[1]);
	};

	const handleDateShortcut = (days: number) => {
		const today = new Date();
		const targetDate = new Date(
			today.getTime() + days * 24 * 60 * 60 * 1000
		);
		form.setValue('date', targetDate);
	};

	return (
		<div className='grid grid-cols-2 gap-8 relative'>
			{/* Left side: Date and shortcuts */}
			<div className='space-y-4'>
				<div className='space-y-2'>
					<FormLabel>Date</FormLabel>
					<FormField
						control={form.control}
						name='date'
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<DatePickerDemo
										value={field.value}
										onChange={(date) =>
											field.onChange(date)
										}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				<div className='space-y-2'>
					<FormLabel>Quick Date Selection</FormLabel>
					<div className='grid grid-cols-2 gap-2'>
						<Button
							type='button'
							variant='outline'
							size='sm'
							onClick={() => handleDateShortcut(0)}
							className='h-8'
						>
							Today
						</Button>
						<Button
							type='button'
							variant='outline'
							size='sm'
							onClick={() => handleDateShortcut(1)}
							className='h-8'
						>
							Tomorrow
						</Button>
						<Button
							type='button'
							variant='outline'
							size='sm'
							onClick={() => handleDateShortcut(2)}
							className='h-8'
						>
							In 2 Days
						</Button>
						<Button
							type='button'
							variant='outline'
							size='sm'
							onClick={() => handleDateShortcut(7)}
							className='h-8'
						>
							In a Week
						</Button>
						<Button
							type='button'
							variant='outline'
							size='sm'
							onClick={() => handleDateShortcut(14)}
							className='h-8'
						>
							In 2 Weeks
						</Button>
						<Button
							type='button'
							variant='outline'
							size='sm'
							onClick={() => handleDateShortcut(30)}
							className='h-8'
						>
							In a Month
						</Button>
					</div>
				</div>
			</div>

			{/* Vertical separator */}
			<div className='absolute left-1/2 top-0 bottom-0 w-px bg-border transform -translate-x-1/2'></div>

			{/* Right side: Time components */}
			<div className='space-y-4'>
				<div className='space-y-2'>
					<FormLabel>Start Time</FormLabel>
					<FormField
						control={form.control}
						name='startHour'
						render={({}) => (
							<FormItem>
								<FormControl>
									<Input
										type='time'
										step='300'
										value={startTime}
										onChange={(e) =>
											handleStartTimeChange(
												e.target.value
											)
										}
										className='bg-background w-fit'
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				<div className='space-y-2'>
					<FormLabel>Duration</FormLabel>
					<div className='flex gap-2 flex-wrap'>
						<Button
							type='button'
							variant='outline'
							size='sm'
							onClick={() => handleDurationSelect(1)}
							className='h-8'
						>
							1 hour
						</Button>
						<Button
							type='button'
							variant='outline'
							size='sm'
							onClick={() => handleDurationSelect(2)}
							className='h-8'
						>
							2 hours
						</Button>
						<Button
							type='button'
							variant='outline'
							size='sm'
							onClick={() => handleDurationSelect(3)}
							className='h-8'
						>
							3 hours
						</Button>
						<Button
							type='button'
							variant='outline'
							size='sm'
							onClick={() => handleDurationSelect(4)}
							className='h-8'
						>
							4 hours
						</Button>
					</div>
				</div>

				<div className='space-y-2'>
					<FormLabel>End Time</FormLabel>
					<FormField
						control={form.control}
						name='endHour'
						render={({}) => (
							<FormItem>
								<FormControl>
									<Input
										type='time'
										step='300'
										value={endTime}
										onChange={(e) =>
											handleEndTimeChange(e.target.value)
										}
										className='bg-background w-fit'
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
			</div>
		</div>
	);
}

function VenueStep({
	form,
	// hallOptions,
	halls,
	hallSelection,
	loadingHalls,
}: {
	form: UseFormReturn<StepperFormData>;
	hallOptions: { value: string; label: string }[];
	halls: { value: string; label: string }[];
	hallSelection: string;
	loadingHalls: boolean;
}) {
	// Dynamically fetch attendee count from course capacity
	const selectedCourseId = useWatch({
		control: form.control,
		name: 'course',
	});

	const [attendeeCount, setAttendeeCount] = useState<number | null>(null);

	useEffect(() => {
		async function fetchCourseCapacity(courseId: string) {
			if (!courseId) {
				setAttendeeCount(null);
				return;
			}
			try {
				const { data, error } = await supabase
					.from('course')
					.select('capacity')
					.eq('id', courseId)
					.single();
				if (error || !data) {
					setAttendeeCount(null);
				} else {
					setAttendeeCount(data.capacity ?? null);
				}
			} catch {
				setAttendeeCount(null);
			}
		}
		fetchCourseCapacity(selectedCourseId);
	}, [selectedCourseId]);

	return (
		<div className='space-y-6'>
			{/* Hall Selection Method and Attendee Count */}
			<div className='grid grid-cols-2 gap-8 relative'>
				{/* Left side: Hall Selection */}
				<div className='space-y-4'>
					<FormField
						control={form.control}
						name='hallOpt'
						render={({ field }) => (
							<FormItem className='flex flex-col'>
								<FormLabel>Request Hall By</FormLabel>
								<FormControl>
									<div className='space-y-3'>
										<div className='flex items-center gap-3'>
											<input
												type='radio'
												id='availability'
												value='availability'
												checked={
													field.value ===
													'availability'
												}
												onChange={() =>
													field.onChange(
														'availability'
													)
												}
												className='h-4 w-4 text-primary focus:ring-primary border-gray-300'
												aria-label='Request hall by availability'
											/>
											<Label
												htmlFor='availability'
												className='text-sm font-medium'
											>
												Availability
											</Label>
										</div>
										<div className='flex items-center gap-3'>
											<input
												type='radio'
												id='manual'
												value='manual'
												checked={
													field.value === 'manual'
												}
												onChange={() =>
													field.onChange('manual')
												}
												className='h-4 w-4 text-primary focus:ring-primary border-gray-300'
												aria-label='Manual hall selection'
											/>
											<Label
												htmlFor='manual'
												className='text-sm font-medium'
											>
												Manual
											</Label>
										</div>
									</div>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					{hallSelection === 'availability' && (
						<div className='text-sm text-muted-foreground bg-muted/50 p-3 rounded-md'>
							A hall will be selected based on availability &
							course requirements.
						</div>
					)}

					{hallSelection === 'manual' && (
						<>
							<div className='text-sm text-muted-foreground bg-muted/50 p-3 rounded-md'>
								Select the preferred hall. If not available, you
								will be notified.
							</div>
							<FormField
								control={form.control}
								name='hall'
								render={({ field }) => (
									<FormItem className='flex flex-col'>
										<FormLabel>Select Hall</FormLabel>
										<FormControl>
											<Combobox
												options={halls}
												value={field.value ?? ''}
												onChange={(val) =>
													field.onChange(val)
												}
												placeholder={
													loadingHalls
														? 'Loading halls...'
														: 'Select Hall'
												}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</>
					)}
				</div>

				{/* Vertical separator */}
				<div className='absolute left-1/2 top-0 bottom-0 w-px bg-border transform -translate-x-1/2'></div>

				{/* Right side: Attendee Information */}
				<div className='space-y-4'>
					<div className='flex flex-col'>
						<FormLabel>Number of Attendees</FormLabel>
						<div className='mt-2 p-3 bg-muted/50 rounded-md border border-dashed border-muted-foreground/25'>
							<div className='text-2xl font-semibold text-foreground mb-1'>
								{attendeeCount !== null ? attendeeCount : '—'}
							</div>
							<div className='text-xs text-muted-foreground'>
								Typical course capacity
							</div>
						</div>
					</div>

					<div className='text-sm text-muted-foreground bg-blue-50 p-3 rounded-md border border-blue-200'>
						<div className='flex items-start gap-2'>
							<div className='w-4 h-4 rounded-full bg-blue-500 mt-0.5 flex-shrink-0'></div>
							<div>
								<div className='font-medium text-blue-900 mb-1'>
									Course-based Capacity
								</div>
								<div className='text-blue-700'>
									Attendee count is automatically determined
									based on the selected course enrollment and
									typical lecture attendance.
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

function ExtrasStep({ form }: { form: UseFormReturn<StepperFormData> }) {
	const availableEquipment = [
		{
			id: 'projector',
			name: 'Projector',
			description: 'HD multimedia projector',
		},
		{
			id: 'microphone',
			name: 'Microphone',
			description: 'Wireless microphone system',
		},
		{
			id: 'speakers',
			name: 'Sound System',
			description: 'Professional speakers and amplifier',
		},
		{
			id: 'whiteboard',
			name: 'Whiteboard',
			description: 'Large whiteboard with markers',
		},
		{
			id: 'flipchart',
			name: 'Flip Chart',
			description: 'Flip chart stand with paper',
		},
		{
			id: 'laptop',
			name: 'Laptop',
			description: 'Presentation laptop with adapters',
		},
		{
			id: 'extension',
			name: 'Extension Cords',
			description: 'Power extension cables',
		},
		{
			id: 'podium',
			name: 'Podium',
			description: 'Standing presentation podium',
		},
	];

	const selectedEquipment =
		useWatch({
			control: form.control,
			name: 'equipment',
		}) || [];

	const handleEquipmentToggle = (equipmentId: string) => {
		const currentEquipment = form.getValues('equipment') || [];
		const updatedEquipment = currentEquipment.includes(equipmentId)
			? currentEquipment.filter((id) => id !== equipmentId)
			: [...currentEquipment, equipmentId];
		form.setValue('equipment', updatedEquipment);
	};

	return (
		<div className='space-y-6'>
			{/* Equipment Selection and Additional Notes */}
			<div className='grid grid-cols-2 gap-8 relative'>
				{/* Left side: Equipment Selection */}
				<div className='space-y-4'>
					<div>
						<FormLabel className='text-base font-medium'>
							Equipment & Resources (Optional)
						</FormLabel>
						<p className='text-sm text-muted-foreground mt-1'>
							Select any equipment you need for your lecture
						</p>
					</div>

					<div className='grid grid-cols-2 gap-3'>
						{availableEquipment.map((equipment) => (
							<div
								key={equipment.id}
								className='flex items-start gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors'
							>
								<Checkbox
									id={equipment.id}
									checked={selectedEquipment.includes(
										equipment.id
									)}
									onCheckedChange={() =>
										handleEquipmentToggle(equipment.id)
									}
									aria-label={`Select ${equipment.name}`}
								/>
								<div className='flex-1 min-w-0'>
									<Label
										htmlFor={equipment.id}
										className='text-sm font-medium cursor-pointer'
									>
										{equipment.name}
									</Label>
									<p className='text-xs text-muted-foreground mt-1'>
										{equipment.description}
									</p>
								</div>
							</div>
						))}
					</div>

					{selectedEquipment.length > 0 && (
						<div className='text-sm text-muted-foreground bg-muted/50 p-3 rounded-md'>
							<strong>Selected:</strong>{' '}
							{selectedEquipment.length} item(s)
						</div>
					)}
				</div>

				{/* Vertical separator */}
				<div className='absolute left-1/2 top-0 bottom-0 w-px bg-border transform -translate-x-1/2'></div>

				{/* Right side: Additional Notes and Documents */}
				<div className='space-y-4'>
					<FormField
						control={form.control}
						name='additionalNotes'
						render={({ field }) => (
							<FormItem>
								<FormLabel>
									Additional Notes (Optional)
								</FormLabel>
								<FormControl>
									<Textarea
										value={field.value ?? ''}
										onChange={(e) =>
											field.onChange(e.target.value)
										}
										placeholder='Any additional requirements, special requests, or setup instructions...'
										rows={6}
										className='resize-none'
									/>
								</FormControl>
								<FormDescription>
									Include any special setup requirements,
									accessibility needs, or other important
									details for your lecture.
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name='additionalDocuments'
						render={({ field }) => (
							<FormItem className='flex flex-col'>
								<FormLabel>
									Additional Documents (Optional)
								</FormLabel>
								<FormControl>
									<Input
										type='file'
										accept='.csv,.xlsx,.xls,.pdf,.doc,.docx,.jpg,.jpeg,.png'
										onChange={(e) =>
											field.onChange(e.target.files)
										}
									/>
								</FormControl>
								<FormDescription>
									Upload supporting documents, permits, or
									other relevant files. Accepted formats: CSV,
									Excel, PDF, Word, Images (JPG, PNG). Maximum
									file size: 10MB.
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
			</div>
		</div>
	);
}

function ReviewStep({
	form,
	watchedValues,
	courseCodeOptions,
	halls,
}: {
	form: UseFormReturn<StepperFormData>;
	watchedValues: Partial<StepperFormData>;
	courseCodeOptions: { label: string; value: string }[];
	halls: { value: string; label: string }[];
}) {
	const selectedCourse = courseCodeOptions.find(
		(c) => c.value === watchedValues.course
	);
	const selectedHall = halls.find((h) => h.value === watchedValues.hall);

	return (
		<div className='space-y-4'>
			<div className='text-center mb-6'>
				<h3 className='text-xl font-semibold'>
					Review & Submit Your Lecture Request
				</h3>
			</div>

			<div className='p-3 bg-muted rounded-md mb-6'>
				<p className='text-sm text-muted-foreground'>
					<strong>Please note:</strong> If your requested hall or time
					slot is not available, you may need to update your
					preferences and resubmit your request. We&apos;ll provide
					alternative options when possible.
				</p>
			</div>

			{/* Step 1: Information */}
			<div className='space-y-6'>
				<div>
					<h4 className='text-sm font-semibold mb-3 pb-2 border-b'>
						Information
					</h4>
					<div className='grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3'>
						<div>
							<Label className='text-sm font-medium'>
								Course
							</Label>
							<p className='text-sm text-muted-foreground mt-1'>
								{selectedCourse?.label || 'Not selected'}
							</p>
						</div>

						<div>
							<Label className='text-sm font-medium'>
								Lecture Type
							</Label>
							<p className='text-sm text-muted-foreground mt-1'>
								{watchedValues.type || 'Not selected'}
							</p>
						</div>
					</div>

					{watchedValues.description && (
						<div className='mt-4'>
							<Label className='text-sm font-medium'>
								Lecture Description
							</Label>
							<p className='text-sm text-muted-foreground mt-1'>
								{watchedValues.description}
							</p>
						</div>
					)}
				</div>

				{/* Step 2: Date & Time */}
				<div>
					<h4 className='text-sm font-semibold mb-3 pb-2 border-b'>
						Date & Time
					</h4>
					<div className='grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3'>
						<div>
							<Label className='text-sm font-medium'>Date</Label>
							<p className='text-sm text-muted-foreground mt-1'>
								{watchedValues.date
									? watchedValues.date.toLocaleDateString(
											'en-US',
											{
												weekday: 'long',
												year: 'numeric',
												month: 'long',
												day: 'numeric',
											}
										)
									: 'Not selected'}
							</p>
						</div>

						<div>
							<Label className='text-sm font-medium'>Time</Label>
							<p className='text-sm text-muted-foreground mt-1'>
								{watchedValues.startHour &&
								watchedValues.startMinute &&
								watchedValues.endHour &&
								watchedValues.endMinute
									? `${watchedValues.startHour}:${watchedValues.startMinute} - ${watchedValues.endHour}:${watchedValues.endMinute}`
									: 'Not selected'}
							</p>
						</div>
					</div>
				</div>

				{/* Step 3: Venue & Attendees */}
				<div>
					<h4 className='text-sm font-semibold mb-3 pb-2 border-b'>
						Venue & Attendees
					</h4>
					<div className='grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3'>
						<div>
							<Label className='text-sm font-medium'>
								Attendee Count
							</Label>
							<p className='text-sm text-muted-foreground mt-1'>
								35 people (Course capacity)
							</p>
						</div>

						<div>
							<Label className='text-sm font-medium'>
								Hall Selection
							</Label>
							<p className='text-sm text-muted-foreground mt-1'>
								{watchedValues.hallOpt === 'availability'
									? 'By Availability'
									: watchedValues.hallOpt === 'manual'
										? `Manual: ${selectedHall?.label || watchedValues.hall || 'Not selected'}`
										: 'Not selected'}
							</p>
						</div>
					</div>
				</div>

				{/* Step 4: Extras */}
				{(watchedValues.equipment &&
					watchedValues.equipment.length > 0) ||
				watchedValues.additionalNotes ||
				(watchedValues.additionalDocuments &&
					watchedValues.additionalDocuments.length > 0) ? (
					<div>
						<h4 className='text-sm font-semibold mb-3 pb-2 border-b'>
							Extras
						</h4>
						<div className='grid grid-cols-1 gap-y-3'>
							{watchedValues.equipment &&
								watchedValues.equipment.length > 0 && (
									<div>
										<Label className='text-sm font-medium'>
											Equipment (
											{watchedValues.equipment.length}{' '}
											items)
										</Label>
										<div className='mt-1 flex flex-wrap gap-2'>
											{watchedValues.equipment.map(
												(equipmentId) => {
													const equipmentNames: {
														[key: string]: string;
													} = {
														projector: 'Projector',
														microphone:
															'Microphone',
														speakers:
															'Sound System',
														whiteboard:
															'Whiteboard',
														flipchart: 'Flip Chart',
														laptop: 'Laptop',
														extension:
															'Extension Cords',
														podium: 'Podium',
													};
													return (
														<span
															key={equipmentId}
															className='text-xs bg-muted px-2 py-1 rounded'
														>
															{equipmentNames[
																equipmentId
															] || equipmentId}
														</span>
													);
												}
											)}
										</div>
									</div>
								)}

							{watchedValues.additionalNotes && (
								<div>
									<Label className='text-sm font-medium'>
										Additional Notes
									</Label>
									<p className='text-sm text-muted-foreground mt-1 whitespace-pre-wrap'>
										{watchedValues.additionalNotes}
									</p>
								</div>
							)}

							{watchedValues.additionalDocuments &&
								watchedValues.additionalDocuments.length >
									0 && (
									<div>
										<Label className='text-sm font-medium'>
											Additional Documents
										</Label>
										<p className='text-sm text-muted-foreground mt-1'>
											File uploaded:{' '}
											{watchedValues
												.additionalDocuments[0]?.name ||
												'Unknown file'}
										</p>
									</div>
								)}
						</div>
					</div>
				) : null}
			</div>

			{/* Confirmation */}
			<div className='mt-6 pt-4 border-t'>
				<FormField
					control={form.control}
					name='acceptTerms'
					render={({ field }) => (
						<FormItem className='flex flex-row items-start space-x-3 space-y-0'>
							<FormControl>
								<Checkbox
									checked={field.value}
									onCheckedChange={field.onChange}
								/>
							</FormControl>
							<div className='space-y-1 leading-none'>
								<FormLabel className='text-sm font-medium'>
									I confirm that all the information provided
									above is accurate and complete.
								</FormLabel>
								<FormMessage />
							</div>
						</FormItem>
					)}
				/>
			</div>

			<div className='mt-4 p-3 bg-muted rounded-md'>
				<p className='text-sm text-muted-foreground'>
					After submission, you will be notified via email about the
					status of your lecture request. Admins will review your
					request and confirm availability within 24-48 hours.
				</p>
			</div>
		</div>
	);
}

'use client';

import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, UseFormReturn, useWatch } from 'react-hook-form';
import { z } from 'zod';
import { Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	// CardDescription,
	// CardHeader,
	// CardTitle,
} from '@/components/ui/card';
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
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Combobox } from '@/components/combobox';
import { eventTypeOptions } from './reserve.event.data';
import { DatePickerDemo } from '@/components/ui/DatePicker';
import { Textarea } from '@/components/ui/textarea';

// Form schema with all steps
const formSchema = z.object({
	// Step 1: Event Information
	name: z.string().min(2, 'Event name must be at least 2 characters'),
	description: z.string().optional(),
	type: z.string().min(1, 'Event type is required'),

	// Step 2: Date and Time
	date: z.date({ required_error: 'Date is required' }),
	startHour: z.string().min(1, 'Start hour is required'),
	startMinute: z.string().min(1, 'Start minute is required'),
	endHour: z.string().min(1, 'End hour is required'),
	endMinute: z.string().min(1, 'End minute is required'),

	// Step 3: Venue and Attendees
	organizer: z.string().min(2, 'Organizer name is required'),
	attendeeCount: z.preprocess(
		(val) => {
			if (val === '' || val === null || val === undefined)
				return undefined;
			const num = Number(val);
			return isNaN(num) ? undefined : num;
		},
		z
			.number()
			.min(1, 'At least 1 attendee is required')
			.max(500, 'Maximum 500 attendees allowed')
	),
	attendeeList: z
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
	hallOpt: z.string().min(1, 'Hall selection method is required'),
	hall: z.string().optional(), // Only required if hallOpt is 'manual'

	// Step 4: Additional Details & Equipment
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
		id: 'event',
		title: 'Information',
		description: 'Basic event details',
	},
	{
		id: 'datetime',
		title: 'Date & Time',
		description: 'Schedule your event',
	},
	{
		id: 'venue',
		title: 'Venue & Attendees',
		description: 'Hall and attendee details',
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
											? 'border-primary bg-background text-primary'
											: 'border-muted-foreground/25 bg-background text-muted-foreground'
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
							<div className='mt-2 text-center max-w-[160px]'>
								<p className='text-sm font-medium'>
									{step.title}
								</p>
								<p className='text-xs text-muted-foreground'>
									{step.description}
								</p>
							</div>
						</div>
						{index < steps.length - 1 && (
							<div className='flex-1 mx-4'>
								<Separator
									className={`h-px w-full ${index < currentStep ? 'bg-primary' : 'bg-muted-foreground/25'}`}
								/>
							</div>
						)}
					</React.Fragment>
				))}
			</div>
		</div>
	);
}

function EventInfoStep({ form }: { form: UseFormReturn<FormData> }) {
	return (
		<div className='space-y-6'>
			{/* Main row with separator */}
			<div className='grid grid-cols-2 gap-8 relative'>
				{/* Left side: Event Name and Event Type */}
				<div className='space-y-4'>
					<FormField
						control={form.control}
						name='name'
						render={({ field }) => (
							<FormItem className='flex flex-col'>
								<FormLabel>Event Name</FormLabel>
								<FormControl>
									<Input
										placeholder='Annual Tech Conference'
										{...field}
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
								<FormLabel>Event Type</FormLabel>
								<FormControl>
									<Combobox
										options={eventTypeOptions}
										value={field.value ?? ''}
										onChange={(val) => field.onChange(val)}
										placeholder='Select Event Type'
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				{/* Vertical separator */}
				<div className='absolute left-1/2 top-0 bottom-0 w-px bg-border transform -translate-x-1/2'></div>

				{/* Right side: Organizer */}
				<div className='space-y-4'>
					<FormField
						control={form.control}
						name='organizer'
						render={({ field }) => (
							<FormItem className='flex flex-col'>
								<FormLabel>Organizer</FormLabel>
								<FormControl>
									<Input
										placeholder='Vibe Society'
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
			</div>

			{/* Event Description (full width) */}
			<FormField
				control={form.control}
				name='description'
				render={({ field }) => (
					<FormItem className='flex flex-col'>
						<FormLabel>Event Description (Optional)</FormLabel>
						<FormControl>
							<Input
								placeholder='A professional gathering to discuss emerging trends in technology and innovation.'
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

function DateTimeStep({ form }: { form: UseFormReturn<FormData> }) {
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
							onClick={() => handleDurationSelect(4)}
							className='h-8'
						>
							4 hours
						</Button>
						<Button
							type='button'
							variant='outline'
							size='sm'
							onClick={() => handleDurationSelect(6)}
							className='h-8'
						>
							6 hours
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

function VenueStep({ form }: { form: UseFormReturn<FormData> }) {
	const halls = [
		{ value: 'LCH-AB-01', label: 'LCH-AB-01' },
		{ value: 'LCH-AB-02', label: 'LCH-AB-02' },
	];

	const hallSelection = useWatch({
		control: form.control,
		name: 'hallOpt',
	});

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
							attendee count.
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
												placeholder='Select Hall'
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
					<FormField
						control={form.control}
						name='attendeeCount'
						render={({ field }) => (
							<FormItem className='flex flex-col'>
								<FormLabel>Number of Attendees</FormLabel>
								<FormControl>
									<Input
										type='number'
										placeholder='60'
										min='1'
										max='500'
										value={field.value || ''}
										onChange={(e) => {
											const value = e.target.value;
											field.onChange(
												value === ''
													? ''
													: parseInt(value) || ''
											);
										}}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<div className='space-y-2'>
						<FormLabel>Quick Attendee Count</FormLabel>
						<div className='grid grid-cols-3 gap-2'>
							<Button
								type='button'
								variant='outline'
								size='sm'
								onClick={() =>
									form.setValue('attendeeCount', 30)
								}
								className='h-8'
							>
								30
							</Button>
							<Button
								type='button'
								variant='outline'
								size='sm'
								onClick={() =>
									form.setValue('attendeeCount', 60)
								}
								className='h-8'
							>
								60
							</Button>
							<Button
								type='button'
								variant='outline'
								size='sm'
								onClick={() =>
									form.setValue('attendeeCount', 90)
								}
								className='h-8'
							>
								90
							</Button>
							<Button
								type='button'
								variant='outline'
								size='sm'
								onClick={() =>
									form.setValue('attendeeCount', 100)
								}
								className='h-8'
							>
								100
							</Button>
							<Button
								type='button'
								variant='outline'
								size='sm'
								onClick={() =>
									form.setValue('attendeeCount', 120)
								}
								className='h-8'
							>
								120
							</Button>
							<Button
								type='button'
								variant='outline'
								size='sm'
								onClick={() =>
									form.setValue('attendeeCount', 150)
								}
								className='h-8'
							>
								150
							</Button>
						</div>
					</div>

					<FormField
						control={form.control}
						name='attendeeList'
						render={({ field }) => (
							<FormItem className='flex flex-col'>
								<FormLabel>
									Attendee List/Documents (Optional)
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
									Upload attendance related documents.
									Accepted formats: CSV, Excel, PDF, Word,
									Images (JPG, PNG). Maximum file size: 10MB.
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

function DetailsStep({ form }: { form: UseFormReturn<FormData> }) {
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
							Select any equipment you need for your event
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
									details for your event.
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

function ReviewStep({ form }: { form: UseFormReturn<FormData> }) {
	const values = form.getValues();

	return (
		<div className='space-y-4'>
			<div className='text-center mb-6'>
				<h3 className='text-xl font-semibold'>
					Review & Submit Your Event Reservation
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
								Event Name
							</Label>
							<p className='text-sm text-muted-foreground mt-1'>
								{values.name || 'Not specified'}
							</p>
						</div>

						<div>
							<Label className='text-sm font-medium'>
								Event Type
							</Label>
							<p className='text-sm text-muted-foreground mt-1'>
								{values.type || 'Not selected'}
							</p>
						</div>

						<div>
							<Label className='text-sm font-medium'>
								Organizer
							</Label>
							<p className='text-sm text-muted-foreground mt-1'>
								{values.organizer || 'Not specified'}
							</p>
						</div>
					</div>

					{values.description && (
						<div className='mt-4'>
							<Label className='text-sm font-medium'>
								Event Description
							</Label>
							<p className='text-sm text-muted-foreground mt-1'>
								{values.description}
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
								{values.date
									? values.date.toLocaleDateString('en-US', {
											weekday: 'long',
											year: 'numeric',
											month: 'long',
											day: 'numeric',
										})
									: 'Not selected'}
							</p>
						</div>

						<div>
							<Label className='text-sm font-medium'>Time</Label>
							<p className='text-sm text-muted-foreground mt-1'>
								{values.startHour &&
								values.startMinute &&
								values.endHour &&
								values.endMinute
									? `${values.startHour}:${values.startMinute} - ${values.endHour}:${values.endMinute}`
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
								{values.attendeeCount || 0} people
							</p>
						</div>

						<div>
							<Label className='text-sm font-medium'>
								Hall Selection
							</Label>
							<p className='text-sm text-muted-foreground mt-1'>
								{values.hallOpt === 'availability'
									? 'By Availability'
									: values.hallOpt === 'manual'
										? `Manual: ${values.hall || 'Not selected'}`
										: 'Not selected'}
							</p>
						</div>

						<div>
							<Label className='text-sm font-medium'>
								Attendee List/Documents
							</Label>
							<p className='text-sm text-muted-foreground mt-1'>
								{values.attendeeList &&
								values.attendeeList.length > 0
									? `File uploaded: ${values.attendeeList[0]?.name || 'Unknown file'}`
									: 'No file uploaded'}
							</p>
						</div>
					</div>
				</div>

				{/* Step 4: Extras */}
				{(values.equipment && values.equipment.length > 0) ||
				values.additionalNotes ||
				(values.additionalDocuments &&
					values.additionalDocuments.length > 0) ? (
					<div>
						<h4 className='text-sm font-semibold mb-3 pb-2 border-b'>
							Extras
						</h4>
						<div className='grid grid-cols-1 gap-y-3'>
							{values.equipment &&
								values.equipment.length > 0 && (
									<div>
										<Label className='text-sm font-medium'>
											Equipment ({values.equipment.length}{' '}
											items)
										</Label>
										<div className='mt-1 flex flex-wrap gap-2'>
											{values.equipment.map(
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

							{values.additionalNotes && (
								<div>
									<Label className='text-sm font-medium'>
										Additional Notes
									</Label>
									<p className='text-sm text-muted-foreground mt-1 whitespace-pre-wrap'>
										{values.additionalNotes}
									</p>
								</div>
							)}

							{values.additionalDocuments &&
								values.additionalDocuments.length > 0 && (
									<div>
										<Label className='text-sm font-medium'>
											Additional Documents
										</Label>
										<p className='text-sm text-muted-foreground mt-1'>
											File uploaded:{' '}
											{values.additionalDocuments[0]
												?.name || 'Unknown file'}
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
					status of your reservation request. Admins will review your
					request and confirm availability within 24-48 hours.
				</p>
			</div>
		</div>
	);
}

export default function ReserveEventForm({
	onBackToSelection,
}: {
	onBackToSelection?: () => void;
}) {
	const [currentStep, setCurrentStep] = useState(0);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const form = useForm<FormData>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: '',
			description: '',
			type: '',
			date: undefined,
			startHour: '08',
			startMinute: '30',
			endHour: '10',
			endMinute: '30',
			organizer: '',
			attendeeCount: 60,
			attendeeList: undefined,
			hallOpt: 'availability',
			hall: '',
			equipment: [],
			additionalNotes: '',
			additionalDocuments: undefined,
			acceptTerms: false,
		},
	});

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

	const getFieldsForStep = (step: number): (keyof FormData)[] => {
		switch (step) {
			case 0:
				return ['name', 'type', 'organizer'];
			case 1:
				return [
					'date',
					'startHour',
					'startMinute',
					'endHour',
					'endMinute',
				];
			case 2:
				return ['attendeeCount', 'hallOpt'];
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

	const onSubmit = async (data: FormData) => {
		setIsSubmitting(true);
		try {
			// Here you would typically send the data to your API
			console.log('Event form submitted:', data);
			alert('Event reservation submitted successfully!');
		} catch (error) {
			console.error('Error submitting form:', error);
			alert('Error submitting reservation. Please try again.');
		} finally {
			setIsSubmitting(false);
		}
	};

	const onSaveDraft = async () => {
		try {
			const currentData = form.getValues();

			// Check if event name is provided (minimum requirement)
			if (!currentData.name || currentData.name.trim().length < 2) {
				toast.error('Event name is required to save draft', {
					description:
						'Please enter an event name with at least 2 characters before saving.',
				});
				return;
			}

			// Here you would typically send the draft data to your API
			console.log('Draft saved:', currentData);
			toast.success('Draft saved successfully!', {
				description: 'Your event reservation draft has been saved.',
			});
		} catch (error) {
			console.error('Error saving draft:', error);
			toast.error('Error saving draft', {
				description: 'Please try again.',
			});
		}
	};

	const renderStepContent = () => {
		switch (currentStep) {
			case 0:
				return <EventInfoStep form={form} />;
			case 1:
				return <DateTimeStep form={form} />;
			case 2:
				return <VenueStep form={form} />;
			case 3:
				return <DetailsStep form={form} />;
			case 4:
				return <ReviewStep form={form} />;
			default:
				return null;
		}
	};

	return (
		<div className='w-full mx-auto'>
			<Card className='min-h-[calc(100vh-200px)] flex flex-col'>
				{/* <CardHeader>
					<CardTitle>Account Setup</CardTitle>
					<CardDescription>
						Complete your profile in a few simple steps
					</CardDescription>
				</CardHeader> */}
				<CardContent className='px-6 flex flex-col flex-1'>
					{/* Stepper */}
					<Stepper currentStep={currentStep} steps={steps} />
					<Separator className='mb-4' />

					{/* Form Content */}
					<div className='flex-1 flex flex-col'>
						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(onSubmit)}
								className='w-full flex-1 flex flex-col'
							>
								<div className='flex-1'>
									{renderStepContent()}
								</div>
							</form>
						</Form>
					</div>

					{/* Navigation Buttons - Always at bottom */}
					<div className='mt-6 pt-6 border-t flex justify-between'>
						{currentStep === 0 && onBackToSelection ? (
							<Button
								type='button'
								variant='outline'
								onClick={onBackToSelection}
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
								disabled={currentStep === 0}
								className='flex items-center gap-2'
							>
								<ChevronLeft className='h-4 w-4' />
								Previous
							</Button>
						)}

						<div className='flex items-center gap-3'>
							<Button
								type='button'
								variant='secondary'
								onClick={onSaveDraft}
								className='flex items-center gap-2'
							>
								Save Draft
							</Button>

							{currentStep === steps.length - 1 ? (
								<Button
									type='submit'
									disabled={isSubmitting}
									className='flex items-center gap-2'
									onClick={form.handleSubmit(onSubmit)}
								>
									{isSubmitting
										? 'Submitting...'
										: 'Submit Event'}
								</Button>
							) : (
								<Button
									type='button'
									onClick={nextStep}
									className='flex items-center gap-2'
								>
									Next
									<ChevronRight className='h-4 w-4' />
								</Button>
							)}
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}

'use client';

import { useForm } from 'react-hook-form';
import { useBooking } from '@/app/reserve/lecture/useReserveLecture';
import { Combobox } from '@/components/combobox';
import { DatePickerDemo } from '@/components/ui/DatePicker';
import {
	Form,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
	FormField,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useWatch } from 'react-hook-form';
import { useRef } from 'react';
import {
	ReserveLectureFormData,
	defaultReserveLectureFormData,
} from '@/app/reserve/lecture/reserve.lecture.data';
import {
	eventTypeOptions,
	SubmissionType,
} from '@/app/reserve/lecture/reserve.lecture.data';
import EquipmentSelector from '@/app/reserve/components/EquipmentSelector';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function ReserveLectureForm() {
	const { handleSubmit, isLoading, error, success } = useBooking();

	const form = useForm<ReserveLectureFormData>({
		defaultValues: defaultReserveLectureFormData,
	});

	const onSubmit = (formData: ReserveLectureFormData) => {
		const status = submissionType.current === 'draft' ? 'draft' : 'pending';

		if (status === 'draft' && !formData.course?.trim()) {
			alert('Course code is still required to save a draft.');
			return;
		}
		handleSubmit(formData, status);
	};

	const submissionType = useRef<SubmissionType>('pending');

	const hallOptions = [
		{ value: 'availability', label: 'Availability' },
		{ value: 'manual', label: 'Manually' },
	];

	const hallSelection = useWatch({
		control: form.control,
		name: 'hallOpt',
		defaultValue: 'availability' as 'availability' | 'manual' | '',
	});

	const halls = [
		{ value: 'LCH-AB-01', label: 'LCH-AB-01' },
		{ value: 'LCH-AB-02', label: 'LCH-AB-02' },
	];

	// const courseCodeOptions = [
	// 	{ label: 'CSCI 22012 - Advanced Operating System', value: 'csci22012' },
	// 	{
	// 		label: 'CSCI 22022 - Object Oriented Programming',
	// 		value: 'csci22022',
	// 	},
	// ];

	const [courseCodeOptions, setCourseCodeOptions] = useState<
		{ label: string; value: string }[]
	>([]);

	useEffect(() => {
		const fetchCourses = async () => {
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
					value: course.id, // Use `id` as value for submission
				}));
				setCourseCodeOptions(options);
				console.log('Fetched course options:', options);
			}
		};

		fetchCourses();
	}, []);

	return (
		<Form {...form}>
			<form
				onSubmit={(e) => {
					submissionType.current = 'pending'; // default
					form.handleSubmit(onSubmit)(e);
				}}
			>
				<div className='flex flex-row flex-wrap'>
					<div className='flex flex-row items-start'>
						<div className='w-1/2 px-2'>
							<FormField
								control={form.control}
								name='course'
								rules={{
									required: 'Please select course code',
								}}
								render={({ field }) => (
									<FormItem className='mb-6 flex flex-col'>
										<FormLabel>Course Code:</FormLabel>
										<FormControl>
											<Combobox
												options={courseCodeOptions}
												value={field.value ?? ''}
												onChange={(val) =>
													field.onChange(val)
												}
												// placeholder='Select Course Code'
												placeholder={
													courseCodeOptions.length ===
													0
														? 'Loading courses...'
														: 'Select Course Code'
												}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
					</div>

					<div className='w-1/2 px-2'>
						<FormField
							control={form.control}
							name='description'
							render={({ field }) => (
								<FormItem className='mb-6 flex flex-col'>
									<FormLabel>
										Lecture Description (Opt):
									</FormLabel>
									<FormControl>
										<Input
											value={field.value ?? ''}
											onChange={(description) =>
												field.onChange(description)
											}
											placeholder='A short description'
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
				</div>

				<div className='flex flex-row items-start'>
					{/* Event Type */}
					<div className='w-1/2 px-2'>
						<FormField
							control={form.control}
							name='type'
							rules={{ required: 'Please select lecture type' }}
							render={({ field }) => (
								<FormItem className='mb-6 flex flex-col'>
									<FormLabel>Lecture Type:</FormLabel>
									<FormControl>
										<Combobox
											options={eventTypeOptions}
											value={field.value ?? ''}
											onChange={(val) =>
												field.onChange(val)
											}
											placeholder='Select Event Type'
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
				</div>

				<div className='px-2 mb-4'>
					<Separator />
				</div>

				<div className='px-2'>
					{/* Date */}
					<FormField
						control={form.control}
						name='date'
						rules={{ required: 'Please select date' }}
						render={({ field }) => (
							<FormItem className='mb-6 flex flex-col'>
								<FormLabel>Date:</FormLabel>
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

				<div className='flex flex-row gap-4 px-2 mb-6'>
					<div className='w-1/2'>
						<FormLabel>Start Time:</FormLabel>
						<div className='flex flex-col gap-2 w-1/2'>
							<FormField
								control={form.control}
								name='startHour'
								rules={{ required: 'Start hour is required' }}
								render={({ field }) => (
									<FormItem className='w-1/3'>
										<FormControl>
											<Combobox
												options={Array.from(
													{ length: 24 },
													(_, i) => ({
														label: `${i < 10 ? '0' + String(i) : String(i)}`,
														value: String(i),
													})
												)}
												value={field.value}
												onChange={field.onChange}
												placeholder='Hour'
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name='startMinute'
								rules={{ required: 'Start minute is required' }}
								render={({ field }) => (
									<FormItem className='w-1/3'>
										<FormControl>
											<Combobox
												options={[
													'00',
													'05',
													'10',
													'15',
													'20',
													'25',
													'30',
													'35',
													'40',
													'45',
													'50',
													'55',
												].map((val) => ({
													label: val,
													value: val,
												}))}
												value={field.value}
												onChange={field.onChange}
												placeholder='Min'
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
					</div>

					<div className='w-1/2'>
						<FormLabel>End Time:</FormLabel>
						<div className='flex flex-col gap-2'>
							<FormField
								control={form.control}
								name='endHour'
								rules={{ required: 'End hour is required' }}
								render={({ field }) => (
									<FormItem className='w-1/3'>
										<FormControl>
											<Combobox
												options={Array.from(
													{ length: 24 },
													(_, i) => ({
														label: `${i < 10 ? '0' + String(i) : String(i)}`,
														value: String(i),
													})
												)}
												value={field.value}
												onChange={field.onChange}
												placeholder='Hour'
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name='endMinute'
								rules={{ required: 'End minute is required' }}
								render={({ field }) => (
									<FormItem className='w-1/3'>
										<FormControl>
											<Combobox
												options={[
													'00',
													'05',
													'10',
													'15',
													'20',
													'25',
													'30',
													'35',
													'40',
													'45',
													'50',
													'55',
												].map((val) => ({
													label: val,
													value: val,
												}))}
												value={field.value}
												onChange={field.onChange}
												placeholder='Min'
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
					</div>
				</div>

				<div className='px-2 mb-4'>
					<Separator />
				</div>

				<div className='flex flex-row items-center'>
					{/* Request Hall */}
					<div className='px-2'>
						<FormField
							control={form.control}
							name='hallOpt'
							rules={{
								required: 'Select a hall requesting option!',
							}}
							render={({ field }) => (
								<FormItem className='mb-6 flex flex-col'>
									<FormLabel>Request Hall By:</FormLabel>
									<FormControl>
										<Combobox
											options={hallOptions}
											value={field.value}
											onChange={(val) =>
												field.onChange(val)
											}
											placeholder='Select Requesting Method'
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					{hallSelection === 'availability' && (
						<div className='px-2'>
							<p>
								Most suitable hall will be selected based on
								availability!
							</p>
						</div>
					)}
					{hallSelection === 'manual' && (
						<div className='px-2'>
							<p>Hall needs to be manually selected!</p>
						</div>
					)}
				</div>
				{hallSelection === 'manual' && (
					<div className='px-2'>
						<FormField
							control={form.control}
							name='hall'
							rules={{
								required: 'Select a hall!',
							}}
							render={({ field }) => (
								<FormItem className='mb-6 flex flex-col'>
									<FormLabel>Hall:</FormLabel>
									<FormControl>
										<Combobox
											options={halls}
											value={field.value}
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
					</div>
				)}

				<div className='px-2 mb-4'>
					<Separator />
				</div>

				<FormLabel className='px-2'>
					Request Equipments (Opt):
				</FormLabel>
				<EquipmentSelector />

				<div className='px-2 my-4'>
					<Separator />
				</div>

				<div className='px-2'>
					<FormField
						control={form.control}
						name='additionalNotes'
						render={({ field }) => (
							<FormItem className='mb-6 flex flex-col'>
								<FormLabel>Additional Notes (Opt):</FormLabel>
								<FormControl>
									<Input
										{...field}
										value={field.value ?? ''}
										placeholder='Any additional information or requests'
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				<div className='px-2 my-4'>
					<Separator />
				</div>

				{error && (
					<p className='text-red-600 font-medium mb-4'>
						{submissionType.current === 'draft'
							? 'Failed to save draft. Please try again.'
							: 'Failed to submit booking. Please fix the errors.'}
					</p>
				)}

				{success && (
					<p className='text-green-600 font-medium mt-4'>
						{submissionType.current === 'draft'
							? 'Draft saved successfully!'
							: 'Booking submitted successfully!'}
					</p>
				)}

				<div className='flex gap-4 px-2 py-4 mt-6'>
					<Button
						type='submit'
						disabled={isLoading}
						onClick={() => {
							submissionType.current = 'pending';
						}}
					>
						{isLoading ? 'Submitting...' : 'Submit Booking'}
					</Button>
					<Button type='button' variant='secondary'>
						Reset Form
					</Button>
					<Button
						type='submit'
						variant='secondary'
						disabled={isLoading}
						onClick={() => {
							submissionType.current = 'draft';
							onSubmit(form.getValues()); // This bypasses validation
						}}
					>
						{isLoading ? 'Saving...' : 'Save Draft'}
					</Button>
				</div>
			</form>
		</Form>
	);
}

'use client';

import { useForm } from 'react-hook-form';
import { BookingFormData, defaultBookingFormData } from '../reserve.event.data';
import { useBooking } from '@/app/reserve/event/useReserveEvent';
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
import EquipmentSelector from '../../components/EquipmentSelector';
import { eventTypeOptions, SubmissionType } from '../reserve.event.data';
import { useWatch } from 'react-hook-form';
import { useRef } from 'react';

function BookingForm() {
	// const { handleSubmit, isLoading, error, success, reset } = useBooking();
	const { handleSubmit, isLoading, error, success } = useBooking();

	const form = useForm<BookingFormData>({
		defaultValues: defaultBookingFormData,
	});

	const onSubmit = (formData: BookingFormData) => {
		const status = submissionType.current === 'draft' ? 'draft' : 'pending';

		if (status === 'draft' && !formData.name?.trim()) {
			alert('Event name is still required to save a draft.');
			return;
		}
		handleSubmit(formData, status);
	};

	const hallOptions = [
		{ value: 'availability', label: 'Availability' },
		{ value: 'manual', label: 'Manually' },
	];

	const hallSelection = useWatch({
		control: form.control,
		name: 'hallOpt',
	});

	const halls = [
		{ value: 'LCH-AB-01', label: 'LCH-AB-01' },
		{ value: 'LCH-AB-02', label: 'LCH-AB-02' },
	];

	const submissionType = useRef<SubmissionType>('pending');

	return (
		<Form {...form}>
			<form
				onSubmit={(e) => {
					submissionType.current = 'pending'; // default
					form.handleSubmit(onSubmit)(e);
				}}
			>
				<div className='flex flex-row flex-wrap'>
					{/* Event Name */}
					<div className='w-1/2 px-2'>
						<FormField
							control={form.control}
							name='name'
							rules={{ required: 'Event name is empty!' }}
							render={({ field }) => (
								<FormItem className='mb-6 flex flex-col'>
									<FormLabel>Event Name:</FormLabel>
									<FormControl>
										<Input
											{...field}
											placeholder='Name of the event'
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					<div className='w-1/2 px-2'>
						<FormField
							control={form.control}
							name='description'
							render={({ field }) => (
								<FormItem className='mb-6 flex flex-col'>
									<FormLabel>
										Event Description (Opt):
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
							rules={{ required: 'Please select event type' }}
							render={({ field }) => (
								<FormItem className='mb-6 flex flex-col'>
									<FormLabel>Event Type:</FormLabel>
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
					{/* Organizer */}
					<div className='px-2 w-1/2'>
						<FormField
							control={form.control}
							name='organizer'
							rules={{
								required: 'Please enter event description',
							}}
							render={({ field }) => (
								<FormItem className='mb-6 flex flex-col'>
									<FormLabel>Organized By:</FormLabel>
									<FormControl>
										<Input
											{...field}
											placeholder='Organization'
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

				{/* Time Inputs Section */}
				<div className='flex flex-row gap-4 px-2 mb-6'>
					{/* Start Time */}
					<div className='w-1/2'>
						<FormLabel>Start Time:</FormLabel>
						<div className='flex flex-col gap-2 w-1/2'>
							{/* Hour */}
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
							{/* Minute */}
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

					{/* End Time */}
					<div className='w-1/2'>
						<FormLabel>End Time:</FormLabel>
						<div className='flex flex-col gap-2'>
							{/* Hour */}
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
							{/* Minute */}
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

				<div className='flex flex-row'>
					{/* Attendance List*/}
					<div className='w-1/2 px-2'>
						<FormField
							control={form.control}
							name='attendeeList'
							render={({ field }) => (
								<FormItem className='mb-6'>
									<FormLabel>Attendee List (Opt):</FormLabel>
									<FormControl>
										<Input
											type='file'
											accept='.csv, .xlsx'
											onChange={(e) =>
												field.onChange(e.target.files)
											}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					{/* Attendance Count*/}
					<div className='w-1/2 px-2'>
						<FormField
							control={form.control}
							name='attendeeCount'
							rules={{
								required: 'Please enter number of attendees',
							}}
							render={({ field }) => (
								<FormItem className='mb-6'>
									<FormLabel>Number of Attendees:</FormLabel>
									<FormControl>
										<Input
											{...field}
											type='number'
											placeholder='100'
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

				{/* Equipments */}
				<FormLabel className='px-2'>
					Request Equipments (Opt):
				</FormLabel>
				<EquipmentSelector />

				<div className='px-2 my-4'>
					<Separator />
				</div>

				{/* Additional Notes */}
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

				{/* Error Message */}
				{error && (
					<p className='text-red-600 font-medium mb-4'>
						{submissionType.current === 'draft'
							? 'Failed to save draft. Please try again.'
							: 'Failed to submit booking. Please fix the errors.'}
					</p>
				)}

				{/* Success Message */}
				{success && (
					<p className='text-green-600 font-medium mt-4'>
						{submissionType.current === 'draft'
							? 'Draft saved successfully!'
							: 'Booking submitted successfully!'}
					</p>
				)}

				{/* Buttons */}
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

export default BookingForm;

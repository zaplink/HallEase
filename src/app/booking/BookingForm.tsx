'use client';

import { useForm } from 'react-hook-form';
import { BookingFormData, defaultBookingFormData } from './booking.types';
import { useBooking } from './useBooking';
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

function BookingForm() {
	const { handleSubmit, isLoading, error, success, reset } = useBooking();

	const form = useForm<BookingFormData>({
		defaultValues: defaultBookingFormData,
	});

	const onSubmit = (formData: BookingFormData) => {
		handleSubmit(formData);
	};

	const eventType = [
		{ value: 'seminar', label: 'Seminar' },
		{ value: 'workshop', label: 'Workshop' },
		{ value: 'conference', label: 'Conference' },
		{ value: 'prizegiving', label: 'Prize Giving' },
		{ value: 'concert', label: 'Concert' },
	];

	const hallOptions = [
		{ value: 'ABH1', label: 'ABH1' },
		{ value: 'ABH2', label: 'ABH2' },
		{ value: 'ABH3', label: 'ABH3' },
		{ value: 'ABH4', label: 'ABH4' },
	];

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)}>
				{/* Event Name */}
				<FormField
					control={form.control}
					name='name'
					rules={{ required: 'Please enter your event name' }}
					render={({ field }) => (
						<FormItem className='mb-6'>
							<FormLabel>Event Name</FormLabel>
							<FormControl>
								<Input
									{...field}
									placeholder='Dream Big 2025 Conference'
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				{/* Event Type */}
				<FormField
					control={form.control}
					name='type'
					rules={{ required: 'Please select event type' }}
					render={({ field }) => (
						<FormItem className='mb-6'>
							<FormLabel>Event Type</FormLabel>
							<FormControl>
								<Combobox
									options={eventType}
									value={field.value}
									onChange={(val) => field.onChange(val)}
									placeholder='Select Event Type'
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				{/* Description */}
				<FormField
					control={form.control}
					name='description'
					rules={{ required: 'Please enter event description' }}
					render={({ field }) => (
						<FormItem className='mb-6'>
							<FormLabel>Event Description</FormLabel>
							<FormControl>
								<Input
									{...field}
									placeholder='An inspiring tech seminar...'
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				{/* Attendance */}
				<FormField
					control={form.control}
					name='attendeeCount'
					rules={{ required: 'Please enter number of attendees' }}
					render={({ field }) => (
						<FormItem className='mb-6'>
							<FormLabel>Number of Attendees</FormLabel>
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

				{/* Date */}
				<FormField
					control={form.control}
					name='date'
					rules={{ required: 'Please select date' }}
					render={({ field }) => (
						<FormItem className='mb-6'>
							<FormLabel>Date</FormLabel>
							<FormControl>
								<DatePickerDemo
									value={field.value}
									onChange={(date) => field.onChange(date)}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				{/* Start Time */}
				<FormField
					control={form.control}
					name='startTime'
					rules={{ required: 'Please enter start time' }}
					render={({ field }) => (
						<FormItem className='mb-6'>
							<FormLabel>Start Time</FormLabel>
							<FormControl>
								<Input {...field} placeholder='10:00 AM' />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				{/* End Time */}
				<FormField
					control={form.control}
					name='endTime'
					rules={{ required: 'Please enter end time' }}
					render={({ field }) => (
						<FormItem className='mb-6'>
							<FormLabel>End Time</FormLabel>
							<FormControl>
								<Input {...field} placeholder='1:00 PM' />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				{/* Hall/Location */}
				<FormField
					control={form.control}
					name='hall'
					rules={{ required: 'Please select a hall' }}
					render={({ field }) => (
						<FormItem className='mb-6'>
							<FormLabel>Hall / Location</FormLabel>
							<FormControl>
								<Combobox
									options={hallOptions}
									value={field.value}
									onChange={(val) => field.onChange(val)}
									placeholder='Select Hall'
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				{/* Error Message */}
				{error && (
					<p className='text-red-600 font-medium mb-4'> {error}</p>
				)}

				{/* Buttons */}
				<div className='flex gap-4'>
					<Button type='submit' disabled={isLoading}>
						{isLoading ? 'Submitting...' : 'Submit Booking'}
					</Button>
					<Button
						type='button'
						variant='secondary'
						onClick={() => {
							form.reset();
							reset();
						}}
						disabled={isLoading}
					>
						Reset Form
					</Button>
				</div>

				{/* Success message */}
				{success && (
					<p className='text-green-600 font-medium mt-4'>
						Booking submitted successfully!
					</p>
				)}
			</form>
		</Form>
	);
}

export default BookingForm;

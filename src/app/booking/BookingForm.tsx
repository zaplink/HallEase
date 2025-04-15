'use client';
import { Combobox } from '@/components/combobox';
import { DatePickerDemo } from '@/components/ui/DatePicker';
import { useForm } from 'react-hook-form';
// import '@/app/bookingnewstyle.css';

import {
	Form,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
	FormField,
} from '@/components/ui/form'; // Adjust the import path if needed
import { Input } from '@/components/ui/input'; // Ensure you have an Input component
import { Button } from '@/components/ui/button'; // Ensure you have a Button component

type FormValues = {
	name: string;
	email: string;
	eventtype: string;
	organizedby: string;
	eventdescription: string;
	attendance: string;
	date: Date;
	starttime: string;
	endtime: string;
	halllocation: string;
};

function BookingFormNew() {
	const form = useForm<FormValues>({
		defaultValues: {
			name: '',
			email: '',
			eventtype: '',
			organizedby: '',
			eventdescription: '',
			attendance: '',
			date: undefined,
			starttime: '',
			endtime: '',
			halllocation: '',
		},
	});

	const onSubmit = (data: FormValues) => {
		console.log('Form submitted:', data);
	};

	const eventType = [
		{ value: 'seminar', label: 'Seminar' },
		{ value: 'workshop', label: 'work shop' },
		{ value: 'confference', label: 'confference' },
		{ value: 'prizegiving', label: 'prize giving' },
		{ value: 'consert', label: 'consert' },
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
				{/* Name Field */}
				<FormField
					control={form.control}
					name='name'
					rules={{ required: 'Please Enter your event Name' }}
					render={({ field }) => (
						<FormItem className='form-item mb-6'>
							<FormLabel className='font-semibold'>
								Event Name
							</FormLabel>
							<FormControl>
								<Input
									{...field}
									placeholder='Dream Big 2025 Conference'
									className='input w-2/5'
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='eventtype'
					rules={{ required: 'Please Select your event Type' }}
					render={({ field }) => (
						<FormItem className='form-item flex flex-col mb-6'>
							<FormLabel className='font-semibold'>
								Event Type
							</FormLabel>

							<FormControl>
								<Combobox
									options={eventType}
									placeholder='Choose from Seminar, Workshop, Conference...'
									value={field.value}
									onChange={(selected) =>
										field.onChange(selected)
									}
								/>
							</FormControl>

							<FormMessage />
						</FormItem>
					)}
				/>

				{/* <FormField
					control={form.control}
					name='organizedby'
					rules={{ required: 'Please Enter  Organization ' }}
					render={({ field }) => (
						<FormItem className='form-item mb-6'>
							<FormLabel className='font-semibold'>
								Organized By
							</FormLabel>
							<FormControl>
								<Input
									{...field}
									placeholder='Innovative Society'
									className='input w-2/5'
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/> */}

				<FormField
					control={form.control}
					name='eventdescription'
					rules={{ required: 'Please Enter  event Description' }}
					render={({ field }) => (
						<FormItem className='form-item mb-6'>
							<FormLabel className='font-semibold'>
								Event Description
							</FormLabel>
							<FormControl>
								<Input
									{...field}
									placeholder='An inspiring event that brings creative minds together'
									className='input'
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='attendance'
					rules={{ required: 'Please Enter Number of attendance' }}
					render={({ field }) => (
						<FormItem className='form-item mb-6'>
							<FormLabel className='font-semibold'>
								Number of Attendance
							</FormLabel>
							<FormControl>
								<Input
									{...field}
									placeholder='100'
									className='input w-2/5'
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='date'
					rules={{ required: 'please select the date' }}
					render={({ field }) => (
						<FormItem className='form-item mb-6 flex flex-col'>
							<FormLabel className='font-semibold'>
								Date
							</FormLabel>
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

				<FormField
					control={form.control}
					name='starttime'
					rules={{ required: 'Please Enter Start Time' }}
					render={({ field }) => (
						<FormItem className='form-item mb-6'>
							<FormLabel className='font-semibold'>
								Start Time
							</FormLabel>
							<FormControl>
								<Input
									{...field}
									placeholder='10.30 am'
									className='input w-2/5'
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='endtime'
					rules={{ required: 'Please Enter End time' }}
					render={({ field }) => (
						<FormItem className='form-item mb-6'>
							<FormLabel className='font-semibold'>
								End Time
							</FormLabel>
							<FormControl>
								<Input
									{...field}
									placeholder='1.00 pm'
									className='input w-2/5'
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='halllocation'
					rules={{ required: 'Please Select your Hall/location' }}
					render={({ field }) => (
						<FormItem className='form-item mb-6 flex flex-col'>
							<FormLabel className='font-semibold'>
								Hall/Location
							</FormLabel>
							<FormControl>
								<Combobox
									options={hallOptions}
									placeholder='AB-LCH-01'
									value={field.value}
									onChange={(selected) =>
										field.onChange(selected)
									}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				{/* Email Field */}
				{/* <FormField
					control={form.control}
					name='email'
					rules={{
						required: 'Email is required',
						pattern: {
							value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
							message: 'Invalid email format',
						},
					}}
					render={({ field }) => (
						<FormItem className='form-item mb-6'>
							<FormLabel className='font-semibold'>
								{' '}
								Contact Email
							</FormLabel>
							<FormControl>
								<Input
									{...field}
									placeholder='example@domain.com'
									className='input w-2/5'
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/> */}

				{/* Submit Button */}
				<div className='flex flex-row gap-4'>
					<Button type='submit' className='but'>
						Submit Booking
					</Button>

					<Button
						type='button'
						className='reset'
						onClick={() => form.reset()}
					>
						Reset Form
					</Button>
				</div>
			</form>
		</Form>
	);
}

export default BookingFormNew;

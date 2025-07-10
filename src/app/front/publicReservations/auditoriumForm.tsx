'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Combobox } from '@/components/combobox';
import { submitAuditoriumReservation } from './reservationActions/auditorium';

const formSchema = z.object({
	eventname: z.string().min(1, {
		message: 'Please enter the event you are going to organize.',
	}),

	community: z.string().min(1, { message: 'Select the organization.' }),

	description: z.string().min(10, {
		message: 'Description must be at least 10 characters long.',
	}),

	attendence: z.preprocess(
		(val) => Number(val),
		z
			.number()
			.min(100, { message: 'Minimum attendance is 100.' })
			.max(1000, {
				message: 'Maximum attendance is 1000.',
			})
	),

	date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
		message: 'Invalid date format. Use YYYY-MM-DD.',
	}),

	start_time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
		message: 'Invalid time format. Use HH:MM (24-hour format).',
	}),

	end_time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
		message: 'Invalid time format. Use HH:MM (24-hour format).',
	}),

	contact_name: z.string(),
	requirements: z.string(),
	contact_email: z
		.string()
		.email({ message: 'Enter a valid email address.' }),

	contact_mobile: z.string().regex(/^\+?[0-9]{10,15}$/, {
		message: 'Enter a valid phone number (10-15 digits, optional +).',
	}),
});

export function AuditoriumForm() {
	const [agreed, setAgreed] = useState(false);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			eventname: '',
			community: '',
			description: '',
			attendence: 100,
			date: '',
			start_time: '08:00',
			end_time: '10:00',
			contact_name: '',
			contact_email: '',
			contact_mobile: '',
			requirements: '',
		},
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		console.log('✔ Form submitted with values:', values);

		const formData = new FormData();
		Object.entries(values).forEach(([key, value]) => {
			formData.append(key, String(value));
		});

		for (const [key, value] of formData.entries()) {
			console.log(`${key}: ${value}`);
		}

		const res = await submitAuditoriumReservation(formData);

		if (res.success) {
			alert('🎉 Reservation submitted successfully!');
		} else {
			alert('❌ ' + res.message);
		}
	}

	const eventType = [
		{ value: 'foss', label: 'FOSS Community' },
		{ value: 'ieee', label: 'IEEE' },
		{ value: 'isaca', label: 'ISACA' },
		{ value: 'cssa', label: 'CSSA' },
		{ value: 'greenclub', label: 'Green Club' },
		{ value: 'legion', label: 'Legion' },
		{ value: 'leo', label: 'Leo' },
		{ value: 'rotaract', label: 'Rotaract' },
		{ value: 'aws', label: 'AWS Community' },
	];

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit, (errors) => {
					console.error('❌ Validation Errors:', errors);
				})}
				className='space-y-8'
			>
				{/* EVENT NAME */}
				<FormField
					control={form.control}
					name='eventname'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Event Name</FormLabel>
							<FormControl>
								<Input
									placeholder='Event name'
									type='text'
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				{/* COMMUNITY */}
				<FormField
					control={form.control}
					name='community'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Organized By</FormLabel>
							<FormControl>
								<Combobox
									options={eventType}
									placeholder='Organization'
									value={field.value}
									onChange={field.onChange}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				{/* DESCRIPTION */}
				<FormField
					control={form.control}
					name='description'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Description</FormLabel>
							<FormControl>
								<Input
									placeholder='Event description'
									type='text'
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				{/* ATTENDENCE & DATE */}
				<div className='flex gap-6'>
					<div className='w-1/2'>
						<FormField
							control={form.control}
							name='attendence'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Attendance</FormLabel>
									<FormControl>
										<Input
											type='number'
											placeholder='100'
											{...field}
											onChange={(e) =>
												field.onChange(
													Number(e.target.value)
												)
											}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<div className='w-1/2'>
						<FormField
							control={form.control}
							name='date'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Date</FormLabel>
									<FormControl>
										<Input
											type='date'
											value={field.value}
											onChange={field.onChange}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
				</div>

				{/* START & END TIME */}
				<div className='flex gap-6'>
					<div className='w-1/2'>
						<FormField
							control={form.control}
							name='start_time'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Start Time</FormLabel>
									<FormControl>
										<Input type='time' {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<div className='w-1/2'>
						<FormField
							control={form.control}
							name='end_time'
							render={({ field }) => (
								<FormItem>
									<FormLabel>End Time</FormLabel>
									<FormControl>
										<Input type='time' {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
				</div>

				<hr />
				<p className='text-gray-500 text-lg m-0'>Contact details</p>

				{/* CONTACT DETAILS */}
				<FormField
					control={form.control}
					name='contact_name'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Name</FormLabel>
							<FormControl>
								<Input
									type='text'
									placeholder='Your name'
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='contact_email'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Email</FormLabel>
							<FormControl>
								<Input
									type='email'
									placeholder='email@example.com'
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='contact_mobile'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Phone</FormLabel>
							<FormControl>
								<Input
									type='tel'
									placeholder='Phone number'
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='requirements'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Requirements</FormLabel>
							<FormControl>
								<Input
									type='text'
									placeholder='Extra needs or comments'
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				{/* TERMS */}
				<div className='flex items-center gap-2'>
					<input
						type='checkbox'
						id='terms'
						checked={agreed}
						onChange={() => setAgreed(!agreed)}
						className='w-5 h-5'
					/>
					<label htmlFor='terms' className='text-gray-700 text-sm'>
						I agree to the{' '}
						<a href='/terms' className='text-blue-600 underline'>
							Terms and Conditions
						</a>
					</label>
				</div>

				<Button type='submit' className='w-full'>
					Submit
				</Button>
			</form>
		</Form>
	);
}

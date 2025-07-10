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
import { signup } from '@/lib/SignupActions';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';
import { Combobox } from '@/components/combobox';

const formSchema = z.object({
	email: z
		.string()
		.email({ message: 'Please enter a valid email address.' })
		.transform((value) => value.trim()),
	password: z
		.string()
		.min(6, { message: 'Password must be at least 6 characters long.' })
		.max(20, { message: 'Password must be at most 20 characters long.' }),
	username: z.string().min(3, {
		message: 'Username must be at least 3 characters.',
	}),
	position: z.string({
		message: 'Please enter your position or state currently holding',
	}),

	pro_pic: z.string({
		message: 'Upload already hosted image url of yours',
	}),
	role: z.string({ message: 'Select the previlege level' }),
});

export default function SignupForm() {
	const [showSuccessPopup, setShowSuccessPopup] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: '',
			password: '',
			username: '',
			position: '',
			pro_pic: '',
			role: '',
		},
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		const formData = new FormData();
		formData.append('email', values.email);
		formData.append('password', values.password);
		formData.append('username', values.username);
		formData.append('position', values.position);
		formData.append('pro_pic', values.pro_pic);
		formData.append('role', values.role);

		setIsLoading(true);
		const result = await signup(formData);

		if (result.success) {
			setShowSuccessPopup(true);
		} else {
			setErrorMessage(result.message);
		}
	}

	const ROLE = [
		{ value: 'GEUST', label: 'GUEST' },
		{ value: 'USER', label: 'USER' },
		{ value: 'ADMIN', label: 'ADMIN' },
		{ value: 'SYSTEM', label: 'SYSTEM' },
	];

	return (
		<>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className='space-y-8'
				>
					<h2 className='underline'>Account credentials</h2>
					<FormField
						control={form.control}
						name='email'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Email</FormLabel>
								<FormControl>
									<Input
										type='email'
										placeholder='Enter email'
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='password'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Password</FormLabel>
								<FormControl>
									<Input
										type='password'
										placeholder='Enter password'
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<hr />
					<h2 className='underline'>Profile details</h2>
					<FormField
						control={form.control}
						name='username'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Username</FormLabel>
								<FormControl>
									<Input
										type='text'
										placeholder='Enter username'
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='position'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Position</FormLabel>
								<FormControl>
									<Input
										type='text'
										placeholder='Position / state (Lecturer, Demonstrator..etc)'
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name='role'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Role</FormLabel> <br />
								<FormControl>
									<Combobox
										options={ROLE}
										placeholder='Select previlege for user'
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

					<FormField
						control={form.control}
						name='pro_pic'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Profile Picture</FormLabel>
								<FormControl>
									<Input
										type='text'
										placeholder='Upload URL of the profile picture (LinkedIn ..etc)'
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					{errorMessage && (
						<p className='text-red-500'>{errorMessage}</p>
					)}
					<Button type='submit' disabled={isLoading}>
						{isLoading ? (
							<>
								<Loader2 className='animate-spin w-5 h-5' />{' '}
								<span>Registering...</span>
							</>
						) : (
							'Register'
						)}
					</Button>
				</form>
				<br />
			</Form>

			{/* Success Popup */}
			<Dialog open={showSuccessPopup} onOpenChange={setShowSuccessPopup}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Invitation Sent</DialogTitle>
					</DialogHeader>
					<p>An invitation has been sent to the provided email</p>
					<Button
						onClick={() => {
							setShowSuccessPopup(false);
							window.location.reload();
						}}
					>
						OK
					</Button>
				</DialogContent>
			</Dialog>
		</>
	);
}

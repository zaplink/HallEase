'use client';

import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/lib/supabaseClient'; // 👈 required for calling Supabase
import { getBaseUrl } from '@/utils/getBaseUrl';

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';

import Loading from '@/components/custom/Loading';

const formSchema = z.object({
	email: z
		.string()
		.email('Please enter a valid email')
		.transform((val) => val.trim()),
});

export default function LostPasswordForm() {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: '',
		},
	});

	const [isLoading, setIsLoading] = useState(false);
	const [success, setSuccess] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);

	const onSubmit = async (data: z.infer<typeof formSchema>) => {
		setIsLoading(true);
		setSuccess(null);
		setError(null);

		try {
			const { error } = await supabase.auth.resetPasswordForEmail(
				data.email,
				{
					redirectTo: `${getBaseUrl()}/reset-password`,
				}
			);

			if (error) {
				throw new Error(error.message);
			}

			setSuccess('Password reset instructions sent! Check your email.');
		} catch (e: unknown) {
			if (e instanceof Error) {
				setError(e.message);
			} else {
				setError('Failed to send reset instructions. Try again later.');
			}
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Card className='max-w-md mx-auto bg-white/80 shadow-md'>
			<CardHeader>
				<CardTitle className='text-center'>Reset Password</CardTitle>
			</CardHeader>

			<CardContent>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className='space-y-8'
					>
						<FormField
							control={form.control}
							name='email'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input
											type='email'
											placeholder='Enter your email'
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{success && <p className='text-green-600'>{success}</p>}
						{error && <p className='text-red-600'>{error}</p>}

						<Button
							type='submit'
							disabled={isLoading}
							className='w-full bg-black text-white hover:bg-gray-800 transition-all duration-300'
						>
							{isLoading ? <Loading inline /> : 'Send Reset Link'}
						</Button>
					</form>
				</Form>
			</CardContent>

			<CardFooter className='text-center text-sm text-gray-500'>
				<a href='/login' className='hover:underline'>
					Back to Login
				</a>
			</CardFooter>
		</Card>
	);
}

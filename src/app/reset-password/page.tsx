'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';

export default function ResetPasswordPage() {
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [message, setMessage] = useState('');
	const [isReady, setIsReady] = useState(false);
	const [isUpdating, setIsUpdating] = useState(false);
	const router = useRouter();

	useEffect(() => {
		async function handlePasswordReset() {
			try {
				// Log the URL for debugging
				console.log('Current URL:', window.location.href);

				// Check if we already have a session
				const { data: sessionData, error: sessionError } =
					await supabase.auth.getSession();

				if (sessionError) {
					console.error('Session error:', sessionError);
				}

				if (sessionData?.session) {
					console.log('Existing session found');
					setIsReady(true);
					setMessage('Ready to reset password');
					return;
				}

				// Handle Supabase auth callback automatically
				// This will process any auth tokens in the URL
				const { data, error } = await supabase.auth.getSession();

				if (error) {
					console.error('Auth error:', error);
					setMessage(
						'Invalid or expired reset link. Please request a new one.'
					);
					return;
				}

				if (data.session) {
					console.log('Session established from URL');
					setIsReady(true);
					setMessage('Ready to reset password');
				} else {
					// If no session, this might be an invalid link
					setMessage(
						'Invalid or expired reset link. Please request a new one.'
					);
				}
			} catch (error) {
				console.error('Error handling reset:', error);
				setMessage(
					'An error occurred. Please request a new reset link.'
				);
			}
		}

		// Add a small delay to ensure the page is fully loaded
		const timer = setTimeout(handlePasswordReset, 100);

		return () => clearTimeout(timer);
	}, []);

	const handlePasswordUpdate = async () => {
		if (!password) {
			setMessage('Please enter a new password.');
			return;
		}

		if (password.length < 6) {
			setMessage('Password must be at least 6 characters long.');
			return;
		}

		if (password !== confirmPassword) {
			setMessage('Passwords do not match.');
			return;
		}

		setIsUpdating(true);

		try {
			const { error } = await supabase.auth.updateUser({
				password: password,
			});

			if (error) {
				setMessage('Error updating password: ' + error.message);
			} else {
				setMessage(
					'✅ Password updated successfully! Redirecting to login...'
				);
				setTimeout(() => {
					router.push('/login');
				}, 2000);
			}
		} catch (error) {
			console.error('Password update error:', error);
			setMessage('Failed to update password. Please try again.');
		} finally {
			setIsUpdating(false);
		}
	};

	return (
		<div className='min-h-screen flex items-center justify-center bg-gray-50 px-4'>
			<Card className='w-full max-w-md shadow-md bg-white/80'>
				<CardHeader>
					<CardTitle className='text-center'>
						Reset Your Password
					</CardTitle>
				</CardHeader>

				<CardContent className='space-y-4'>
					{!isReady && !message && (
						<p className='text-center text-gray-500'>
							Processing reset link...
						</p>
					)}

					{message && (
						<p
							className={`text-center text-sm ${
								message.includes('successfully') ||
								message.includes('Ready')
									? 'text-green-600'
									: 'text-red-600'
							}`}
						>
							{message}
						</p>
					)}

					{isReady && (
						<div className='space-y-4'>
							<div>
								<label className='block text-sm font-medium mb-2'>
									New Password
								</label>
								<Input
									type='password'
									placeholder='Enter new password (min 6 characters)'
									value={password}
									onChange={(e) =>
										setPassword(e.target.value)
									}
									disabled={isUpdating}
								/>
							</div>

							<div>
								<label className='block text-sm font-medium mb-2'>
									Confirm Password
								</label>
								<Input
									type='password'
									placeholder='Confirm new password'
									value={confirmPassword}
									onChange={(e) =>
										setConfirmPassword(e.target.value)
									}
									disabled={isUpdating}
								/>
							</div>

							<Button
								onClick={handlePasswordUpdate}
								disabled={
									isUpdating || !password || !confirmPassword
								}
								className='w-full bg-black text-white hover:bg-gray-800'
							>
								{isUpdating
									? 'Updating Password...'
									: 'Update Password'}
							</Button>
						</div>
					)}

					{!isReady && message && !message.includes('Processing') && (
						<div className='text-center space-y-2'>
							<Button
								onClick={() => router.push('/lost-password')}
								variant='outline'
								className='w-full'
							>
								Request New Reset Link
							</Button>

							<Button
								onClick={() => router.push('/login')}
								variant='ghost'
								className='w-full text-sm'
							>
								Back to Login
							</Button>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}

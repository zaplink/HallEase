'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function ResetPasswordPage() {
	const [password, setPassword] = useState('');
	const [message, setMessage] = useState('');
	const [isSessionSet, setIsSessionSet] = useState(false);

	useEffect(() => {
		async function handleSession() {
			// Supabase returns access_token and refresh_token in the URL hash (#) after password reset
			const hash = window.location.hash.substring(1); // remove '#'
			const params = new URLSearchParams(hash);

			const access_token = params.get('access_token');
			const refresh_token = params.get('refresh_token');

			if (access_token) {
				const { error } = await supabase.auth.setSession({
					access_token,
					refresh_token: refresh_token || '',
				});

				if (error) {
					setMessage('Session error: ' + error.message);
				} else {
					setIsSessionSet(true);
				}
			} else {
				setMessage('Invalid or missing token in the reset link.');
			}
		}

		handleSession();
	}, []);

	const handleReset = async () => {
		if (!password) {
			setMessage('Please enter a new password.');
			return;
		}

		const { error } = await supabase.auth.updateUser({ password });
		if (error) {
			setMessage(error.message);
		} else {
			setMessage('✅ Password updated successfully! You can now log in.');
		}
	};

	return (
		<div className='max-w-md mx-auto mt-20 px-4'>
			<h1 className='text-xl font-bold mb-4 text-center'>
				Reset Your Password
			</h1>

			{!isSessionSet && !message && (
				<p className='text-center text-gray-500 mb-4'>
					Validating session...
				</p>
			)}

			{message && (
				<p
					className={`text-center mb-4 ${
						message.includes('successfully')
							? 'text-green-600'
							: 'text-red-600'
					}`}
				>
					{message}
				</p>
			)}

			{isSessionSet && (
				<>
					<input
						type='password'
						placeholder='New password'
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						className='border p-2 w-full mb-4 rounded'
					/>
					<button
						onClick={handleReset}
						className='bg-black text-white px-4 py-2 w-full rounded'
					>
						Update Password
					</button>
				</>
			)}
		</div>
	);
}

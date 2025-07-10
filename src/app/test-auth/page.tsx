'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabaseClient';
import { User, AuthError } from '@supabase/supabase-js';

export default function TestAuth() {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<AuthError | Error | null>(null);

	useEffect(() => {
		async function checkAuth() {
			try {
				const supabase = createClient();
				const {
					data: { user },
					error,
				} = await supabase.auth.getUser();

				console.log('Auth test result:', { user, error });

				if (error) {
					setError(error);
				} else {
					setUser(user as User);
				}
			} catch (err) {
				console.error('Auth test error:', err);
				setError(err as Error);
			} finally {
				setLoading(false);
			}
		}

		checkAuth();
	}, []);

	if (loading) return <div>Loading...</div>;

	return (
		<div className='p-8'>
			<h1 className='text-2xl font-bold mb-4'>Authentication Test</h1>

			{error ? (
				<div className='bg-red-100 p-4 rounded'>
					<h2 className='font-bold text-red-800'>Error:</h2>
					<pre className='text-red-600'>
						{JSON.stringify(error, null, 2)}
					</pre>
				</div>
			) : user ? (
				<div className='bg-green-100 p-4 rounded'>
					<h2 className='font-bold text-green-800'>
						Authenticated User:
					</h2>
					<pre className='text-green-600'>
						{JSON.stringify(user, null, 2)}
					</pre>
				</div>
			) : (
				<div className='bg-yellow-100 p-4 rounded'>
					<h2 className='font-bold text-yellow-800'>No User:</h2>
					<p className='text-yellow-600'>User is not authenticated</p>
				</div>
			)}
		</div>
	);
}

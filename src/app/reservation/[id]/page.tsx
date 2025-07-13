'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { createClient } from '@/lib/supabaseClient';

export default function ReservationRedirectPage() {
	const router = useRouter();
	const params = useParams();
	const reservationId = params.id as string;

	const [showNoReservation, setShowNoReservation] = useState(false);

	useEffect(() => {
		async function checkRoleAndRedirect() {
			const supabase = createClient();
			const {
				data: { user },
				error: userError,
			} = await supabase.auth.getUser();
			if (userError || !user) {
				// Not logged in, redirect to login or show error
				router.replace('/login');
				return;
			}

			const { data: profile, error: profileError } = await supabase
				.from('profiles')
				.select('role')
				.eq('id', user.id)
				.single();

			if (profileError || !profile) {
				// Profile not found, fallback to login
				router.replace('/login');
				return;
			}

			const role = profile.role?.toLowerCase();
			if (role === 'admin') {
				router.replace(`/all-reservations/review/${reservationId}`);
			} else if (role === 'user') {
				router.replace(`/my-reservations/review/${reservationId}`);
			} else {
				setShowNoReservation(true);
			}
		}

		checkRoleAndRedirect();
	}, [router, reservationId]);

	if (showNoReservation) {
		return (
			<div className='flex items-center justify-center min-h-[200px]'>
				<p className='text-lg text-gray-600'>
					No reservation available.
				</p>
			</div>
		);
	}
	return null;
}

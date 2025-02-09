'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabaseClient'; // Import client-side Supabase instance

const supabase = createClient(); // Use client-side auth

export default function useUserProfile() {
	const [profile, setProfile] = useState<{
		full_name: string;
		pro_pic: string;
	} | null>(null);

	useEffect(() => {
		const fetchProfile = async () => {
			// ✅ Fetch authenticated user (client-side)
			const {
				data: { user },
				error: userError,
			} = await supabase.auth.getUser();
			if (userError || !user) {
				console.error('User fetch error:', userError);
				return;
			}

			console.log('Authenticated User ID:', user.id);

			// ✅ Fetch user profile from 'profiles' table
			const { data, error } = await supabase
				.from('profiles')
				.select('full_name, pro_pic')
				.eq('id', user.id)
				.single();

			if (error) {
				console.error('Profile Fetch Error:', error);
			} else {
				console.log('Fetched Profile Data:', data);
				setProfile(data);
			}
		};

		fetchProfile();
	}, []);

	return profile;
}

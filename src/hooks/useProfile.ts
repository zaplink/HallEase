import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabaseClient';

const supabase = createClient();

export function useProfile() {
	const [profile, setProfile] = useState<{
		full_name: string;
		pro_pic: string;
		email: string;
	} | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchProfile = async () => {
			setLoading(true);

			// ✅ Get authenticated user
			const {
				data: { user },
				error: userError,
			} = await supabase.auth.getUser();
			if (userError || !user) {
				console.error('User fetch error:', userError);
				setLoading(false);
				return;
			}

			// ✅ Fetch user profile from 'profiles' table
			const { data, error } = await supabase
				.from('profiles')
				.select('full_name, pro_pic')
				.eq('id', user.id)
				.single();

			if (error) {
				console.error('Profile Fetch Error:', error);
			} else {
				setProfile({ ...data, email: user.email ?? '' });
			}
			setLoading(false);
		};

		fetchProfile();
	}, []);

	return { profile, loading };
}

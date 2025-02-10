import useSWR from 'swr';
import { createClient } from '@/lib/supabaseClient';

const supabase = createClient();

// Fetch function for SWR
const fetchProfile = async () => {
	// Get authenticated user
	const {
		data: { user },
		error: userError,
	} = await supabase.auth.getUser();
	if (userError || !user) {
		console.error('User fetch error:', userError);
		return null;
	}

	// Fetch user profile from 'profiles' table
	const { data, error } = await supabase
		.from('profiles')
		.select('full_name, pro_pic')
		.eq('id', user.id)
		.single();

	if (error) {
		console.error('Profile Fetch Error:', error);
		return null;
	}

	// Return profile data including email
	return { ...data, email: user.email ?? '' };
};

// Custom Hook
export function useProfile() {
	const { data: profile, error } = useSWR('profile', fetchProfile, {
		revalidateOnFocus: false, // Prevent refetching on window focus
	});

	return { profile, loading: !profile && !error };
}

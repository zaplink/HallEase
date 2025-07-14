import { createClient } from '@/lib/supabaseServer';

export interface UserProfileWithRole {
	id: string;
	full_name: string;
	role: string;
	pro_pic: string;
	email: string;
	position: string;
}

export async function fetchProfileServer(): Promise<UserProfileWithRole | null> {
	const supabase = await createClient();

	const { data: authData, error: authError } = await supabase.auth.getUser();
	if (authError || !authData?.user) {
		console.error('Error fetching user:', authError);
		return null;
	}

	const { data: profileData, error: profileError } = await supabase
		.from('profiles')
		.select('id, full_name, role, pro_pic, email, position')
		.eq('id', authData.user.id)
		.single();

	if (profileError) {
		console.error('Error fetching profile:', profileError);
		return null;
	}

	return profileData;
}

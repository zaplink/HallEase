'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabaseServer';

export async function signup(formData: FormData) {
	const supabase = await createClient();

	const data = {
		email: formData.get('email') as string,
		password: formData.get('password') as string,
		position: formData.get('position') as string,
		username: formData.get('username') as string,
		pro_pic: formData.get('pro_pic') as string,
		role: formData.get('role') as string,
	};

	if (
		!data.username ||
		!data.email ||
		!data.position ||
		!data.password ||
		!data.pro_pic ||
		!data.role
	) {
		redirect(
			'/access-control/register/error?message=' +
				encodeURIComponent('Missing fields in the form.')
		);
	}

	// Create user in auth.users
	const { data: signupData, error } = await supabase.auth.signUp({
		email: data.email,
		password: data.password,
	});

	if (error) {
		redirect(
			'/access-control/register/error?message=' +
				encodeURIComponent(error.message)
		);
	}

	const user = signupData.user;

	console.log(user);

	if (!user) {
		redirect(
			'/access-control/register/error?message=' +
				encodeURIComponent('User creation failed.')
		);
	}

	// Insert into profiles table to user details
	await supabase.from('profiles').insert({
		id: signupData.user?.id,
		full_name: data.username,
		role: data.role,
		email: data.email,
		position: data.position,
		pro_pic: data.pro_pic,
	});

	return { success: true, message: 'Invitation sent to user email.' };
}

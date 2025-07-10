'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabaseServer';

export async function signup(formData: FormData) {
	const supabase = await createClient();

	const data = {
		email: formData.get('email') as string,
		password: formData.get('password') as string,
		phone: formData.get('phone') as string,
		username: formData.get('username') as string,
	};

	if (!data.username || !data.email || !data.phone || !data.password) {
		redirect(
			'/access-control/register/error?message=' +
				encodeURIComponent('Missing fields in the form.')
		);
	}

	// 1. Create user in auth.users
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

	// Optionally insert into custom users table
	await supabase.from('profiles').insert({
		id: signupData.user?.id,
		email: data.email,
		position: data.phone,
		full_name: data.username,
	});

	return { success: true, message: 'Invitation sent to user email.' };
}

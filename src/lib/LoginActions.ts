'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabaseServer';
// import { store } from '@/redux/store';
// import { clearAuth } from '@/redux/authSlice';

export async function login(formData: FormData) {
	// store.dispatch(clearAuth());

	const supabase = await createClient();

	const data = {
		email: formData.get('email') as string,
		password: formData.get('password') as string,
	};

	const { data: authData, error } =
		await supabase.auth.signInWithPassword(data);

	if (error) {
		const errorMessage = encodeURIComponent(error.message);
		redirect(`/login/error?message=${errorMessage}`);
	}

	// Update last_sign_in_at
	const userId = authData?.user?.id;
	if (userId) {
		await supabase
			.from('profiles')
			.update({ last_sign_in_at: new Date().toISOString() })
			.eq('id', userId);
	}

	revalidatePath('/', 'layout');
	redirect('/auth/callback');
}

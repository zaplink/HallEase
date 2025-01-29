'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabaseServer';

export async function logout() {
	const supabase = await createClient();

	const { error } = await supabase.auth.signOut();

	if (error) {
		console.log(error);
		// redirect('/login/error');
	}

	revalidatePath('/', 'layout');
	redirect('/');
}

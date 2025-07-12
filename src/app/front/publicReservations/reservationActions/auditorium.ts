'use server';

import { createClient } from '@/lib/supabaseServer';

export async function submitAuditoriumReservation(formData: FormData) {
	const supabase = await createClient();

	// Extract and type the fields
	const data = {
		eventname: formData.get('eventname') as string,
		community: formData.get('community') as string,
		description: formData.get('description') as string,
		attendence: Number(formData.get('attendence')),
		date: formData.get('date') as string,
		start_time: formData.get('start_time') as string,
		end_time: formData.get('end_time') as string,
		contact_name: formData.get('contact_name') as string,
		contact_email: formData.get('contact_email') as string,
		contact_mobile: formData.get('contact_mobile') as string,
		requirements: formData.get('requirements') as string,
	};

	// Optional validation check
	if (
		!data.eventname ||
		!data.contact_email ||
		!data.date ||
		!data.start_time ||
		!data.end_time
	) {
		return { success: false, message: 'Missing required fields' };
	}

	const { error } = await supabase.from('public_reservation').insert({
		eventname: data.eventname,
		community: data.community,
		description: data.description,
		attendence: data.attendence,
		date: data.date,
		start_time: data.start_time,
		end_time: data.end_time,
		contact_name: data.contact_name,
		contact_email: data.contact_email,
		contact_mobile: data.contact_mobile,
		requirements: data.requirements,
		created_at: new Date().toISOString(),
		request_for: 'AUDITORIUM',
	});

	if (error) {
		return { success: false, message: error.message };
	}

	return { success: true, message: 'Reservation submitted successfully.' };
}

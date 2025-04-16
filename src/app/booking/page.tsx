import React from 'react';
import BookingForm from './BookingForm';
import SidebarLayout from '@/layouts/Sidebar/Layout';
import { createClient } from '@/lib/supabaseServer';
import { redirect } from 'next/navigation';
import PageHeader from '@/components/custom/PageHeader';

async function page() {
	// --> TODO: Use a proper authentication function call here
	const supabase = await createClient();
	const { data, error } = await supabase.auth.getUser();
	if (error || !data?.user) {
		redirect('/login');
	}
	// <--

	return (
		<SidebarLayout>
			<PageHeader
				title='Book a Hall'
				descriptions={[
					'Provide the required details to proceed with your booking',
				]}
			/>
			<BookingForm />
		</SidebarLayout>
	);
}

export default page;

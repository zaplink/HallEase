import UnderConstruction from '@/components/custom/UnderConstruction';
import SidebarLayout from '@/layouts/Sidebar/Layout';
import { createClient } from '@/lib/supabaseServer';
import { redirect } from 'next/navigation';

export default async function AllRequestsPage() {
	const supabase = await createClient();
	const { data, error } = await supabase.auth.getUser();
	if (error || !data?.user) {
		redirect('/login');
	}

	return (
		<SidebarLayout>
			<UnderConstruction />
		</SidebarLayout>
	);
}

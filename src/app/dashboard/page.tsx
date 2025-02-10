import { Input } from '@/components/ui/input';
import SidebarLayout from '@/layouts/Sidebar/Layout';
import { createClient } from '@/lib/supabaseServer';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import BarChartComponet from './component';

export default async function Dashboard() {
	// navigate back to login if user not logged
	const supabase = await createClient();

	const { data, error } = await supabase.auth.getUser();
	if (error || !data?.user) {
		redirect('/');
	}
	return (
		<SidebarLayout>
			<div className='mt-5 mb-6 flex flex-row '>
				<div className='basis-16'></div>
				<div className='basis-64 pl-5 pt-1 w-full'>
					<Label htmlFor='email'>How can I help you today?</Label>
				</div>
				<div className='basis-16'></div>
				<div className='basis-128 grow'>
					<Input
						placeholder='Message to HallEase bot'
						className='w-full'
					/>
				</div>
				<div className='basis-32 pl-3'>
					<Button>Go</Button>
				</div>
			</div>

			<div className='flex flex-row mt-20 px-20 h-screen '>
				<div className='basis-64 '></div>
				<div className='basis-128 w-full'>
					<h1>Annual Reservation Report</h1>
					<BarChartComponet />
				</div>
				<div className='basis-64 '></div>
			</div>
		</SidebarLayout>
	);
}

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Breadcrumb, BreadcrumbList } from '@/components/ui/breadcrumb';
import { BotMessageSquare, Bell } from 'lucide-react';
import CalenderDrawer from '../Drawer/CalenderDrawer';
import Breadcrumbs from './BreadCrumbs';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function PageHeader() {
	const router = useRouter();
	const [currentDate, setCurrentDate] = useState(new Date());

	useEffect(() => {
		// Update date every minute
		const timer = setInterval(() => {
			setCurrentDate(new Date());
		}, 60000);

		return () => clearInterval(timer);
	}, []);
	return (
		<>
			<div className='w-full pt-3 pb-4 px-4 flex flex-row items- justify-between'>
				<div className='flex flex-row items-center'>
					{/* Sidebar button */}
					<SidebarTrigger />

					{/* Separator */}
					<Separator orientation='vertical' className='h-5 mx-6' />

					{/* Beadcrumb */}
					<Breadcrumb>
						<BreadcrumbList>
							<Breadcrumbs />
						</BreadcrumbList>
					</Breadcrumb>
				</div>

				<div className='flex flex-row gap-1 items-center'>
					{/* Calender */}
					<span className='text-sm text-muted-foreground mr-1'>
						{currentDate.toLocaleDateString('en-US', {
							weekday: 'short',
							day: 'numeric',
							month: 'short',
							year: 'numeric',
						})}
					</span>
					<CalenderDrawer />

					{/* Bot button */}
					<Button
						onClick={() => router.push(`/chatbot`)}
						variant='ghost'
						className='p-2'
					>
						<BotMessageSquare size={20} />
					</Button>

					<Button
						onClick={() => router.push(`/notifications`)}
						variant='ghost'
						className='p-2'
					>
						<Bell size={20} />
					</Button>
				</div>
			</div>

			<Separator />
		</>
	);
}

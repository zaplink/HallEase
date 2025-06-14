import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Breadcrumb, BreadcrumbList } from '@/components/ui/breadcrumb';
import { BotMessageSquare, Bell } from 'lucide-react';
import CalenderDrawer from '../Drawer/CalenderDrawer';
import Breadcrumbs from './BreadCrumbs';
import { useRouter } from 'next/navigation';

export default function PageHeader() {
	const router = useRouter();
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

				<div className='flex flex-row gap-1'>
					{/* Bot button */}
					<Button
						// onClick={toggleCalendar}
						variant='ghost'
						className='p-2'
					>
						<BotMessageSquare size={20} />
					</Button>

					{/* Calender */}
					<CalenderDrawer />

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

import { AlertCircleIcon, CheckCircle2Icon, PopcornIcon } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import SidebarLayout from '@/layouts/Sidebar/Layout';
import ProtectedPage from '@/layouts/ProtectedPage';

export default function NotificationsPage() {
	return (
		<ProtectedPage>
		<SidebarLayout>
			<div className='grid w-full items-start gap-2'>
				<Alert className='flex flex-row gap-x-2'>
					<div>
						<CheckCircle2Icon width={18} />
					</div>
					<div className='flex flex-col'>
						<AlertTitle>
							Success! Your changes have been saved
						</AlertTitle>
						<AlertDescription>
							This is an alert with icon, title and description.
						</AlertDescription>
					</div>
				</Alert>
				<Alert className='flex flex-row gap-x-2'>
					<div>
						<PopcornIcon width={18} />
					</div>
					<div className='flex flex-col'>
						<AlertTitle>
							This Alert has a title and an icon. No description.
						</AlertTitle>
					</div>
				</Alert>
				<Alert variant='destructive' className='flex flex-row gap-x-2'>
					<div>
						<AlertCircleIcon width={18} />
					</div>
					<div className='flex flex-col'>
						<AlertTitle>Unable to process your payment.</AlertTitle>
						<AlertDescription>
							<p>
								Please verify your billing information and try
								again.
							</p>
							<ul className='list-inside list-disc text-sm'>
								<li>Check your card details</li>
								<li>Ensure sufficient funds</li>
								<li>Verify billing address</li>
							</ul>
						</AlertDescription>
					</div>
				</Alert>
			</div>
		</SidebarLayout>
		</ProtectedPage>
	);
}

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
	Plus,
	CheckCircle,
	Calendar,
	FileText,
	Settings,
	Users,
} from 'lucide-react';
import Link from 'next/link';

interface QuickActionsProps {
	pendingApprovals: number;
}

export function QuickActions({ pendingApprovals }: QuickActionsProps) {
	const actions = [
		{
			label: 'New Booking',
			icon: <Plus className='w-4 h-4' />,
			href: '/reserve',
			variant: 'default' as const,
			description: 'Create a new hall reservation',
		},
		{
			label: `Approve Requests ${pendingApprovals > 0 ? `(${pendingApprovals})` : ''}`,
			icon: <CheckCircle className='w-4 h-4' />,
			href: '/requests',
			variant:
				pendingApprovals > 0
					? ('destructive' as const)
					: ('outline' as const),
			description: 'Review pending booking requests',
		},
		{
			label: 'View Calendar',
			icon: <Calendar className='w-4 h-4' />,
			href: '/timeline',
			variant: 'outline' as const,
			description: 'See all bookings in calendar view',
		},
		{
			label: 'Generate Report',
			icon: <FileText className='w-4 h-4' />,
			href: '/reports',
			variant: 'outline' as const,
			description: 'Create booking and utilization reports',
		},
		{
			label: 'Manage Halls',
			icon: <Settings className='w-4 h-4' />,
			href: '/halls',
			variant: 'outline' as const,
			description: 'Configure hall settings and availability',
		},
		{
			label: 'User Management',
			icon: <Users className='w-4 h-4' />,
			href: '/access-control',
			variant: 'outline' as const,
			description: 'Manage user roles and permissions',
		},
	];

	return (
		<Card className='col-span-full'>
			<CardHeader className='pb-3'>
				<CardTitle className='text-lg font-semibold'>
					Quick Actions
				</CardTitle>
				<p className='text-sm text-gray-600'>
					Frequently used actions and shortcuts
				</p>
			</CardHeader>
			<CardContent>
				<div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3'>
					{actions.map((action, index) => (
						<Link key={index} href={action.href}>
							<Button
								variant={action.variant}
								className='w-full h-auto p-4 flex flex-col items-center gap-2 hover:shadow-md transition-shadow'
								title={action.description}
							>
								{action.icon}
								<span className='text-xs text-center leading-tight'>
									{action.label}
								</span>
							</Button>
						</Link>
					))}
				</div>
			</CardContent>
		</Card>
	);
}

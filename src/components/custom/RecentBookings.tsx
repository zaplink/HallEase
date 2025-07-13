import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Calendar, Clock, User } from 'lucide-react';
import { RecentBooking } from '@/lib/dashboard-data';

interface RecentBookingsProps {
	bookings: RecentBooking[];
}

export function RecentBookings({ bookings }: RecentBookingsProps) {
	const getStatusColor = (status: string) => {
		switch (status.toLowerCase()) {
			case 'approved':
				return 'bg-green-100 text-green-800 border-green-200';
			case 'pending':
				return 'bg-yellow-100 text-yellow-800 border-yellow-200';
			case 'rejected':
				return 'bg-red-100 text-red-800 border-red-200';
			case 'waiting':
				return 'bg-blue-100 text-blue-800 border-blue-200';
			default:
				return 'bg-gray-100 text-gray-800 border-gray-200';
		}
	};

	const getStatusIcon = (status: string) => {
		switch (status.toLowerCase()) {
			case 'approved':
				return '✅';
			case 'pending':
				return '⏳';
			case 'rejected':
				return '❌';
			case 'waiting':
				return '⏳';
			default:
				return '📋';
		}
	};

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
		});
	};

	const formatTime = (timeString: string) => {
		const [hours, minutes] = timeString.split(':');
		const hour = parseInt(hours);
		const period = hour >= 12 ? 'PM' : 'AM';
		const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
		return `${displayHour}:${minutes} ${period}`;
	};

	return (
		<Card className='col-span-1'>
			<CardHeader className='pb-3'>
				<CardTitle className='text-lg font-semibold flex items-center gap-2'>
					<Calendar className='w-5 h-5' />
					Recent Bookings
				</CardTitle>
				<p className='text-sm text-gray-600'>
					{bookings.filter((b) => b.status === 'pending').length}{' '}
					pending approvals
				</p>
			</CardHeader>
			<CardContent className='space-y-3'>
				{bookings.length === 0 ? (
					<div className='text-center py-6 text-gray-500'>
						<Calendar className='w-12 h-12 mx-auto mb-2 text-gray-300' />
						<p>No recent bookings</p>
					</div>
				) : (
					bookings.slice(0, 5).map((booking) => (
						<div
							key={booking.id}
							className='flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors'
						>
							<div className='flex-1 min-w-0'>
								<div className='flex items-center gap-2 mb-1'>
									<span className='text-sm font-medium text-gray-900 truncate'>
										{booking.name}
									</span>
									<Badge
										variant='outline'
										className={`text-xs ${getStatusColor(booking.status)}`}
									>
										{getStatusIcon(booking.status)}{' '}
										{booking.status}
									</Badge>
								</div>
								<div className='flex items-center gap-4 text-xs text-gray-500'>
									<div className='flex items-center gap-1'>
										<User className='w-3 h-3' />
										{booking.bookedBy}
									</div>
									<div className='flex items-center gap-1'>
										<Calendar className='w-3 h-3' />
										{formatDate(booking.date)}
									</div>
									<div className='flex items-center gap-1'>
										<Clock className='w-3 h-3' />
										{formatTime(booking.startTime)} -{' '}
										{formatTime(booking.endTime)}
									</div>
								</div>
							</div>
							<Button variant='ghost' size='sm' className='ml-2'>
								<MoreHorizontal className='w-4 h-4' />
							</Button>
						</div>
					))
				)}
				{bookings.length > 5 && (
					<div className='pt-3 border-t'>
						<Button variant='outline' className='w-full'>
							View All Bookings ({bookings.length})
						</Button>
					</div>
				)}
			</CardContent>
		</Card>
	);
}

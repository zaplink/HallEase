import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { RecentBooking } from '@/lib/dashboard-data';
import { Calendar, Clock, User, MapPin, Activity } from 'lucide-react';

interface RecentActivityProps {
	bookings: RecentBooking[];
}

export function RecentActivity({ bookings }: RecentActivityProps) {
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
		const now = new Date();
		const diffTime = Math.abs(now.getTime() - date.getTime());
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

		if (diffDays === 0) return 'Today';
		if (diffDays === 1) return 'Yesterday';
		if (diffDays < 7) return `${diffDays} days ago`;
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

	const getInitials = (name: string) => {
		return name
			.split(' ')
			.map((n) => n[0])
			.join('')
			.toUpperCase();
	};

	return (
		<Card className='col-span-1'>
			<CardHeader className='pb-3'>
				<CardTitle className='text-lg font-semibold flex items-center gap-2'>
					<Activity className='w-5 h-5' />
					Recent Activity
				</CardTitle>
				<p className='text-sm text-gray-600'>
					Latest booking activities and updates
				</p>
			</CardHeader>
			<CardContent className='space-y-4'>
				{bookings.length === 0 ? (
					<div className='text-center py-6 text-gray-500'>
						<Activity className='w-12 h-12 mx-auto mb-2 text-gray-300' />
						<p>No recent activity</p>
					</div>
				) : (
					bookings.slice(0, 6).map((booking) => (
						<div
							key={booking.id}
							className='flex items-start gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors'
						>
							<Avatar className='w-8 h-8 flex-shrink-0'>
								<AvatarFallback className='text-xs bg-blue-100 text-blue-800'>
									{getInitials(booking.bookedBy)}
								</AvatarFallback>
							</Avatar>

							<div className='flex-1 min-w-0'>
								<div className='flex items-start justify-between gap-2'>
									<div className='flex-1'>
										<p className='text-sm font-medium text-gray-900 truncate'>
											{booking.name}
										</p>
										<div className='flex items-center gap-1 text-xs text-gray-500 mt-1'>
											<User className='w-3 h-3' />
											<span>{booking.bookedBy}</span>
										</div>
									</div>
									<Badge
										variant='outline'
										className={`text-xs ${getStatusColor(booking.status)}`}
									>
										{getStatusIcon(booking.status)}{' '}
										{booking.status}
									</Badge>
								</div>

								<div className='flex items-center gap-4 text-xs text-gray-500 mt-2'>
									<div className='flex items-center gap-1'>
										<Calendar className='w-3 h-3' />
										<span>{formatDate(booking.date)}</span>
									</div>
									<div className='flex items-center gap-1'>
										<Clock className='w-3 h-3' />
										<span>
											{formatTime(booking.startTime)}
										</span>
									</div>
									{booking.hallCode && (
										<div className='flex items-center gap-1'>
											<MapPin className='w-3 h-3' />
											<span>{booking.hallCode}</span>
										</div>
									)}
								</div>
							</div>
						</div>
					))
				)}

				{bookings.length > 6 && (
					<div className='pt-2 border-t'>
						<p className='text-xs text-gray-500 text-center'>
							Showing 6 of {bookings.length} recent activities
						</p>
					</div>
				)}
			</CardContent>
		</Card>
	);
}

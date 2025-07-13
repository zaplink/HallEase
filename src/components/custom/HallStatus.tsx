import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building, Users, Clock } from 'lucide-react';

interface HallStatusProps {
	occupiedHalls: Array<{
		hallCode: string;
		building: string;
		eventName: string;
		bookedBy: string;
		endTime: string;
	}>;
}

export function HallStatus({ occupiedHalls }: HallStatusProps) {
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
					<Building className='w-5 h-5' />
					Hall Status
				</CardTitle>
				<p className='text-sm text-gray-600'>
					{occupiedHalls.length} halls currently occupied
				</p>
			</CardHeader>
			<CardContent className='space-y-3'>
				{occupiedHalls.length === 0 ? (
					<div className='text-center py-6 text-gray-500'>
						<Building className='w-12 h-12 mx-auto mb-2 text-gray-300' />
						<p>All halls are available</p>
					</div>
				) : (
					occupiedHalls.slice(0, 5).map((hall, index) => (
						<div
							key={index}
							className='flex items-center justify-between p-3 border rounded-lg bg-red-50 border-red-200'
						>
							<div className='flex-1 min-w-0'>
								<div className='flex items-center gap-2 mb-1'>
									<Badge
										variant='destructive'
										className='text-xs'
									>
										🔴 Occupied
									</Badge>
									<span className='text-sm font-medium text-gray-900'>
										{hall.hallCode || 'Hall'} -{' '}
										{hall.building}
									</span>
								</div>
								<div className='text-xs text-gray-600 mb-1'>
									<div className='flex items-center gap-1'>
										<Users className='w-3 h-3' />
										{hall.eventName}
									</div>
								</div>
								<div className='flex items-center gap-4 text-xs text-gray-500'>
									<div className='flex items-center gap-1'>
										<Users className='w-3 h-3' />
										{hall.bookedBy}
									</div>
									<div className='flex items-center gap-1'>
										<Clock className='w-3 h-3' />
										Until {formatTime(hall.endTime)}
									</div>
								</div>
							</div>
						</div>
					))
				)}

				{/* Available halls indicator */}
				<div className='flex items-center justify-between p-3 border rounded-lg bg-green-50 border-green-200'>
					<div className='flex items-center gap-2'>
						<Badge
							variant='outline'
							className='text-xs bg-green-100 text-green-800 border-green-200'
						>
							🟢 Available
						</Badge>
						<span className='text-sm font-medium text-gray-900'>
							Other halls available
						</span>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Building2, Users } from 'lucide-react';
import { HallUtilization } from '@/lib/dashboard-data';

interface HallUtilizationChartProps {
	data: HallUtilization[];
}

export function HallUtilizationChart({ data }: HallUtilizationChartProps) {
	const sortedData = data.sort(
		(a, b) => b.utilizationRate - a.utilizationRate
	);

	const getUtilizationBadge = (rate: number, isOccupied: boolean) => {
		if (isOccupied)
			return (
				<Badge variant='destructive' className='text-xs'>
					🔴 Occupied
				</Badge>
			);
		if (rate >= 80)
			return (
				<Badge variant='destructive' className='text-xs'>
					High Usage
				</Badge>
			);
		if (rate >= 60)
			return (
				<Badge
					variant='outline'
					className='text-xs bg-yellow-100 text-yellow-800'
				>
					Medium Usage
				</Badge>
			);
		return (
			<Badge
				variant='outline'
				className='text-xs bg-green-100 text-green-800'
			>
				Low Usage
			</Badge>
		);
	};

	return (
		<Card className='col-span-1'>
			<CardHeader className='pb-3'>
				<CardTitle className='text-lg font-semibold flex items-center gap-2'>
					<Building2 className='w-5 h-5' />
					Hall Utilization
				</CardTitle>
				<p className='text-sm text-gray-600'>
					Usage rates across all halls
				</p>
			</CardHeader>
			<CardContent className='space-y-4'>
				{sortedData.length === 0 ? (
					<div className='text-center py-6 text-gray-500'>
						<Building2 className='w-12 h-12 mx-auto mb-2 text-gray-300' />
						<p>No hall data available</p>
					</div>
				) : (
					sortedData.slice(0, 8).map((hall, index) => (
						<div key={index} className='space-y-2'>
							<div className='flex items-center justify-between'>
								<div className='flex items-center gap-2'>
									<span className='text-sm font-medium text-gray-900'>
										{hall.hallCode}
									</span>
									<Badge
										variant='outline'
										className='text-xs'
									>
										{hall.building}
									</Badge>
									{getUtilizationBadge(
										hall.utilizationRate,
										hall.currentlyOccupied
									)}
								</div>
								<div className='flex items-center gap-2 text-xs text-gray-500'>
									<Users className='w-3 h-3' />
									{hall.capacity}
								</div>
							</div>
							<div className='space-y-1'>
								<Progress
									value={hall.utilizationRate}
									className='h-2'
								/>
								<div className='flex justify-between text-xs text-gray-500'>
									<span>{hall.totalBookings} bookings</span>
									<span>
										{hall.utilizationRate}% utilized
									</span>
								</div>
							</div>
						</div>
					))
				)}

				{sortedData.length > 8 && (
					<div className='pt-2 border-t'>
						<p className='text-xs text-gray-500 text-center'>
							Showing top 8 halls by utilization
						</p>
					</div>
				)}
			</CardContent>
		</Card>
	);
}

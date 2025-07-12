import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Users, CheckCircle } from 'lucide-react';

interface SimpleMetricsCardsProps {
	data: {
		totalReservations: number;
		activeUsers: number;
		completionRate: number;
		totalReservationsChange: number;
		activeUsersChange: number;
		completionRateChange: number;
	};
}

export function SimpleMetricsCards({ data }: SimpleMetricsCardsProps) {
	const formatChange = (change: number) => {
		const sign = change > 0 ? '+' : '';
		return `${sign}${change}%`;
	};

	const getChangeColor = (change: number) => {
		return change > 0
			? 'text-green-600'
			: change < 0
				? 'text-red-600'
				: 'text-gray-600';
	};

	return (
		<div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
			{/* Total Reservations */}
			<Card className='bg-white border-0 shadow-sm'>
				<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
					<CardTitle className='text-sm font-medium text-gray-600'>
						Total Reservations
					</CardTitle>
					<Calendar className='h-4 w-4 text-gray-400' />
				</CardHeader>
				<CardContent>
					<div className='text-2xl font-bold text-gray-900'>
						{data.totalReservations.toLocaleString()}
					</div>
					<p
						className={`text-xs ${getChangeColor(data.totalReservationsChange)} mt-1`}
					>
						{formatChange(data.totalReservationsChange)} from last
						month
					</p>
				</CardContent>
			</Card>

			{/* Active Users */}
			<Card className='bg-white border-0 shadow-sm'>
				<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
					<CardTitle className='text-sm font-medium text-gray-600'>
						Active Users
					</CardTitle>
					<Users className='h-4 w-4 text-gray-400' />
				</CardHeader>
				<CardContent>
					<div className='text-2xl font-bold text-gray-900'>
						{data.activeUsers.toLocaleString()}
					</div>
					<p
						className={`text-xs ${getChangeColor(data.activeUsersChange)} mt-1`}
					>
						{formatChange(data.activeUsersChange)} from last month
					</p>
				</CardContent>
			</Card>

			{/* Completion Rate */}
			<Card className='bg-white border-0 shadow-sm'>
				<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
					<CardTitle className='text-sm font-medium text-gray-600'>
						Completion Rate
					</CardTitle>
					<CheckCircle className='h-4 w-4 text-gray-400' />
				</CardHeader>
				<CardContent>
					<div className='text-2xl font-bold text-gray-900'>
						{data.completionRate}%
					</div>
					<p
						className={`text-xs ${getChangeColor(data.completionRateChange)} mt-1`}
					>
						{formatChange(data.completionRateChange)} from last
						month
					</p>
				</CardContent>
			</Card>
		</div>
	);
}

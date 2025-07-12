'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { HallUtilization } from '@/lib/dashboard-data';
import { Building, TrendingUp } from 'lucide-react';

interface HallOccupancyDonutProps {
	hallUtilization: HallUtilization[];
}

export function HallOccupancyDonut({
	hallUtilization,
}: HallOccupancyDonutProps) {
	const occupiedHalls = hallUtilization.filter(
		(h) => h.currentlyOccupied
	).length;
	const availableHalls = hallUtilization.length - occupiedHalls;

	const data = [
		{
			name: 'Occupied',
			value: occupiedHalls,
			color: '#ef4444',
			icon: '🔴',
		},
		{
			name: 'Available',
			value: availableHalls,
			color: '#10b981',
			icon: '🟢',
		},
	];

	const COLORS = ['#ef4444', '#10b981'];

	const occupancyPercentage =
		hallUtilization.length > 0
			? Math.round((occupiedHalls / hallUtilization.length) * 100)
			: 0;

	return (
		<Card className='col-span-1'>
			<CardHeader>
				<CardTitle className='text-lg font-semibold flex items-center gap-2'>
					<Building className='w-5 h-5' />
					Hall Occupancy
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className='h-[300px] w-full relative'>
					<ResponsiveContainer width='100%' height='100%'>
						<PieChart>
							<Pie
								data={data}
								cx='50%'
								cy='50%'
								innerRadius={60}
								outerRadius={100}
								paddingAngle={5}
								dataKey='value'
							>
								{data.map((entry, index) => (
									<Cell
										key={`cell-${index}`}
										fill={COLORS[index % COLORS.length]}
									/>
								))}
							</Pie>
							<Tooltip
								content={({ active, payload }) => {
									if (active && payload && payload.length) {
										const data = payload[0].payload;
										return (
											<div className='bg-white p-3 border border-gray-200 rounded-lg shadow-lg'>
												<p className='font-semibold text-gray-900 flex items-center gap-2'>
													{data.icon} {data.name}
												</p>
												<p className='text-sm text-gray-600'>
													{data.value} halls
												</p>
											</div>
										);
									}
									return null;
								}}
							/>
						</PieChart>
					</ResponsiveContainer>

					{/* Center text */}
					<div className='absolute inset-0 flex items-center justify-center'>
						<div className='text-center'>
							<div className='text-2xl font-bold text-gray-900'>
								{occupancyPercentage}%
							</div>
							<div className='text-sm text-gray-600'>
								Occupied
							</div>
						</div>
					</div>
				</div>

				{/* Stats */}
				<div className='grid grid-cols-2 gap-4 mt-4'>
					<div className='text-center p-3 bg-red-50 rounded-lg border border-red-200'>
						<div className='text-lg font-semibold text-red-800'>
							{occupiedHalls}
						</div>
						<div className='text-sm text-red-600'>🔴 Occupied</div>
					</div>
					<div className='text-center p-3 bg-green-50 rounded-lg border border-green-200'>
						<div className='text-lg font-semibold text-green-800'>
							{availableHalls}
						</div>
						<div className='text-sm text-green-600'>
							🟢 Available
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

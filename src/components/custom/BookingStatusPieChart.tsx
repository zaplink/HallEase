'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
	PieChart,
	Pie,
	Cell,
	ResponsiveContainer,
	Tooltip,
	Legend,
} from 'recharts';
import { DashboardStats } from '@/lib/dashboard-data';
import { CheckCircle, Clock, XCircle } from 'lucide-react';

interface BookingStatusPieChartProps {
	stats: DashboardStats;
}

export function BookingStatusPieChart({ stats }: BookingStatusPieChartProps) {
	const data = [
		{
			name: 'Approved',
			value: stats.completedBookings,
			color: '#10b981',
			icon: '✅',
		},
		{
			name: 'Pending',
			value: stats.pendingApprovals,
			color: '#f59e0b',
			icon: '⏳',
		},
		{
			name: 'Rejected',
			value: stats.rejectedBookings,
			color: '#ef4444',
			icon: '❌',
		},
	];

	const COLORS = ['#10b981', '#f59e0b', '#ef4444'];

	const renderCustomizedLabel = ({
		cx,
		cy,
		midAngle,
		innerRadius,
		outerRadius,
		percent,
		index,
	}: any) => {
		const RADIAN = Math.PI / 180;
		const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
		const x = cx + radius * Math.cos(-midAngle * RADIAN);
		const y = cy + radius * Math.sin(-midAngle * RADIAN);

		return (
			<text
				x={x}
				y={y}
				fill='white'
				textAnchor={x > cx ? 'start' : 'end'}
				dominantBaseline='central'
				className='text-sm font-medium'
			>
				{`${(percent * 100).toFixed(0)}%`}
			</text>
		);
	};

	return (
		<Card className='col-span-1'>
			<CardHeader>
				<CardTitle className='text-lg font-semibold flex items-center gap-2'>
					<CheckCircle className='w-5 h-5' />
					Booking Status Distribution
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className='h-[300px] w-full'>
					<ResponsiveContainer width='100%' height='100%'>
						<PieChart>
							<Pie
								data={data}
								cx='50%'
								cy='50%'
								labelLine={false}
								label={renderCustomizedLabel}
								outerRadius={80}
								fill='#8884d8'
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
													{data.value} bookings
												</p>
											</div>
										);
									}
									return null;
								}}
							/>
						</PieChart>
					</ResponsiveContainer>
				</div>

				{/* Legend */}
				<div className='flex justify-center gap-6 mt-4'>
					{data.map((item, index) => (
						<div key={index} className='flex items-center gap-2'>
							<div
								className='w-3 h-3 rounded-full'
								style={{ backgroundColor: item.color }}
							/>
							<span className='text-sm text-gray-600'>
								{item.icon} {item.name} ({item.value})
							</span>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}

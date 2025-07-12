'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
	Bar,
	BarChart,
	CartesianGrid,
	XAxis,
	YAxis,
	Tooltip,
	ResponsiveContainer,
	Legend,
} from 'recharts';
import { BookingTrend } from '@/lib/dashboard-data';
import { TrendingUp } from 'lucide-react';

interface BookingTrendsChartProps {
	data: BookingTrend[];
}

export function BookingTrendsChart({ data }: BookingTrendsChartProps) {
	const chartData = data.map((trend) => ({
		month: trend.month.slice(0, 3), // Short month name
		approved: trend.approvedBookings,
		pending: trend.pendingBookings,
		rejected: trend.rejectedBookings,
		total: trend.totalBookings,
	}));

	return (
		<Card className='col-span-2'>
			<CardHeader>
				<CardTitle className='text-lg font-semibold flex items-center gap-2'>
					<TrendingUp className='w-5 h-5' />
					Booking Trends
				</CardTitle>
				<p className='text-sm text-gray-600'>
					Monthly booking statistics over the last 12 months
				</p>
			</CardHeader>
			<CardContent>
				<div className='h-[300px] w-full'>
					<ResponsiveContainer width='100%' height='100%'>
						<BarChart
							data={chartData}
							margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
						>
							<CartesianGrid
								strokeDasharray='3 3'
								className='opacity-30'
							/>
							<XAxis
								dataKey='month'
								axisLine={false}
								tickLine={false}
								className='text-xs'
							/>
							<YAxis
								axisLine={false}
								tickLine={false}
								className='text-xs'
							/>
							<Tooltip
								content={({ active, payload, label }) => {
									if (active && payload && payload.length) {
										return (
											<div className='bg-white p-3 border border-gray-200 rounded-lg shadow-lg'>
												<p className='font-semibold text-gray-900'>
													{label}
												</p>
												{payload.map((entry, index) => (
													<p
														key={index}
														className='text-sm'
														style={{
															color: entry.color,
														}}
													>
														{entry.name}:{' '}
														{entry.value}
													</p>
												))}
											</div>
										);
									}
									return null;
								}}
							/>
							<Legend />
							<Bar
								dataKey='approved'
								name='Approved'
								fill='#10b981'
								radius={[2, 2, 0, 0]}
							/>
							<Bar
								dataKey='pending'
								name='Pending'
								fill='#f59e0b'
								radius={[2, 2, 0, 0]}
							/>
							<Bar
								dataKey='rejected'
								name='Rejected'
								fill='#ef4444'
								radius={[2, 2, 0, 0]}
							/>
						</BarChart>
					</ResponsiveContainer>
				</div>
			</CardContent>
		</Card>
	);
}

'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	Area,
	AreaChart,
} from 'recharts';
import { BookingTrend } from '@/lib/dashboard-data';
import { Activity, TrendingUp } from 'lucide-react';

interface BookingTrendsLineChartProps {
	data: BookingTrend[];
}

export function BookingTrendsLineChart({ data }: BookingTrendsLineChartProps) {
	const chartData = data.map((trend) => ({
		month: trend.month.slice(0, 3),
		total: trend.totalBookings,
		approved: trend.approvedBookings,
		pending: trend.pendingBookings,
		rejected: trend.rejectedBookings,
	}));

	// Calculate trend
	const currentTotal = chartData[chartData.length - 1]?.total || 0;
	const previousTotal = chartData[chartData.length - 2]?.total || 0;
	const trendPercentage =
		previousTotal > 0
			? Math.round(((currentTotal - previousTotal) / previousTotal) * 100)
			: 0;

	return (
		<Card className='col-span-2'>
			<CardHeader>
				<CardTitle className='text-lg font-semibold flex items-center gap-2'>
					<Activity className='w-5 h-5' />
					Booking Activity Trends
				</CardTitle>
				<div className='flex items-center gap-2 text-sm text-gray-600'>
					<TrendingUp className='w-4 h-4' />
					<span>
						{trendPercentage > 0 ? '+' : ''}
						{trendPercentage}% from last month
					</span>
				</div>
			</CardHeader>
			<CardContent>
				<div className='h-[300px] w-full'>
					<ResponsiveContainer width='100%' height='100%'>
						<AreaChart
							data={chartData}
							margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
						>
							<defs>
								<linearGradient
									id='colorTotal'
									x1='0'
									y1='0'
									x2='0'
									y2='1'
								>
									<stop
										offset='5%'
										stopColor='#3b82f6'
										stopOpacity={0.8}
									/>
									<stop
										offset='95%'
										stopColor='#3b82f6'
										stopOpacity={0.1}
									/>
								</linearGradient>
								<linearGradient
									id='colorApproved'
									x1='0'
									y1='0'
									x2='0'
									y2='1'
								>
									<stop
										offset='5%'
										stopColor='#10b981'
										stopOpacity={0.8}
									/>
									<stop
										offset='95%'
										stopColor='#10b981'
										stopOpacity={0.1}
									/>
								</linearGradient>
							</defs>
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
												<p className='font-semibold text-gray-900 mb-2'>
													{label}
												</p>
												{payload.map((entry, index) => (
													<p
														key={index}
														className='text-sm flex items-center gap-2'
														style={{
															color: entry.color,
														}}
													>
														<span
															className='w-2 h-2 rounded-full'
															style={{
																backgroundColor:
																	entry.color,
															}}
														/>
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
							<Area
								type='monotone'
								dataKey='total'
								stroke='#3b82f6'
								strokeWidth={2}
								fillOpacity={1}
								fill='url(#colorTotal)'
								name='Total Bookings'
							/>
							<Area
								type='monotone'
								dataKey='approved'
								stroke='#10b981'
								strokeWidth={2}
								fillOpacity={1}
								fill='url(#colorApproved)'
								name='Approved'
							/>
						</AreaChart>
					</ResponsiveContainer>
				</div>

				{/* Summary stats */}
				<div className='grid grid-cols-3 gap-4 mt-4 pt-4 border-t'>
					<div className='text-center'>
						<div className='text-lg font-semibold text-blue-600'>
							{chartData.reduce(
								(sum, item) => sum + item.total,
								0
							)}
						</div>
						<div className='text-sm text-gray-600'>
							Total Bookings
						</div>
					</div>
					<div className='text-center'>
						<div className='text-lg font-semibold text-green-600'>
							{chartData.reduce(
								(sum, item) => sum + item.approved,
								0
							)}
						</div>
						<div className='text-sm text-gray-600'>Approved</div>
					</div>
					<div className='text-center'>
						<div className='text-lg font-semibold text-yellow-600'>
							{chartData.reduce(
								(sum, item) => sum + item.pending,
								0
							)}
						</div>
						<div className='text-sm text-gray-600'>Pending</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

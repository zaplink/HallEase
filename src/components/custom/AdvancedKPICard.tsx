'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUpIcon, ArrowDownIcon, MinusIcon } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

interface AdvancedKPICardProps {
	title: string;
	value: string | number;
	change?: number;
	changeLabel?: string;
	icon?: React.ReactNode;
	description?: string;
	trend?: 'up' | 'down' | 'neutral';
	sparklineData?: number[];
	color?: string;
}

export function AdvancedKPICard({
	title,
	value,
	change,
	changeLabel,
	icon,
	description,
	trend,
	sparklineData,
	color = '#3b82f6',
}: AdvancedKPICardProps) {
	const getTrendColor = () => {
		if (trend === 'up') return 'text-green-600';
		if (trend === 'down') return 'text-red-600';
		return 'text-gray-600';
	};

	const getTrendIcon = () => {
		if (trend === 'up') return <ArrowUpIcon className='w-4 h-4' />;
		if (trend === 'down') return <ArrowDownIcon className='w-4 h-4' />;
		return <MinusIcon className='w-4 h-4' />;
	};

	const getTrendBgColor = () => {
		if (trend === 'up') return 'bg-green-50 border-green-200';
		if (trend === 'down') return 'bg-red-50 border-red-200';
		return 'bg-gray-50 border-gray-200';
	};

	return (
		<Card
			className={`hover:shadow-lg transition-all duration-200 ${getTrendBgColor()}`}
		>
			<CardHeader className='flex flex-row items-center justify-between pb-2'>
				<CardTitle className='text-sm font-medium text-gray-600'>
					{title}
				</CardTitle>
				{icon && <div className='text-gray-400'>{icon}</div>}
			</CardHeader>
			<CardContent className='pt-0'>
				<div className='flex items-end justify-between'>
					<div className='flex-1'>
						<div className='text-2xl font-bold text-gray-900 mb-1'>
							{value}
						</div>
						{(change !== undefined || changeLabel) && (
							<div
								className={`flex items-center text-sm ${getTrendColor()}`}
							>
								{change !== undefined && (
									<>
										{getTrendIcon()}
										<span className='ml-1'>
											{change > 0 ? '+' : ''}
											{change}%
										</span>
									</>
								)}
								{changeLabel && (
									<span className='ml-1 text-gray-500'>
										{changeLabel}
									</span>
								)}
							</div>
						)}
						{description && (
							<p className='text-xs text-gray-500 mt-1'>
								{description}
							</p>
						)}
					</div>

					{sparklineData && sparklineData.length > 0 && (
						<div className='w-16 h-8 ml-2'>
							<ResponsiveContainer width='100%' height='100%'>
								<LineChart
									data={sparklineData.map((value, index) => ({
										value,
										index,
									}))}
								>
									<Line
										type='monotone'
										dataKey='value'
										stroke={color}
										strokeWidth={2}
										dot={false}
										activeDot={false}
									/>
								</LineChart>
							</ResponsiveContainer>
						</div>
					)}
				</div>
			</CardContent>
		</Card>
	);
}

'use client';

import * as React from 'react';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
	TrendingUp,
	TrendingDown,
	Calendar,
	Users,
	Building,
	Clock,
	// BarChart3,
	// PieChart,
	Activity,
	Zap,
} from 'lucide-react';

interface ComparisonMetric {
	title: string;
	current: number;
	previous: number;
	unit: string;
	format: 'number' | 'percentage' | 'currency' | 'time';
	icon: React.ReactNode;
	color: string;
}

export function AnalyticsDashboard() {
	const comparisonMetrics: ComparisonMetric[] = [
		{
			title: 'Total Bookings',
			current: 1234,
			previous: 1102,
			unit: '',
			format: 'number',
			icon: <Calendar className='h-4 w-4' />,
			color: 'blue',
		},
		{
			title: 'Active Users',
			current: 456,
			previous: 421,
			unit: '',
			format: 'number',
			icon: <Users className='h-4 w-4' />,
			color: 'green',
		},
		{
			title: 'Approval Rate',
			current: 87,
			previous: 84,
			unit: '%',
			format: 'percentage',
			icon: <TrendingUp className='h-4 w-4' />,
			color: 'orange',
		},
		{
			title: 'Response Time',
			current: 2.3,
			previous: 2.7,
			unit: 'h',
			format: 'time',
			icon: <Clock className='h-4 w-4' />,
			color: 'purple',
		},
	];

	const formatValue = (value: number, format: string, unit: string) => {
		switch (format) {
			case 'number':
				return value.toLocaleString();
			case 'percentage':
				return `${value}${unit}`;
			case 'time':
				return `${value}${unit}`;
			default:
				return `${value}${unit}`;
		}
	};

	const getChangePercentage = (current: number, previous: number) => {
		if (previous === 0) return 0;
		return ((current - previous) / previous) * 100;
	};

	const getColorClass = (color: string) => {
		switch (color) {
			case 'blue':
				return 'from-blue-500 to-blue-600';
			case 'green':
				return 'from-green-500 to-green-600';
			case 'orange':
				return 'from-orange-500 to-orange-600';
			case 'purple':
				return 'from-purple-500 to-purple-600';
			default:
				return 'from-gray-500 to-gray-600';
		}
	};

	return (
		<div className='space-y-8'>
			{/* Performance Comparison */}
			<div className='space-y-4'>
				<div className='flex items-center gap-3'>
					<div className='w-1 h-6 bg-gradient-to-b from-primary to-primary/60 rounded-full'></div>
					<h3 className='text-xl font-semibold text-foreground'>
						Performance Comparison
					</h3>
				</div>
				<p className='text-sm text-muted-foreground ml-6'>
					Compare current metrics with previous period to track
					improvements
				</p>

				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
					{comparisonMetrics.map((metric, index) => {
						const changePercentage = getChangePercentage(
							metric.current,
							metric.previous
						);
						const isPositive = changePercentage > 0;
						const isImprovement =
							metric.title === 'Response Time'
								? changePercentage < 0
								: changePercentage > 0;

						return (
							<Card
								key={index}
								className='border-0 shadow-sm hover:shadow-lg transition-all duration-300'
							>
								<CardContent className='p-6'>
									<div className='space-y-4'>
										{/* Header */}
										<div className='flex items-center justify-between'>
											<div
												className={`p-2 rounded-lg bg-gradient-to-r ${getColorClass(metric.color)} text-white`}
											>
												{metric.icon}
											</div>
											<Badge
												variant={
													isImprovement
														? 'default'
														: 'secondary'
												}
												className={`${
													isImprovement
														? 'bg-green-100 text-green-800 hover:bg-green-200'
														: 'bg-red-100 text-red-800 hover:bg-red-200'
												}`}
											>
												{isImprovement ? (
													<TrendingUp className='h-3 w-3 mr-1' />
												) : (
													<TrendingDown className='h-3 w-3 mr-1' />
												)}
												{Math.abs(
													changePercentage
												).toFixed(1)}
												%
											</Badge>
										</div>

										{/* Title and Values */}
										<div className='space-y-2'>
											<h4 className='text-sm font-medium text-muted-foreground uppercase tracking-wide'>
												{metric.title}
											</h4>
											<div className='flex items-baseline gap-3'>
												<div className='text-2xl font-bold text-foreground'>
													{formatValue(
														metric.current,
														metric.format,
														metric.unit
													)}
												</div>
												<div className='text-sm text-muted-foreground'>
													from{' '}
													{formatValue(
														metric.previous,
														metric.format,
														metric.unit
													)}
												</div>
											</div>
										</div>

										{/* Progress Bar */}
										<div className='space-y-2'>
											<div className='flex justify-between text-xs text-muted-foreground'>
												<span>Previous</span>
												<span>Current</span>
											</div>
											<Progress
												value={Math.min(
													(metric.current /
														Math.max(
															metric.current,
															metric.previous
														)) *
														100,
													100
												)}
												className='h-2'
											/>
										</div>
									</div>
								</CardContent>
							</Card>
						);
					})}
				</div>
			</div>

			{/* Usage Trends */}
			<div className='space-y-4'>
				<div className='flex items-center gap-3'>
					<div className='w-1 h-6 bg-gradient-to-b from-orange-500 to-orange-600 rounded-full'></div>
					<h3 className='text-xl font-semibold text-foreground'>
						Usage Trends
					</h3>
				</div>

				<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
					{/* Daily Usage Pattern */}
					<Card className='border-0 shadow-sm'>
						<CardHeader>
							<CardTitle className='flex items-center gap-2'>
								<Activity className='h-5 w-5 text-blue-500' />
								Daily Pattern
							</CardTitle>
							<CardDescription>Peak usage hours</CardDescription>
						</CardHeader>
						<CardContent>
							<div className='space-y-3'>
								{[
									{
										time: '8:00 AM',
										usage: 35,
										label: 'Morning',
									},
									{
										time: '12:00 PM',
										usage: 80,
										label: 'Lunch',
									},
									{
										time: '2:00 PM',
										usage: 95,
										label: 'Peak',
									},
									{
										time: '6:00 PM',
										usage: 45,
										label: 'Evening',
									},
								].map((slot, index) => (
									<div key={index} className='space-y-1'>
										<div className='flex justify-between text-sm'>
											<span className='text-muted-foreground'>
												{slot.time}
											</span>
											<span className='font-medium'>
												{slot.usage}%
											</span>
										</div>
										<Progress
											value={slot.usage}
											className='h-2'
										/>
									</div>
								))}
							</div>
						</CardContent>
					</Card>

					{/* Hall Types */}
					<Card className='border-0 shadow-sm'>
						<CardHeader>
							<CardTitle className='flex items-center gap-2'>
								<Building className='h-5 w-5 text-green-500' />
								Hall Types
							</CardTitle>
							<CardDescription>
								Usage by hall category
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className='space-y-3'>
								{[
									{
										type: 'Lecture Halls',
										usage: 65,
										bookings: 324,
									},
									{
										type: 'Laboratories',
										usage: 45,
										bookings: 189,
									},
									{
										type: 'Auditoriums',
										usage: 30,
										bookings: 89,
									},
									{
										type: 'Studios',
										usage: 25,
										bookings: 67,
									},
								].map((hall, index) => (
									<div key={index} className='space-y-1'>
										<div className='flex justify-between text-sm'>
											<span className='text-muted-foreground'>
												{hall.type}
											</span>
											<span className='font-medium'>
												{hall.bookings}
											</span>
										</div>
										<Progress
											value={hall.usage}
											className='h-2'
										/>
									</div>
								))}
							</div>
						</CardContent>
					</Card>

					{/* Energy Efficiency */}
					<Card className='border-0 shadow-sm'>
						<CardHeader>
							<CardTitle className='flex items-center gap-2'>
								<Zap className='h-5 w-5 text-orange-500' />
								Energy Efficiency
							</CardTitle>
							<CardDescription>
								Power consumption trends
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className='space-y-3'>
								{[
									{
										building: 'Academic Block',
										efficiency: 85,
										status: 'Good',
									},
									{
										building: 'Laboratory',
										efficiency: 72,
										status: 'Average',
									},
									{
										building: 'Engineering',
										efficiency: 68,
										status: 'Poor',
									},
									{
										building: 'Library',
										efficiency: 90,
										status: 'Excellent',
									},
								].map((building, index) => (
									<div key={index} className='space-y-1'>
										<div className='flex justify-between text-sm'>
											<span className='text-muted-foreground'>
												{building.building}
											</span>
											<Badge
												variant='outline'
												className={`text-xs ${
													building.efficiency > 80
														? 'text-green-600'
														: building.efficiency >
															  70
															? 'text-orange-600'
															: 'text-red-600'
												}`}
											>
												{building.status}
											</Badge>
										</div>
										<Progress
											value={building.efficiency}
											className='h-2'
										/>
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}

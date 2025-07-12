'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
	CalendarDays,
	Users,
	Building,
	TrendingUp,
	Clock,
	AlertCircle,
	FileText,
	Zap,
} from 'lucide-react';

interface MetricCardProps {
	title: string;
	value: string | number;
	description: string;
	trend?: {
		value: number;
		isPositive: boolean;
	};
	icon: React.ReactNode;
	category?: string;
}

export function MetricCard({
	title,
	value,
	description,
	trend,
	icon,
	category = 'default',
}: MetricCardProps) {
	const getCategoryStyles = () => {
		switch (category) {
			case 'primary':
				return 'bg-gradient-to-br from-green-50 to-green-100/30 border-green-200/60 hover:border-green-300 hover:shadow-green-100/50';
			case 'operational':
				return 'bg-gradient-to-br from-blue-50 to-blue-100/30 border-blue-200/60 hover:border-blue-300 hover:shadow-blue-100/50';
			default:
				return 'bg-gradient-to-br from-muted/30 to-muted/10 border-muted/40 hover:border-muted/60';
		}
	};

	const getIconStyles = () => {
		switch (category) {
			case 'primary':
				return 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400';
			case 'operational':
				return 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400';
			default:
				return 'bg-primary/10 text-primary';
		}
	};

	return (
		<Card
			className={`border-0 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-[1.02] ${getCategoryStyles()}`}
		>
			<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-3'>
				<div className='space-y-1'>
					<CardTitle className='text-sm font-medium text-muted-foreground uppercase tracking-wide'>
						{title}
					</CardTitle>
				</div>
				<div className={`p-3 rounded-xl ${getIconStyles()}`}>
					{icon}
				</div>
			</CardHeader>
			<CardContent className='space-y-4'>
				<div className='space-y-2'>
					<div className='text-3xl font-bold text-foreground tracking-tight'>
						{value}
					</div>
					<p className='text-sm text-muted-foreground font-medium'>
						{description}
					</p>
				</div>
				{trend && (
					<div className='flex items-center gap-2 pt-2 border-t border-muted/20'>
						<Badge
							variant={
								trend.isPositive ? 'default' : 'destructive'
							}
							className={`text-xs px-2 py-1 font-medium ${
								trend.isPositive
									? 'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/20 dark:text-green-400'
									: 'bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900/20 dark:text-red-400'
							}`}
						>
							{trend.isPositive ? '↗' : '↘'}{' '}
							{trend.isPositive ? '+' : ''}
							{trend.value}%
						</Badge>
						<span className='text-xs text-muted-foreground'>
							vs last month
						</span>
					</div>
				)}
			</CardContent>
		</Card>
	);
}

export function MetricsOverview() {
	// Group metrics by category for better organization
	const primaryMetrics = [
		{
			title: 'Total Reserves',
			value: '1,234',
			description: 'Complete reservation records in system',
			trend: { value: 12, isPositive: true },
			icon: <CalendarDays className='h-5 w-5' />,
			category: 'primary',
		},
		{
			title: 'Active Users',
			value: '456',
			description: 'Users with active bookings this month',
			trend: { value: 8, isPositive: true },
			icon: <Users className='h-5 w-5' />,
			category: 'primary',
		},
		{
			title: 'Available Halls',
			value: '23',
			description: 'Currently available for booking',
			trend: { value: 0, isPositive: true },
			icon: <Building className='h-5 w-5' />,
			category: 'primary',
		},
		{
			title: 'Approval Rate',
			value: '87%',
			description: 'Successfully approved reservations',
			trend: { value: 3, isPositive: true },
			icon: <TrendingUp className='h-5 w-5' />,
			category: 'primary',
		},
	];

	const operationalMetrics = [
		{
			title: 'Response Time',
			value: '2.3h',
			description: 'Average time to process requests',
			trend: { value: 15, isPositive: false },
			icon: <Clock className='h-5 w-5' />,
			category: 'operational',
		},
		{
			title: 'Pending Reviews',
			value: '45',
			description: 'Reservations awaiting approval',
			trend: { value: 10, isPositive: false },
			icon: <AlertCircle className='h-5 w-5' />,
			category: 'operational',
		},
		{
			title: 'Draft Reserves',
			value: '12',
			description: 'Incomplete reservation drafts',
			trend: { value: 25, isPositive: false },
			icon: <FileText className='h-5 w-5' />,
			category: 'operational',
		},
		{
			title: 'Energy Consumption',
			value: '1,847',
			description: 'Total energy units consumed',
			trend: { value: 5, isPositive: false },
			icon: <Zap className='h-5 w-5' />,
			category: 'operational',
		},
	];

	return (
		<div className='space-y-8'>
			{/* Primary Metrics */}
			<div className='space-y-4'>
				<div className='flex items-center gap-2'>
					<div className='w-2 h-2 bg-green-500 rounded-full'></div>
					<h4 className='text-lg font-semibold text-foreground'>
						Key Performance Indicators
					</h4>
					<div className='h-px bg-gradient-to-r from-green-200 to-transparent flex-1 ml-2'></div>
				</div>
				<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
					{primaryMetrics.map((metric, index) => (
						<MetricCard key={index} {...metric} />
					))}
				</div>
			</div>

			{/* Operational Metrics */}
			<div className='space-y-4'>
				<div className='flex items-center gap-2'>
					<div className='w-2 h-2 bg-blue-500 rounded-full'></div>
					<h4 className='text-lg font-semibold text-foreground'>
						Operational Metrics
					</h4>
					<div className='h-px bg-gradient-to-r from-blue-200 to-transparent flex-1 ml-2'></div>
				</div>
				<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
					{operationalMetrics.map((metric, index) => (
						<MetricCard key={index} {...metric} />
					))}
				</div>
			</div>

			{/* Summary Stats */}
			<div className='bg-gradient-to-r from-muted/50 to-muted/20 p-6 rounded-xl border border-muted/20'>
				<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
					<div className='text-center'>
						<div className='text-3xl font-bold text-green-600 mb-1'>
							78%
						</div>
						<div className='text-sm text-muted-foreground'>
							Success Rate
						</div>
					</div>
					<div className='text-center'>
						<div className='text-3xl font-bold text-blue-600 mb-1'>
							324
						</div>
						<div className='text-sm text-muted-foreground'>
							This Month
						</div>
					</div>
					<div className='text-center'>
						<div className='text-3xl font-bold text-purple-600 mb-1'>
							↗ 12%
						</div>
						<div className='text-sm text-muted-foreground'>
							Growth
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

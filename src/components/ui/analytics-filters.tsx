'use client';

import * as React from 'react';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { CalendarIcon, Download, Filter, RefreshCw } from 'lucide-react';
import { DatePickerDemo } from '@/components/ui/DatePicker';

interface AnalyticsFiltersProps {
	onFilterChange?: (filters: any) => void;
	onExport?: (format: 'csv' | 'pdf') => void;
	onRefresh?: () => void;
}

export function AnalyticsFilters({
	onFilterChange,
	onExport,
	onRefresh,
}: AnalyticsFiltersProps) {
	const [dateRange, setDateRange] = React.useState<{
		from: Date | undefined;
		to: Date | undefined;
	}>({
		from: undefined,
		to: undefined,
	});

	const [selectedHall, setSelectedHall] = React.useState<string>('');
	const [selectedEventType, setSelectedEventType] =
		React.useState<string>('');
	const [selectedStatus, setSelectedStatus] = React.useState<string>('');

	const handleFilterApply = () => {
		const filters = {
			dateRange,
			hall: selectedHall,
			eventType: selectedEventType,
			status: selectedStatus,
		};
		onFilterChange?.(filters);
	};

	const handleClearFilters = () => {
		setDateRange({ from: undefined, to: undefined });
		setSelectedHall('');
		setSelectedEventType('');
		setSelectedStatus('');
		onFilterChange?.({});
	};

	return (
		<Card className='border-0 shadow-sm'>
			<CardHeader className='pb-4'>
				<CardTitle className='flex items-center gap-2 text-lg'>
					<Filter className='h-5 w-5 text-primary' />
					Analytics Filters
				</CardTitle>
				<CardDescription className='text-sm text-muted-foreground'>
					Filter and export analytics data to customize your insights
				</CardDescription>
			</CardHeader>
			<CardContent className='space-y-6'>
				{/* Filter Controls */}
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
					{/* Date Range */}
					<div className='space-y-2'>
						<Label className='text-sm font-medium text-foreground'>
							Date Range
						</Label>
						<div className='flex gap-2'>
							<DatePickerDemo
								value={dateRange.from}
								onChange={(date: Date | undefined) =>
									setDateRange((prev) => ({
										...prev,
										from: date,
									}))
								}
							/>
							<DatePickerDemo
								value={dateRange.to}
								onChange={(date: Date | undefined) =>
									setDateRange((prev) => ({
										...prev,
										to: date,
									}))
								}
							/>
						</div>
					</div>

					{/* Hall Filter */}
					<div className='space-y-2'>
						<Label className='text-sm font-medium text-foreground'>
							Hall
						</Label>
						<Select
							value={selectedHall}
							onValueChange={setSelectedHall}
						>
							<SelectTrigger className='w-full'>
								<SelectValue placeholder='Select hall' />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value='all'>All Halls</SelectItem>
								<SelectItem value='LT1'>
									LT1 - Lecture Theatre 1
								</SelectItem>
								<SelectItem value='LT2'>
									LT2 - Lecture Theatre 2
								</SelectItem>
								<SelectItem value='LAB1'>
									LAB1 - Laboratory 1
								</SelectItem>
								<SelectItem value='STUDIO'>
									STUDIO - Recording Studio
								</SelectItem>
								<SelectItem value='AUD'>
									AUD - Main Auditorium
								</SelectItem>
							</SelectContent>
						</Select>
					</div>

					{/* Event Type Filter */}
					<div className='space-y-2'>
						<Label className='text-sm font-medium text-foreground'>
							Event Type
						</Label>
						<Select
							value={selectedEventType}
							onValueChange={setSelectedEventType}
						>
							<SelectTrigger className='w-full'>
								<SelectValue placeholder='Select type' />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value='all'>All Types</SelectItem>
								<SelectItem value='conference'>
									Conference
								</SelectItem>
								<SelectItem value='seminar'>Seminar</SelectItem>
								<SelectItem value='workshop'>
									Workshop
								</SelectItem>
								<SelectItem value='event'>
									General Event
								</SelectItem>
								<SelectItem value='extra_lecture'>
									Extra Lecture
								</SelectItem>
							</SelectContent>
						</Select>
					</div>

					{/* Status Filter */}
					<div className='space-y-2'>
						<Label className='text-sm font-medium text-foreground'>
							Status
						</Label>
						<Select
							value={selectedStatus}
							onValueChange={setSelectedStatus}
						>
							<SelectTrigger className='w-full'>
								<SelectValue placeholder='Select status' />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value='all'>All Status</SelectItem>
								<SelectItem value='approved'>
									✓ Approved
								</SelectItem>
								<SelectItem value='pending'>
									⏳ Pending
								</SelectItem>
								<SelectItem value='rejected'>
									✗ Rejected
								</SelectItem>
								<SelectItem value='waiting'>
									⏰ Waiting
								</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>

				{/* Action Buttons */}
				<div className='flex flex-col sm:flex-row gap-3 pt-4 border-t'>
					<div className='flex gap-2'>
						<Button
							onClick={handleFilterApply}
							className='flex items-center gap-2'
						>
							<Filter className='h-4 w-4' />
							Apply Filters
						</Button>
						<Button variant='outline' onClick={handleClearFilters}>
							Clear Filters
						</Button>
						<Button
							variant='outline'
							onClick={onRefresh}
							className='flex items-center gap-2'
						>
							<RefreshCw className='h-4 w-4' />
							Refresh
						</Button>
					</div>
					<div className='flex gap-2 sm:ml-auto'>
						<Button
							variant='outline'
							onClick={() => onExport?.('csv')}
							className='flex items-center gap-2'
						>
							<Download className='h-4 w-4' />
							Export CSV
						</Button>
						<Button
							variant='outline'
							onClick={() => onExport?.('pdf')}
							className='flex items-center gap-2'
						>
							<Download className='h-4 w-4' />
							Export PDF
						</Button>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

export function QuickStats() {
	const stats = [
		{
			label: 'This Week',
			value: '89',
			change: '+12%',
			isPositive: true,
			description: 'Total reservations made',
			icon: '📅',
			color: 'blue',
		},
		{
			label: 'This Month',
			value: '324',
			change: '+8%',
			isPositive: true,
			description: 'Monthly booking volume',
			icon: '📊',
			color: 'green',
		},
		{
			label: 'Peak Activity',
			value: '2-4 PM',
			change: 'Most Active',
			isPositive: true,
			description: 'Busiest booking hours',
			icon: '⏰',
			color: 'orange',
		},
		{
			label: 'Avg. Duration',
			value: '2.5h',
			change: '+15min',
			isPositive: false,
			description: 'Average booking length',
			icon: '⏱️',
			color: 'purple',
		},
	];

	return (
		<div className='space-y-6'>
			{/* Header */}
			<div className='space-y-2'>
				<div className='flex items-center gap-3'>
					<div className='w-1 h-6 bg-gradient-to-b from-primary to-primary/60 rounded-full'></div>
					<h3 className='text-lg font-semibold text-foreground'>
						System Activity Overview
					</h3>
				</div>
				<p className='text-sm text-muted-foreground ml-6'>
					Key performance indicators for immediate insights into
					system activity
				</p>
			</div>

			{/* Stats Grid */}
			<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
				{stats.map((stat, index) => (
					<Card
						key={index}
						className={`border-l-4 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] ${
							stat.color === 'blue'
								? 'border-l-blue-500 bg-gradient-to-br from-blue-50/50 to-blue-100/20'
								: stat.color === 'green'
									? 'border-l-green-500 bg-gradient-to-br from-green-50/50 to-green-100/20'
									: stat.color === 'orange'
										? 'border-l-orange-500 bg-gradient-to-br from-orange-50/50 to-orange-100/20'
										: 'border-l-purple-500 bg-gradient-to-br from-purple-50/50 to-purple-100/20'
						}`}
					>
						<CardContent className='p-6'>
							<div className='space-y-4'>
								{/* Header with Icon and Change */}
								<div className='flex items-center justify-between'>
									<div className='flex items-center gap-3'>
										<div
											className={`p-2 rounded-lg ${
												stat.color === 'blue'
													? 'bg-blue-100 text-blue-600'
													: stat.color === 'green'
														? 'bg-green-100 text-green-600'
														: stat.color ===
															  'orange'
															? 'bg-orange-100 text-orange-600'
															: 'bg-purple-100 text-purple-600'
											}`}
										>
											<span className='text-lg'>
												{stat.icon}
											</span>
										</div>
										<div className='text-sm font-medium text-muted-foreground uppercase tracking-wide'>
											{stat.label}
										</div>
									</div>
									<div
										className={`text-xs px-3 py-1 rounded-full font-medium ${
											stat.isPositive
												? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
												: 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
										}`}
									>
										{stat.isPositive ? '↗' : '↘'}{' '}
										{stat.change}
									</div>
								</div>

								{/* Value and Description */}
								<div className='space-y-2'>
									<div className='text-3xl font-bold text-foreground tracking-tight'>
										{stat.value}
									</div>
									<div className='text-sm text-muted-foreground font-medium'>
										{stat.description}
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
				))}
			</div>
		</div>
	);
}

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Filter, RotateCcw } from 'lucide-react';

interface SimpleAnalyticsFiltersProps {
	filters: {
		status: string;
		isSubmitted: string;
	};
	onFilterChange: (filters: { status: string; isSubmitted: string }) => void;
	onReset: () => void;
}

export function SimpleAnalyticsFilters({
	filters,
	onFilterChange,
	onReset,
}: SimpleAnalyticsFiltersProps) {
	const handleStatusChange = (status: string) => {
		onFilterChange({
			...filters,
			status: status === 'all' ? '' : status,
		});
	};

	const handleSubmissionChange = (isSubmitted: string) => {
		onFilterChange({
			...filters,
			isSubmitted: isSubmitted === 'all' ? '' : isSubmitted,
		});
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'approved':
				return 'bg-green-100 text-green-800';
			case 'pending':
				return 'bg-yellow-100 text-yellow-800';
			case 'rejected':
				return 'bg-red-100 text-red-800';
			case 'waiting':
				return 'bg-blue-100 text-blue-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	};

	const getSubmissionColor = (isSubmitted: string) => {
		switch (isSubmitted) {
			case 'true':
				return 'bg-green-100 text-green-800';
			case 'false':
				return 'bg-orange-100 text-orange-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	};

	return (
		<Card className='mb-6'>
			<CardHeader>
				<CardTitle className='flex items-center gap-2'>
					<Filter className='h-5 w-5' />
					Analytics Filters
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className='grid grid-cols-1 md:grid-cols-3 gap-4 items-end'>
					{/* Status Filter */}
					<div className='space-y-2'>
						<label className='text-sm font-medium'>
							Reservation Status
						</label>
						<Select
							value={filters.status || 'all'}
							onValueChange={handleStatusChange}
						>
							<SelectTrigger>
								<SelectValue placeholder='Select status' />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value='all'>
									All Statuses
								</SelectItem>
								<SelectItem value='pending'>Pending</SelectItem>
								<SelectItem value='approved'>
									Approved
								</SelectItem>
								<SelectItem value='waiting'>Waiting</SelectItem>
								<SelectItem value='rejected'>
									Rejected
								</SelectItem>
							</SelectContent>
						</Select>
					</div>

					{/* Submission Filter */}
					<div className='space-y-2'>
						<label className='text-sm font-medium'>
							Submission Status
						</label>
						<Select
							value={filters.isSubmitted || 'all'}
							onValueChange={handleSubmissionChange}
						>
							<SelectTrigger>
								<SelectValue placeholder='Select submission status' />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value='all'>
									All Submissions
								</SelectItem>
								<SelectItem value='true'>Submitted</SelectItem>
								<SelectItem value='false'>Draft</SelectItem>
							</SelectContent>
						</Select>
					</div>

					{/* Reset Button */}
					<div className='flex items-center gap-2'>
						<button
							onClick={onReset}
							className='flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors'
						>
							<RotateCcw className='h-4 w-4' />
							Reset
						</button>
					</div>
				</div>

				{/* Active Filters Display */}
				{(filters.status || filters.isSubmitted) && (
					<div className='mt-4 pt-4 border-t'>
						<p className='text-sm font-medium mb-2'>
							Active Filters:
						</p>
						<div className='flex flex-wrap gap-2'>
							{filters.status && (
								<Badge
									className={getStatusColor(filters.status)}
								>
									Status: {filters.status}
								</Badge>
							)}
							{filters.isSubmitted && (
								<Badge
									className={getSubmissionColor(
										filters.isSubmitted
									)}
								>
									Submission:{' '}
									{filters.isSubmitted === 'true'
										? 'Submitted'
										: 'Draft'}
								</Badge>
							)}
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	);
}

'use client';

import SidebarLayout from '@/layouts/Sidebar/Layout';
import { supabase } from '@/lib/supabaseClient';
import { useEffect, useState } from 'react';

export default function AnalyticsPage() {
	const [totalReservations, setTotalReservations] = useState<number | null>(
		null
	);
	const [activeUsers, setActiveUsers] = useState<number | null>(null);
	const [submittedReservations, setSubmittedReservations] = useState<
		number | null
	>(null);
	const [approvedReservations, setApprovedReservations] = useState<
		number | null
	>(null);
	const [extraLectureCount, setExtraLectureCount] = useState<number | null>(
		null
	);
	const [eventCount, setEventCount] = useState<number | null>(null);
	const [loading, setLoading] = useState(true);
	const [selectedFilter, setSelectedFilter] = useState<
		'all' | 'extra_lecture' | 'event'
	>('all');

	// Get current date
	const currentDate = new Date().toLocaleDateString('en-US', {
		weekday: 'short',
		year: 'numeric',
		month: 'short',
		day: 'numeric',
	});

	// Fetch analytics data from database
	useEffect(() => {
		const fetchAnalyticsData = async () => {
			try {
				// Apply filter for queries
				const filterQuery =
					selectedFilter === 'all' ? {} : { type: selectedFilter };

				// Fetch total reservations count (with filter)
				let reservationQuery = supabase
					.from('reserve')
					.select('*', { count: 'exact', head: true });

				if (selectedFilter !== 'all') {
					reservationQuery = reservationQuery.eq(
						'type',
						selectedFilter
					);
				}

				const { count: reservationCount, error: reservationError } =
					await reservationQuery;

				if (reservationError) {
					console.error(
						'Error fetching reservations:',
						reservationError
					);
				} else {
					setTotalReservations(reservationCount || 0);
				}

				// Fetch active users (unique profile_ids from reserve table with filter)
				let activeUsersQuery = supabase
					.from('reserve')
					.select('profile_id')
					.not('profile_id', 'is', null);

				if (selectedFilter !== 'all') {
					activeUsersQuery = activeUsersQuery.eq(
						'type',
						selectedFilter
					);
				}

				const { data: activeUsersData, error: activeUsersError } =
					await activeUsersQuery;

				if (activeUsersError) {
					console.error(
						'Error fetching active users:',
						activeUsersError
					);
				} else {
					// Count unique profile_ids
					const uniqueUsers = new Set(
						activeUsersData?.map((item) => item.profile_id) || []
					);
					setActiveUsers(uniqueUsers.size);
				}

				// Fetch submitted reservations (is_submitted = true with filter)
				let submittedQuery = supabase
					.from('reserve')
					.select('*', { count: 'exact', head: true })
					.eq('is_submitted', true);

				if (selectedFilter !== 'all') {
					submittedQuery = submittedQuery.eq('type', selectedFilter);
				}

				const { count: submittedCount, error: submittedError } =
					await submittedQuery;

				if (submittedError) {
					console.error(
						'Error fetching submitted reservations:',
						submittedError
					);
				} else {
					setSubmittedReservations(submittedCount || 0);
				}

				// Fetch approved reservations (status = 'approved' with filter)
				let approvedQuery = supabase
					.from('reserve')
					.select('*', { count: 'exact', head: true })
					.eq('status', 'approved');

				if (selectedFilter !== 'all') {
					approvedQuery = approvedQuery.eq('type', selectedFilter);
				}

				const { count: approvedCount, error: approvedError } =
					await approvedQuery;

				if (approvedError) {
					console.error(
						'Error fetching approved reservations:',
						approvedError
					);
				} else {
					setApprovedReservations(approvedCount || 0);
				}

				// Fetch extra lecture count (always show this)
				const {
					count: extraLectureCountData,
					error: extraLectureError,
				} = await supabase
					.from('reserve')
					.select('*', { count: 'exact', head: true })
					.eq('type', 'extra_lecture');

				if (extraLectureError) {
					console.error(
						'Error fetching extra lecture count:',
						extraLectureError
					);
				} else {
					setExtraLectureCount(extraLectureCountData || 0);
				}

				// Fetch event count (always show this)
				const { count: eventCountData, error: eventError } =
					await supabase
						.from('reserve')
						.select('*', { count: 'exact', head: true })
						.eq('type', 'event');

				if (eventError) {
					console.error('Error fetching event count:', eventError);
				} else {
					setEventCount(eventCountData || 0);
				}
			} catch (error) {
				console.error('Error fetching analytics data:', error);
			} finally {
				setLoading(false);
			}
		};

		fetchAnalyticsData();
	}, [selectedFilter]);

	return (
		<SidebarLayout>
			<div className='flex-1 space-y-4 p-4 pt-6'>
				{/* Header Section */}
				<div className='flex items-center justify-between space-y-2'>
					<div>
						<h2 className='text-3xl font-bold tracking-tight'>
							Analytics Dashboard
						</h2>
						<p className='text-muted-foreground'>
							Comprehensive analytics and insights for hall usage,
							events, and system performance
						</p>
					</div>
					<div className='flex items-center space-x-2'>
						<span className='text-sm text-muted-foreground'>
							{currentDate}
						</span>
					</div>
				</div>

				{/* Filter Section */}
				<div className='flex items-center space-x-4'>
					<span className='text-sm font-medium'>Filter by Type:</span>
					<div className='flex space-x-2'>
						<button
							onClick={() => setSelectedFilter('all')}
							className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
								selectedFilter === 'all'
									? 'bg-primary text-primary-foreground'
									: 'bg-muted text-muted-foreground hover:bg-muted/80'
							}`}
						>
							All
						</button>
						<button
							onClick={() => setSelectedFilter('extra_lecture')}
							className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
								selectedFilter === 'extra_lecture'
									? 'bg-primary text-primary-foreground'
									: 'bg-muted text-muted-foreground hover:bg-muted/80'
							}`}
						>
							Extra Lectures
						</button>
						<button
							onClick={() => setSelectedFilter('event')}
							className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
								selectedFilter === 'event'
									? 'bg-primary text-primary-foreground'
									: 'bg-muted text-muted-foreground hover:bg-muted/80'
							}`}
						>
							Events
						</button>
					</div>
				</div>

				{/* Analytics Cards */}
				<div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
					{/* Total Reservations Card */}
					<div className='rounded-lg border bg-card text-card-foreground shadow-sm p-6'>
						<div className='text-sm font-medium text-muted-foreground'>
							{selectedFilter === 'all'
								? 'Total Reservations'
								: selectedFilter === 'extra_lecture'
									? 'Extra Lectures'
									: 'Events'}
						</div>
						<div className='text-2xl font-bold'>
							{loading ? (
								<div className='animate-pulse bg-gray-200 h-8 w-16 rounded'></div>
							) : (
								totalReservations
							)}
						</div>
					</div>

					{/* Active Users Card */}
					<div className='rounded-lg border bg-card text-card-foreground shadow-sm p-6'>
						<div className='text-sm font-medium text-muted-foreground'>
							Active Users
						</div>
						<div className='text-2xl font-bold'>
							{loading ? (
								<div className='animate-pulse bg-gray-200 h-8 w-16 rounded'></div>
							) : (
								activeUsers
							)}
						</div>
					</div>

					{/* Submitted Reservations Card */}
					<div className='rounded-lg border bg-card text-card-foreground shadow-sm p-6'>
						<div className='text-sm font-medium text-muted-foreground'>
							Submitted Reservations
						</div>
						<div className='text-2xl font-bold'>
							{loading ? (
								<div className='animate-pulse bg-gray-200 h-8 w-16 rounded'></div>
							) : (
								submittedReservations
							)}
						</div>
					</div>

					{/* Approved Reservations Card */}
					<div className='rounded-lg border bg-card text-card-foreground shadow-sm p-6'>
						<div className='text-sm font-medium text-muted-foreground'>
							Approved Reservations
						</div>
						<div className='text-2xl font-bold'>
							{loading ? (
								<div className='animate-pulse bg-gray-200 h-8 w-16 rounded'></div>
							) : (
								approvedReservations
							)}
						</div>
					</div>

					{/* Extra Lectures Card */}
					<div className='rounded-lg border bg-card text-card-foreground shadow-sm p-6'>
						<div className='text-sm font-medium text-muted-foreground'>
							Extra Lectures
						</div>
						<div className='text-2xl font-bold'>
							{loading ? (
								<div className='animate-pulse bg-gray-200 h-8 w-16 rounded'></div>
							) : (
								extraLectureCount
							)}
						</div>
					</div>

					{/* Events Card */}
					<div className='rounded-lg border bg-card text-card-foreground shadow-sm p-6'>
						<div className='text-sm font-medium text-muted-foreground'>
							Events
						</div>
						<div className='text-2xl font-bold'>
							{loading ? (
								<div className='animate-pulse bg-gray-200 h-8 w-16 rounded'></div>
							) : (
								eventCount
							)}
						</div>
					</div>
				</div>
			</div>
		</SidebarLayout>
	);
}

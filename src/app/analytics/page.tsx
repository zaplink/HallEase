'use client';

import SidebarLayout from '@/layouts/Sidebar/Layout';
import { supabase } from '@/lib/supabaseClient';
import { useEffect, useState } from 'react';

export default function AnalyticsPage() {
	const [totalReservations, setTotalReservations] = useState<number | null>(
		null
	);
	const [activeUsers, setActiveUsers] = useState<number | null>(null);
	const [loading, setLoading] = useState(true);

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
				// Fetch total reservations count
				const { count: reservationCount, error: reservationError } =
					await supabase
						.from('reserve')
						.select('*', { count: 'exact', head: true });

				if (reservationError) {
					console.error(
						'Error fetching reservations:',
						reservationError
					);
				} else {
					setTotalReservations(reservationCount || 0);
				}

				// Fetch active users (unique profile_ids from reserve table)
				const { data: activeUsersData, error: activeUsersError } =
					await supabase
						.from('reserve')
						.select('profile_id')
						.not('profile_id', 'is', null);

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
			} catch (error) {
				console.error('Error fetching analytics data:', error);
			} finally {
				setLoading(false);
			}
		};

		fetchAnalyticsData();
	}, []);

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

				{/* Analytics Cards */}
				<div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
					{/* Total Reservations Card */}
					<div className='rounded-lg border bg-card text-card-foreground shadow-sm p-6'>
						<div className='text-sm font-medium text-muted-foreground'>
							Total Reservations
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
				</div>
			</div>
		</SidebarLayout>
	);
}

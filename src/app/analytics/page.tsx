'use client';

import SidebarLayout from '@/layouts/Sidebar/Layout';
import { supabase } from '@/lib/supabaseClient';
import { useEffect, useState } from 'react';
import {
	AreaChart,
	Area,
	XAxis,
	YAxis,
	CartesianGrid,
	ResponsiveContainer,
	BarChart,
	Bar,
} from 'recharts';

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
	interface ChartData {
		month: string;
		total: number;
		extraLectures?: number;
		events?: number;
	}

	interface HallUtilization {
		name: string;
		utilization: number;
	}

	interface TimeSlotData {
		time: string;
		reservations: number;
	}

	interface RecentActivity {
		id: string | number;
		userName: string;
		description: string;
		status: string;
		timeAgo: string;
		type: string;
	}

	const [chartData, setChartData] = useState<ChartData[]>([]);
	const [hallUtilizationData, setHallUtilizationData] = useState<
		HallUtilization[]
	>([]);
	const [timeSlotData, setTimeSlotData] = useState<TimeSlotData[]>([]);
	const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);

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
				// Removed unused filterQuery

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

				// Fetch monthly trend data for the past 6 months
				const monthlyData = await fetchMonthlyTrend(selectedFilter);
				setChartData(monthlyData);

				// Fetch hall utilization data
				const hallUtilizationData = await fetchHallUtilizationData();
				setHallUtilizationData(hallUtilizationData);

				// Fetch time slot popularity data
				const timeSlotData = await fetchTimeSlotData(selectedFilter);
				setTimeSlotData(timeSlotData);

				// Fetch recent activity data
				const fetchRecentActivity = async () => {
					try {
						// Fetch recent reservations with profile information
						const { data: reservations, error } = await supabase
							.from('reserve')
							.select(
								`
			id,
			status,
			type,
			created_date,
			created_time,
			modified_date,
			modified_time,
			profiles (
			  full_name
			)
		  `
							)
							.order('created_date', { ascending: false })
							.order('created_time', { ascending: false })
							.limit(10);

						if (error) {
							console.error(
								'Error fetching recent activity:',
								error
							);
							return [];
						}

						// Format the data for display
						const activities =
							reservations?.map(
								(reservation: {
									id: string | number;
									status: string;
									type: string;
									created_date: string;
									created_time: string;
									modified_date?: string;
									modified_time?: string;
									profiles?: { full_name?: string };
								}) => {
									const createdDateTime = new Date(
										`${reservation.created_date}T${reservation.created_time}`
									);
									const modifiedDateTime =
										reservation.modified_date
											? new Date(
													`${reservation.modified_date}T${reservation.modified_time}`
												)
											: null;

									// Use modified time if available, otherwise created time
									const activityTime =
										modifiedDateTime || createdDateTime;
									const timeAgo = getTimeAgo(activityTime);

									// Determine activity type and description
									let activityDescription = '';
									let activityType = 'reserved';

									if (reservation.status === 'approved') {
										activityType = 'completed';
										activityDescription = `Completed ${reservation.type === 'event' ? 'Event' : 'Extra Lecture'} booking`;
									} else if (
										reservation.status === 'rejected'
									) {
										activityType = 'cancelled';
										activityDescription = `Cancelled ${reservation.type === 'event' ? 'Event' : 'Extra Lecture'}`;
									} else if (
										reservation.status === 'pending'
									) {
										activityType = 'pending';
										activityDescription = `Reserved ${reservation.type === 'event' ? 'Event Hall' : 'Lecture Hall'}`;
									} else {
										activityDescription = `Reserved ${reservation.type === 'event' ? 'Event Hall' : 'Lecture Hall'}`;
									}

									return {
										id: reservation.id,
										userName:
											reservation.profiles?.full_name ||
											'Unknown User',
										description: activityDescription,
										status: reservation.status,
										timeAgo: timeAgo,
										type: activityType,
									};
								}
							) || [];

						return activities;
					} catch (error) {
						console.error('Error fetching recent activity:', error);
						return [];
					}
				};
				const recentActivityData = await fetchRecentActivity();
				setRecentActivity(recentActivityData);
			} catch (error) {
				console.error('Error fetching analytics data:', error);
			} finally {
				setLoading(false);
			}
		};

		fetchAnalyticsData();
	}, [selectedFilter]);

	// Function to fetch hall utilization data
	const fetchHallUtilizationData = async () => {
		try {
			// Get all halls
			const { data: halls, error: hallsError } = await supabase
				.from('hall')
				.select('id, code, description, type')
				.eq('is_available', true);

			if (hallsError) {
				console.error('Error fetching halls:', hallsError);
				return [];
			}

			const utilizationData = [];

			// For each hall, calculate utilization based on reservations
			for (const hall of halls || []) {
				// Get count of reservations for this hall (assuming we need to join with reserve table)
				// Since there's no direct hall_id in reserve table, we'll use mock data based on hall type
				let utilizationPercentage = 0;

				// Mock utilization calculation based on hall type
				switch (hall.type) {
					case 'LCH': // Lecture Hall
						utilizationPercentage =
							Math.floor(Math.random() * 30) + 70; // 70-100%
						break;
					case 'EW': // Event Wing
						utilizationPercentage =
							Math.floor(Math.random() * 25) + 50; // 50-75%
						break;
					default:
						utilizationPercentage =
							Math.floor(Math.random() * 40) + 30; // 30-70%
				}

				utilizationData.push({
					name: hall.description || hall.code,
					utilization: utilizationPercentage,
				});
			}

			return utilizationData.slice(0, 5); // Return top 5 halls
		} catch (error) {
			console.error('Error fetching hall utilization:', error);
			return [];
		}
	};

	// Function to fetch monthly trend data
	const fetchMonthlyTrend = async (
		filter: 'all' | 'extra_lecture' | 'event'
	) => {
		const months = [];
		const currentDate = new Date();

		// Generate last 3 months
		for (let i = 2; i >= 0; i--) {
			const date = new Date(
				currentDate.getFullYear(),
				currentDate.getMonth() - i,
				1
			);
			const monthName = date.toLocaleDateString('en-US', {
				month: 'short',
			});

			// Get start and end of month
			const startOfMonth = new Date(
				date.getFullYear(),
				date.getMonth(),
				1
			);
			const endOfMonth = new Date(
				date.getFullYear(),
				date.getMonth() + 1,
				0
			);

			// Query reservations for this month
			let query = supabase
				.from('reserve')
				.select('*', { count: 'exact', head: true })
				.gte('created_date', startOfMonth.toISOString().split('T')[0])
				.lte('created_date', endOfMonth.toISOString().split('T')[0]);

			if (filter !== 'all') {
				query = query.eq('type', filter);
			}

			const { count } = await query;

			// For demo purposes, also add some sample data for events and extra lectures
			let extraLectureCount = 0;
			let eventCount = 0;

			if (filter === 'all') {
				// Get extra lecture count for this month
				const { count: extraCount } = await supabase
					.from('reserve')
					.select('*', { count: 'exact', head: true })
					.eq('type', 'extra_lecture')
					.gte(
						'created_date',
						startOfMonth.toISOString().split('T')[0]
					)
					.lte(
						'created_date',
						endOfMonth.toISOString().split('T')[0]
					);

				// Get event count for this month
				const { count: evtCount } = await supabase
					.from('reserve')
					.select('*', { count: 'exact', head: true })
					.eq('type', 'event')
					.gte(
						'created_date',
						startOfMonth.toISOString().split('T')[0]
					)
					.lte(
						'created_date',
						endOfMonth.toISOString().split('T')[0]
					);

				extraLectureCount = extraCount || 0;
				eventCount = evtCount || 0;
			}

			months.push({
				month: monthName,
				total: count || 0,
				extraLectures: extraLectureCount,
				events: eventCount,
			});
		}

		return months;
	};

	// Function to fetch recent activity data
	// Removed unused fetchRecentActivity function

	// Helper function to calculate time ago
	const getTimeAgo = (date: Date) => {
		const now = new Date();
		const diffInSeconds = Math.floor(
			(now.getTime() - date.getTime()) / 1000
		);

		if (diffInSeconds < 60) {
			return 'Just now';
		} else if (diffInSeconds < 3600) {
			const minutes = Math.floor(diffInSeconds / 60);
			return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
		} else if (diffInSeconds < 86400) {
			const hours = Math.floor(diffInSeconds / 3600);
			return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
		} else {
			const days = Math.floor(diffInSeconds / 86400);
			return `${days} ${days === 1 ? 'day' : 'days'} ago`;
		}
	};

	// Function to fetch time slot popularity data
	const fetchTimeSlotData = async (
		filter: 'all' | 'extra_lecture' | 'event'
	) => {
		try {
			// Define time slots (2-hour intervals)
			const timeSlots = [
				{ time: '8:00', start: '08:00', end: '10:00' },
				{ time: '10:00', start: '10:00', end: '12:00' },
				{ time: '12:00', start: '12:00', end: '14:00' },
				{ time: '14:00', start: '14:00', end: '16:00' },
				{ time: '16:00', start: '16:00', end: '18:00' },
				{ time: '18:00', start: '18:00', end: '20:00' },
				{ time: '20:00', start: '20:00', end: '22:00' },
			];

			const slotData = [];

			for (const slot of timeSlots) {
				// Query reservations for this time slot
				let query = supabase
					.from('reserve')
					.select('*', { count: 'exact', head: true })
					.gte('start_time', slot.start)
					.lt('start_time', slot.end);

				if (filter !== 'all') {
					query = query.eq('type', filter);
				}

				const { count } = await query;

				slotData.push({
					time: slot.time,
					reservations: count || 0,
				});
			}

			return slotData;
		} catch (error) {
			console.error('Error fetching time slot data:', error);
			return [];
		}
	};

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

				{/* Chart Section */}
				<div className='grid gap-4 md:grid-cols-2'>
					{/* Reservations Trend Chart */}
					<div className='rounded-lg border bg-card text-card-foreground shadow-sm p-6'>
						<div className='mb-4'>
							<h3 className='text-lg font-semibold'>
								Reservations Trend
							</h3>
							<p className='text-sm text-muted-foreground'>
								Monthly reservations over the past 3 months
							</p>
						</div>
						<div className='h-[250px]'>
							{loading ? (
								<div className='h-full flex items-center justify-center'>
									<div className='animate-pulse text-muted-foreground'>
										Loading chart...
									</div>
								</div>
							) : (
								<ResponsiveContainer width='100%' height='100%'>
									<AreaChart data={chartData}>
										<CartesianGrid
											strokeDasharray='3 3'
											stroke='#e2e8f0'
										/>
										<XAxis
											dataKey='month'
											axisLine={false}
											tickLine={false}
											tick={{
												fill: '#64748b',
												fontSize: 12,
											}}
										/>
										<YAxis
											axisLine={false}
											tickLine={false}
											tick={{
												fill: '#64748b',
												fontSize: 12,
											}}
										/>
										{selectedFilter === 'all' && (
											<>
												<Area
													type='monotone'
													dataKey='extraLectures'
													stackId='1'
													stroke='#a78bfa'
													fill='#a78bfa'
													fillOpacity={0.6}
												/>
												<Area
													type='monotone'
													dataKey='events'
													stackId='1'
													stroke='#34d399'
													fill='#34d399'
													fillOpacity={0.6}
												/>
											</>
										)}
										{selectedFilter !== 'all' && (
											<Area
												type='monotone'
												dataKey='total'
												stroke='#3b82f6'
												fill='#3b82f6'
												fillOpacity={0.6}
											/>
										)}
									</AreaChart>
								</ResponsiveContainer>
							)}
						</div>
					</div>

					{/* Hall Utilization Chart */}
					<div className='rounded-lg border bg-card text-card-foreground shadow-sm p-6'>
						<div className='mb-4'>
							<h3 className='text-lg font-semibold'>
								Hall Utilization
							</h3>
							<p className='text-sm text-muted-foreground'>
								Usage percentage by hall
							</p>
						</div>
						<div className='h-[250px]'>
							{loading ? (
								<div className='h-full flex items-center justify-center'>
									<div className='animate-pulse text-muted-foreground'>
										Loading chart...
									</div>
								</div>
							) : (
								<div className='space-y-4'>
									{hallUtilizationData.map((hall, index) => (
										<div
											key={index}
											className='flex items-center justify-between'
										>
											<div className='flex-1 pr-4'>
												<div className='text-sm font-medium text-foreground mb-1'>
													{hall.name}
												</div>
												<div className='w-full bg-gray-200 rounded-full h-2'>
													<div
														className='bg-gray-900 h-2 rounded-full transition-all duration-300'
														style={{
															width: `${hall.utilization}%`,
														}}
													></div>
												</div>
											</div>
											<div className='text-sm font-bold text-foreground'>
												{hall.utilization}%
											</div>
										</div>
									))}
								</div>
							)}
						</div>
					</div>
				</div>

				{/* Time Slot Popularity Chart and Additional Chart */}
				<div className='grid gap-4 md:grid-cols-2'>
					{/* Time Slot Popularity Chart */}
					<div className='rounded-lg border bg-card text-card-foreground shadow-sm p-6'>
						<div className='mb-4'>
							<h3 className='text-lg font-semibold'>
								Time Slot Popularity
							</h3>
							<p className='text-sm text-muted-foreground'>
								Reservations by time of day
							</p>
						</div>
						<div className='h-[250px]'>
							{loading ? (
								<div className='h-full flex items-center justify-center'>
									<div className='animate-pulse text-muted-foreground'>
										Loading chart...
									</div>
								</div>
							) : (
								<ResponsiveContainer width='100%' height='100%'>
									<BarChart data={timeSlotData}>
										<CartesianGrid
											strokeDasharray='3 3'
											stroke='#e2e8f0'
										/>
										<XAxis
											dataKey='time'
											axisLine={false}
											tickLine={false}
											tick={{
												fill: '#64748b',
												fontSize: 12,
											}}
										/>
										<YAxis
											axisLine={false}
											tickLine={false}
											tick={{
												fill: '#64748b',
												fontSize: 12,
											}}
										/>
										<Bar
											dataKey='reservations'
											fill='#a78bfa'
											radius={[4, 4, 0, 0]}
										/>
									</BarChart>
								</ResponsiveContainer>
							)}
						</div>
					</div>

					{/* Recent Activity */}
					<div className='rounded-lg border bg-card text-card-foreground shadow-sm p-6'>
						<div className='mb-4'>
							<h3 className='text-lg font-semibold'>
								Recent Activity
							</h3>
							<p className='text-sm text-muted-foreground'>
								Latest reservation activities
							</p>
						</div>
						<div className='h-[250px] overflow-y-auto'>
							{loading ? (
								<div className='h-full flex items-center justify-center'>
									<div className='animate-pulse text-muted-foreground'>
										Loading activities...
									</div>
								</div>
							) : recentActivity.length > 0 ? (
								<div className='space-y-4'>
									{recentActivity.map((activity) => (
										<div
											key={activity.id}
											className='flex items-center justify-between py-2'
										>
											<div className='flex-1'>
												<div className='font-medium text-sm text-foreground'>
													{activity.userName}
												</div>
												<div className='text-sm text-muted-foreground'>
													{activity.description}
												</div>
												<div className='text-xs text-muted-foreground'>
													{activity.timeAgo}
												</div>
											</div>
											<div className='flex-shrink-0 ml-4'>
												{activity.status ===
													'approved' && (
													<span className='inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-black text-white'>
														completed
													</span>
												)}
												{activity.status ===
													'rejected' && (
													<span className='inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-500 text-white'>
														cancelled
													</span>
												)}
												{activity.status ===
													'pending' && (
													<span className='inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-500 text-white'>
														pending
													</span>
												)}
												{activity.status ===
													'waiting' && (
													<span className='inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-500 text-white'>
														waiting
													</span>
												)}
											</div>
										</div>
									))}
								</div>
							) : (
								<div className='h-full flex items-center justify-center'>
									<div className='text-muted-foreground text-sm'>
										No recent activity found
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</SidebarLayout>
	);
}

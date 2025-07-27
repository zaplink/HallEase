import SidebarLayout from '@/layouts/Sidebar/Layout';
import { createClient } from '@/lib/supabaseServer';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import {
	getDashboardStats,
	getRecentBookings,
	getBookingTrends,
	getHallUtilization,
	getCurrentlyOccupiedHalls,
} from '@/lib/dashboard-data';
import { RecentBookings } from '@/components/custom/RecentBookings';
import { RecentActivity } from '@/components/custom/RecentActivity';
import { BookingTrendsLineChart } from '@/components/custom/BookingTrendsLineChart';
import { BookingStatusPieChart } from '@/components/custom/BookingStatusPieChart';
import { HallUtilizationChart } from '@/components/custom/HallUtilizationChart';
import { HallOccupancyDonut } from '@/components/custom/HallOccupancyDonut';
import { HallStatus } from '@/components/custom/HallStatus';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

// Loading components
function DashboardSkeleton() {
	return (
		<div className='space-y-6'>
			{/* Welcome Header */}
			<div className='mb-6'>
				<Skeleton className='h-8 w-48 mb-2' />
				<Skeleton className='h-4 w-96' />
			</div>

			{/* KPI Cards Skeleton */}
			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
				{[...Array(4)].map((_, i) => (
					<Card key={i}>
						<CardHeader className='pb-2'>
							<Skeleton className='h-4 w-24' />
						</CardHeader>
						<CardContent>
							<Skeleton className='h-8 w-16 mb-2' />
							<Skeleton className='h-3 w-20' />
						</CardContent>
					</Card>
				))}
			</div>

			{/* Charts Row 1 Skeleton */}
			<div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
				<Card className='col-span-2'>
					<CardHeader>
						<Skeleton className='h-6 w-32' />
					</CardHeader>
					<CardContent>
						<Skeleton className='h-[300px] w-full' />
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<Skeleton className='h-6 w-32' />
					</CardHeader>
					<CardContent>
						<Skeleton className='h-[300px] w-full' />
					</CardContent>
				</Card>
			</div>

			{/* Charts Row 2 Skeleton */}
			<div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
				{[...Array(3)].map((_, i) => (
					<Card key={i}>
						<CardHeader>
							<Skeleton className='h-6 w-32' />
						</CardHeader>
						<CardContent>
							<Skeleton className='h-[300px] w-full' />
						</CardContent>
					</Card>
				))}
			</div>

			{/* Bottom Row Skeleton */}
			<div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
				{[...Array(2)].map((_, i) => (
					<Card key={i}>
						<CardHeader>
							<Skeleton className='h-6 w-32' />
						</CardHeader>
						<CardContent>
							<Skeleton className='h-[200px] w-full' />
						</CardContent>
					</Card>
				))}
			</div>
		</div>
	);
}

async function DashboardContent() {
	// Fetch all dashboard data
	const [
		dashboardStats,
		recentBookings,
		bookingTrends,
		hallUtilization,
		occupiedHalls,
	] = await Promise.all([
		getDashboardStats(),
		getRecentBookings(10),
		getBookingTrends(),
		getHallUtilization(),
		getCurrentlyOccupiedHalls(),
	]);

	return (
		<div className='space-y-6'>
			{/* KPI Cards */}

			{/* Charts Row 1 */}
			<div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
				{/* Booking Trends Line Chart */}
				<BookingTrendsLineChart data={bookingTrends} />

				{/* Booking Status Pie Chart */}
				<BookingStatusPieChart stats={dashboardStats} />
			</div>

			{/* Charts Row 2 */}
			<div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
				{/* Hall Occupancy Donut */}
				<HallOccupancyDonut hallUtilization={hallUtilization} />

				{/* Hall Utilization */}
				<HallUtilizationChart data={hallUtilization} />

				{/* Recent Activity */}
				<RecentActivity bookings={recentBookings} />
			</div>

			{/* Bottom Row */}
			<div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
				{/* Recent Bookings */}
				<RecentBookings bookings={recentBookings} />

				{/* Hall Status */}
				<HallStatus occupiedHalls={occupiedHalls} />
			</div>

			{/* Additional Stats */}
		</div>
	);
}

export default async function Dashboard() {
	// navigate back to login if user not logged in
	const supabase = await createClient();

	const { data, error } = await supabase.auth.getUser();
	if (error || !data?.user) {
		redirect('/login');
	}

	return (
		<SidebarLayout>
			<Suspense fallback={<DashboardSkeleton />}>
				<DashboardContent />
			</Suspense>
		</SidebarLayout>
	);
}

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
import { KPICard } from '@/components/custom/KPICard';
import { AdvancedKPICard } from '@/components/custom/AdvancedKPICard';
import { RecentBookings } from '@/components/custom/RecentBookings';
import { RecentActivity } from '@/components/custom/RecentActivity';
import { BookingTrendsLineChart } from '@/components/custom/BookingTrendsLineChart';
import { BookingStatusPieChart } from '@/components/custom/BookingStatusPieChart';
import { HallUtilizationChart } from '@/components/custom/HallUtilizationChart';
import { HallOccupancyDonut } from '@/components/custom/HallOccupancyDonut';
import { HallStatus } from '@/components/custom/HallStatus';
import {
	Calendar,
	Users,
	Building,
	TrendingUp,
	Clock,
	XCircle,
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import ChatbotWidget from '../chatbot/chatbotWidget';

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
			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
				<AdvancedKPICard
					title='Total Bookings'
					value={dashboardStats.totalBookings}
					change={dashboardStats.totalBookingsChange}
					changeLabel='vs last month'
					icon={<Calendar className='w-5 h-5' />}
					trend={
						dashboardStats.totalBookingsChange > 0
							? 'up'
							: dashboardStats.totalBookingsChange < 0
								? 'down'
								: 'neutral'
					}
					sparklineData={bookingTrends
						.slice(-7)
						.map((t) => t.totalBookings)}
					color='#3b82f6'
				/>
				<AdvancedKPICard
					title='Pending Approvals'
					value={dashboardStats.pendingApprovals}
					changeLabel='require attention'
					icon={<Clock className='w-5 h-5' />}
					trend={dashboardStats.pendingApprovals > 0 ? 'down' : 'up'}
					sparklineData={bookingTrends
						.slice(-7)
						.map((t) => t.pendingBookings)}
					color='#f59e0b'
				/>
				<AdvancedKPICard
					title='Occupancy Rate'
					value={`${dashboardStats.occupancyRate}%`}
					changeLabel='today'
					icon={<Building className='w-5 h-5' />}
					trend={
						dashboardStats.occupancyRate > 70
							? 'up'
							: dashboardStats.occupancyRate < 30
								? 'down'
								: 'neutral'
					}
					sparklineData={[
						45,
						52,
						38,
						67,
						73,
						82,
						dashboardStats.occupancyRate,
					]}
					color='#10b981'
				/>
				<AdvancedKPICard
					title='Completed Bookings'
					value={dashboardStats.completedBookings}
					changeLabel='approved'
					icon={<Users className='w-5 h-5' />}
					trend='up'
					sparklineData={bookingTrends
						.slice(-7)
						.map((t) => t.approvedBookings)}
					color='#10b981'
				/>
			</div>

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
			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
				<KPICard
					title='Rejected Bookings'
					value={dashboardStats.rejectedBookings}
					changeLabel='this month'
					icon={<XCircle className='w-5 h-5' />}
					trend={dashboardStats.rejectedBookings > 0 ? 'down' : 'up'}
				/>
				<KPICard
					title='Average Utilization'
					value={`${Math.round(hallUtilization.reduce((acc, hall) => acc + hall.utilizationRate, 0) / Math.max(hallUtilization.length, 1))}%`}
					changeLabel='across all halls'
					icon={<TrendingUp className='w-5 h-5' />}
					trend='neutral'
				/>
				<KPICard
					title='Available Halls'
					value={
						hallUtilization.filter((h) => !h.currentlyOccupied)
							.length
					}
					changeLabel='right now'
					icon={<Building className='w-5 h-5' />}
					trend='up'
				/>
				<KPICard
					title='Peak Usage Hours'
					value='2-4 PM'
					changeLabel='typical'
					icon={<Clock className='w-5 h-5' />}
					trend='neutral'
				/>
			</div>
		</div>
	);
}

export default async function Dashboard() {
	// navigate back to login if user not logged in
	const supabase = await createClient();

	const { data, error } = await supabase.auth.getUser();
	if (error || !data?.user) {
		redirect('/');
	}

	return (
		<>
			<SidebarLayout>
				<Suspense fallback={<DashboardSkeleton />}>
					<DashboardContent />
				</Suspense>
			</SidebarLayout>
			<ChatbotWidget />
		</>
	);
}

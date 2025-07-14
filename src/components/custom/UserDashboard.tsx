'use client';

import { RecentBookings } from '@/components/custom/RecentBookings';
import { RecentActivity } from '@/components/custom/RecentActivity';
import { BookingTrendsLineChart } from '@/components/custom/BookingTrendsLineChart';
import { BookingStatusPieChart } from '@/components/custom/BookingStatusPieChart';
import { HallUtilizationChart } from '@/components/custom/HallUtilizationChart';
import { HallOccupancyDonut } from '@/components/custom/HallOccupancyDonut';
import { HallStatus } from '@/components/custom/HallStatus';
import { RoleIndicator } from './RoleIndicator';
import type {
	DashboardStats,
	RecentBooking,
	BookingTrend,
	HallUtilization,
} from '@/lib/dashboard-data';

interface OccupiedHall {
	hallCode: string;
	building: string;
	eventName: string;
	bookedBy: string;
	endTime: string;
}

interface UserDashboardProps {
	dashboardStats: DashboardStats;
	recentBookings: RecentBooking[];
	bookingTrends: BookingTrend[];
	hallUtilization: HallUtilization[];
	occupiedHalls: OccupiedHall[];
}

export function UserDashboard({
	dashboardStats,
	recentBookings,
	bookingTrends,
	hallUtilization,
	occupiedHalls,
}: UserDashboardProps) {
	return (
		<div className='space-y-6'>
			{/* Role Indicator */}
			<RoleIndicator />

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
		</div>
	);
}

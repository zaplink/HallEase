import { createClient } from '@/lib/supabaseServer';

export interface DashboardStats {
	totalBookings: number;
	pendingApprovals: number;
	occupancyRate: number;
	completedBookings: number;
	rejectedBookings: number;
	totalBookingsChange: number;
	pendingApprovalsChange: number;
}

export interface RecentBooking {
	id: string;
	name: string;
	type: 'event' | 'extra_lecture';
	bookedBy: string;
	date: string;
	startTime: string;
	endTime: string;
	status: string;
	createdDate: string;
	hallCode?: string;
}

export interface HallUtilization {
	hallCode: string;
	building: string;
	totalBookings: number;
	capacity: number;
	utilizationRate: number;
	currentlyOccupied: boolean;
}

export interface BookingTrend {
	month: string;
	year: number;
	totalBookings: number;
	approvedBookings: number;
	pendingBookings: number;
	rejectedBookings: number;
}

export async function getDashboardStats(): Promise<DashboardStats> {
	const supabase = await createClient();

	// Get current month stats
	const currentMonth = new Date().getMonth() + 1;
	const currentYear = new Date().getFullYear();
	const lastMonth = currentMonth === 1 ? 12 : currentMonth - 1;
	const lastMonthYear = currentMonth === 1 ? currentYear - 1 : currentYear;

	// Total bookings this month
	const { data: currentMonthBookings } = await supabase
		.from('reserve')
		.select('*')
		.eq('is_submitted', true)
		.gte(
			'created_date',
			`${currentYear}-${currentMonth.toString().padStart(2, '0')}-01`
		)
		.lt(
			'created_date',
			`${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-01`
		);

	// Last month bookings for comparison
	const { data: lastMonthBookings } = await supabase
		.from('reserve')
		.select('*')
		.eq('is_submitted', true)
		.gte(
			'created_date',
			`${lastMonthYear}-${lastMonth.toString().padStart(2, '0')}-01`
		)
		.lt(
			'created_date',
			`${lastMonthYear}-${currentMonth.toString().padStart(2, '0')}-01`
		);

	// Pending approvals
	const { data: pendingBookings } = await supabase
		.from('reserve')
		.select('*')
		.eq('status', 'pending')
		.eq('is_submitted', true);

	// Approved bookings
	const { data: approvedBookings } = await supabase
		.from('reserve')
		.select('*')
		.eq('status', 'approved')
		.eq('is_submitted', true);

	// Rejected bookings
	const { data: rejectedBookings } = await supabase
		.from('reserve')
		.select('*')
		.eq('status', 'rejected')
		.eq('is_submitted', true);

	// Calculate changes
	const totalBookingsChange = lastMonthBookings?.length
		? Math.round(
				(((currentMonthBookings?.length || 0) -
					lastMonthBookings.length) /
					lastMonthBookings.length) *
					100
			)
		: 0;

	// Calculate occupancy rate (simplified - based on today's bookings)
	const today = new Date().toISOString().split('T')[0];
	const { data: todayBookings } = await supabase
		.from('reserve')
		.select('*')
		.eq('date', today)
		.eq('status', 'approved');

	const { data: totalHalls } = await supabase
		.from('hall')
		.select('*')
		.eq('is_available', true);

	const occupancyRate = totalHalls?.length
		? Math.round(((todayBookings?.length || 0) / totalHalls.length) * 100)
		: 0;

	return {
		totalBookings: currentMonthBookings?.length || 0,
		pendingApprovals: pendingBookings?.length || 0,
		occupancyRate,
		completedBookings: approvedBookings?.length || 0,
		rejectedBookings: rejectedBookings?.length || 0,
		totalBookingsChange,
		pendingApprovalsChange: 0, // We can calculate this later if needed
	};
}

export async function getRecentBookings(
	limit: number = 10
): Promise<RecentBooking[]> {
	const supabase = await createClient();

	// Get recent bookings with profile and hall information
	const { data: bookings, error } = await supabase
		.from('reserve')
		.select(
			`
      *,
      profiles!reserve_profile_id_fkey (
        full_name
      ),
      event (*),
      extra_lecture (*)
    `
		)
		.eq('is_submitted', true)
		.order('created_date', { ascending: false })
		.order('created_time', { ascending: false })
		.limit(limit);

	if (error || !bookings) {
		console.error('Error fetching recent bookings:', error);
		return [];
	}

	return bookings.map((booking) => ({
		id: booking.id,
		name:
			booking.event?.[0]?.name ||
			`${booking.extra_lecture?.[0]?.course_id || 'Course'} - ${booking.extra_lecture?.[0]?.type || 'Lecture'}`,
		type: booking.type as 'event' | 'extra_lecture',
		bookedBy: booking.profiles?.full_name || 'Unknown',
		date: booking.date,
		startTime: booking.start_time,
		endTime: booking.end_time,
		status: booking.status,
		createdDate: booking.created_date,
		hallCode: 'TBD', // We can join with hall table if needed
	}));
}

export async function getHallUtilization(): Promise<HallUtilization[]> {
	const supabase = await createClient();

	// Get all halls with booking counts
	const { data: halls, error } = await supabase.from('hall').select('*');

	if (error || !halls) {
		console.error('Error fetching halls:', error);
		return [];
	}

	// For each hall, get booking count (simplified version)
	const hallUtilization = await Promise.all(
		halls.map(async (hall) => {
			const { data: bookings } = await supabase
				.from('reserve')
				.select('*')
				.eq('status', 'approved')
				.eq('is_submitted', true);

			// Check if currently occupied (today's bookings)
			const today = new Date().toISOString().split('T')[0];
			const currentTime = new Date().toTimeString().slice(0, 5);

			const { data: currentBookings } = await supabase
				.from('reserve')
				.select('*')
				.eq('date', today)
				.eq('status', 'approved')
				.lte('start_time', currentTime)
				.gte('end_time', currentTime);

			return {
				hallCode: hall.code,
				building: hall.building,
				totalBookings: bookings?.length || 0,
				capacity: hall.capacity,
				utilizationRate: hall.capacity
					? Math.round(
							((bookings?.length || 0) / hall.capacity) * 100
						)
					: 0,
				currentlyOccupied: (currentBookings?.length || 0) > 0,
			};
		})
	);

	return hallUtilization;
}

export async function getBookingTrends(): Promise<BookingTrend[]> {
	const supabase = await createClient();

	// Get last 12 months of booking data
	const trends: BookingTrend[] = [];
	const currentDate = new Date();

	for (let i = 11; i >= 0; i--) {
		const date = new Date(
			currentDate.getFullYear(),
			currentDate.getMonth() - i,
			1
		);
		const year = date.getFullYear();
		const month = date.getMonth() + 1;
		const monthName = date.toLocaleString('default', { month: 'long' });

		const nextMonth = new Date(year, month, 1);
		const startDate = `${year}-${month.toString().padStart(2, '0')}-01`;
		const endDate = `${nextMonth.getFullYear()}-${(nextMonth.getMonth() + 1).toString().padStart(2, '0')}-01`;

		const { data: allBookings, error } = await supabase
			.from('reserve')
			.select('*')
			.eq('is_submitted', true)
			.gte('created_date', startDate)
			.lt('created_date', endDate);

		if (error) {
			console.error('Error fetching booking trends:', error);
			continue;
		}

		const approvedCount =
			allBookings?.filter((b) => b.status === 'approved').length || 0;
		const pendingCount =
			allBookings?.filter((b) => b.status === 'pending').length || 0;
		const rejectedCount =
			allBookings?.filter((b) => b.status === 'rejected').length || 0;

		trends.push({
			month: monthName,
			year,
			totalBookings: allBookings?.length || 0,
			approvedBookings: approvedCount,
			pendingBookings: pendingCount,
			rejectedBookings: rejectedCount,
		});
	}

	return trends;
}

export async function getCurrentlyOccupiedHalls(): Promise<
	Array<{
		hallCode: string;
		building: string;
		eventName: string;
		bookedBy: string;
		endTime: string;
	}>
> {
	const supabase = await createClient();

	const today = new Date().toISOString().split('T')[0];
	const currentTime = new Date().toTimeString().slice(0, 5);

	const { data: currentBookings, error } = await supabase
		.from('reserve')
		.select(
			`
      *,
      profiles!reserve_profile_id_fkey (
        full_name
      ),
      event (*),
      extra_lecture (*)
    `
		)
		.eq('date', today)
		.eq('status', 'approved')
		.lte('start_time', currentTime)
		.gte('end_time', currentTime);

	if (error || !currentBookings) {
		console.error('Error fetching currently occupied halls:', error);
		return [];
	}

	return currentBookings.map((booking) => ({
		hallCode: 'TBD', // Will need to join with hall table
		building: 'TBD',
		eventName:
			booking.event?.[0]?.name ||
			`${booking.extra_lecture?.[0]?.course_id || 'Course'} - ${booking.extra_lecture?.[0]?.type || 'Lecture'}`,
		bookedBy: booking.profiles?.full_name || 'Unknown',
		endTime: booking.end_time,
	}));
}

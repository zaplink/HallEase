// Real analytics data fetching using actual database schema from tables.txt
import { supabase } from '@/lib/supabaseClient';
import { AnalyticsData } from './analytics';

// Real database implementation based on tables.txt schema
export async function fetchRealAnalyticsData(filters?: {
	dateRange?: { from: Date; to: Date };
	hall?: string;
	eventType?: string;
	status?: string;
}): Promise<AnalyticsData> {
	try {
		const startDate =
			filters?.dateRange?.from?.toISOString().split('T')[0] ||
			getStartOfMonth();
		const endDate =
			filters?.dateRange?.to?.toISOString().split('T')[0] ||
			getEndOfMonth();

		// Fetch all reservations with related data
		const { data: reservations, error: reserveError } = await supabase
			.from('reserve')
			.select(
				`
        *,
        event(*),
        extra_lecture(*),
        profiles!inner(id, full_name, role, position)
      `
			)
			.gte('date', startDate)
			.lte('date', endDate)
			.eq('is_submitted', true);

		if (reserveError) {
			console.error('Reserve query error:', reserveError);
			throw reserveError;
		}

		// Fetch all halls for availability count
		const { data: halls, error: hallError } = await supabase
			.from('hall')
			.select('*');

		if (hallError) {
			console.error('Hall query error:', hallError);
			throw hallError;
		}

		// Fetch all users
		const { data: users, error: userError } = await supabase
			.from('profiles')
			.select('*');

		if (userError) throw userError;

		// Fetch draft reservations
		const { data: drafts, error: draftError } = await supabase
			.from('reserve')
			.select('*')
			.eq('is_submitted', false);

		if (draftError) throw draftError;

		// Process the data with proper error handling
		const processedData = await processAnalyticsData(
			reservations || [],
			halls || [],
			users || [],
			drafts || []
		);

		return processedData;
	} catch (error) {
		console.error('Error fetching real analytics data:', error);
		// Fallback to mock data if database fails
		const { fetchAnalyticsData } = await import('./analytics');
		return fetchAnalyticsData(filters);
	}
}

async function processAnalyticsData(
	reservations: any[],
	halls: any[],
	users: any[],
	drafts: any[]
): Promise<AnalyticsData> {
	// Create a hall lookup map for efficient access
	const hallLookup = new Map();
	halls.forEach((hall) => {
		hallLookup.set(hall.id, hall);
	});

	// Process hall usage by month
	const hallUsage = processHallUsageByMonth(reservations);

	// Process event types
	const eventTypes = processEventTypes(reservations);

	// Process popular halls
	const popularHalls = await processPopularHalls(reservations, hallLookup);

	// Process daily usage patterns
	const dailyUsage = processDailyUsage(reservations);

	// Process status distribution
	const statusDistribution = processStatusDistribution(reservations);

	// Process user roles
	const userRoles = processUserRoles(users, reservations);

	// Process building usage
	const buildingUsage = processBuildingUsage(reservations, hallLookup);

	// Calculate key metrics
	const metrics = calculateKeyMetrics(reservations, halls, users, drafts);

	return {
		hallUsage,
		eventTypes,
		popularHalls,
		dailyUsage,
		statusDistribution,
		userRoles,
		buildingUsage,
		metrics,
	};
}

function processHallUsageByMonth(reservations: any[]) {
	const monthlyData: Record<string, any> = {};

	reservations.forEach((reservation) => {
		const month = new Date(reservation.date).toLocaleDateString('en-US', {
			month: 'short',
		});

		if (!monthlyData[month]) {
			monthlyData[month] = {
				month,
				total_reserves: 0,
				events: 0,
				extra_lectures: 0,
				approved: 0,
				pending: 0,
				rejected: 0,
			};
		}

		monthlyData[month].total_reserves++;

		if (reservation.type === 'event') {
			monthlyData[month].events++;
		} else if (reservation.type === 'extra_lecture') {
			monthlyData[month].extra_lectures++;
		}

		switch (reservation.status) {
			case 'approved':
				monthlyData[month].approved++;
				break;
			case 'pending':
				monthlyData[month].pending++;
				break;
			case 'rejected':
				monthlyData[month].rejected++;
				break;
		}
	});

	return Object.values(monthlyData);
}

function processEventTypes(reservations: any[]) {
	const eventTypeCount: Record<string, number> = {};

	reservations.forEach((reservation) => {
		if (reservation.event && reservation.event.length > 0) {
			const eventType = reservation.event[0].type;
			eventTypeCount[eventType] = (eventTypeCount[eventType] || 0) + 1;
		}
	});

	const colors = {
		conference: '#8b5cf6',
		seminar: '#06b6d4',
		workshop: '#f59e0b',
		event: '#ef4444',
	};

	return Object.entries(eventTypeCount).map(([type, count]) => ({
		name: type.charAt(0).toUpperCase() + type.slice(1),
		value: count,
		color: colors[type as keyof typeof colors] || '#64748b',
	}));
}

function processPopularHalls(
	reservations: any[],
	hallLookup: Map<string, any>
) {
	const hallBookings: Record<string, any> = {};

	reservations.forEach((reservation) => {
		const hall = hallLookup.get(reservation.hall_id);
		if (hall) {
			const hallCode = hall.code;

			if (!hallBookings[hallCode]) {
				hallBookings[hallCode] = {
					hall_code: hallCode,
					bookings: 0,
					capacity: hall.capacity,
					building: hall.building,
					type: hall.type,
					energy_consumption: hall.energy_consumption || 0,
				};
			}

			hallBookings[hallCode].bookings++;
		}
	});

	return Object.values(hallBookings)
		.sort((a: any, b: any) => b.bookings - a.bookings)
		.slice(0, 5); // Top 5 halls
}

function processDailyUsage(reservations: any[]) {
	const hourlyUsage: Record<string, number> = {};

	reservations.forEach((reservation) => {
		const hour = reservation.start_time.split(':')[0];
		const timeSlot = `${hour}:00`;
		hourlyUsage[timeSlot] = (hourlyUsage[timeSlot] || 0) + 1;
	});

	// Convert to array and sort by time
	const dailyUsage = Object.entries(hourlyUsage)
		.map(([time, usage]) => ({ time, usage }))
		.sort((a, b) => a.time.localeCompare(b.time));

	return dailyUsage;
}

function processStatusDistribution(reservations: any[]) {
	const statusCount: Record<string, number> = {};

	reservations.forEach((reservation) => {
		statusCount[reservation.status] =
			(statusCount[reservation.status] || 0) + 1;
	});

	const total = reservations.length;

	return Object.entries(statusCount).map(([status, count]) => ({
		status,
		count,
		percentage: Math.round((count / total) * 100),
	}));
}

function processUserRoles(users: any[], reservations: any[]) {
	const roleStats: Record<string, any> = {};

	users.forEach((user) => {
		if (!roleStats[user.role]) {
			roleStats[user.role] = { count: 0, active_bookings: 0 };
		}
		roleStats[user.role].count++;
	});

	// Count active bookings per role
	reservations.forEach((reservation) => {
		if (reservation.profiles && reservation.profiles.length > 0) {
			const userRole = reservation.profiles[0].role;
			if (reservation.status === 'approved') {
				roleStats[userRole].active_bookings++;
			}
		}
	});

	return Object.entries(roleStats).map(([role, stats]) => ({
		role,
		count: stats.count,
		active_bookings: stats.active_bookings,
	}));
}

function processBuildingUsage(
	reservations: any[],
	hallLookup: Map<string, any>
) {
	const buildingStats: Record<string, any> = {};

	reservations.forEach((reservation) => {
		const hall = hallLookup.get(reservation.hall_id);
		if (hall) {
			const building = hall.building;
			const energyConsumption = hall.energy_consumption || 0;

			if (!buildingStats[building]) {
				buildingStats[building] = {
					total_bookings: 0,
					energy_total: 0,
					count: 0,
				};
			}

			buildingStats[building].total_bookings++;
			buildingStats[building].energy_total += energyConsumption;
			buildingStats[building].count++;
		}
	});

	return Object.entries(buildingStats).map(([building, stats]) => ({
		building,
		total_bookings: stats.total_bookings,
		energy_avg:
			stats.count > 0 ? Math.round(stats.energy_total / stats.count) : 0,
	}));
}

function calculateKeyMetrics(
	reservations: any[],
	halls: any[],
	users: any[],
	drafts: any[]
) {
	const totalReserves = reservations.length;
	const activeUsers = users.filter((u) => u.role !== 'GUEST').length;
	const availableHalls = halls.filter((h) => h.is_available).length;
	const approvedReserves = reservations.filter(
		(r) => r.status === 'approved'
	).length;
	const pendingReserves = reservations.filter(
		(r) => r.status === 'pending'
	).length;
	const draftReserves = drafts.length;
	const totalEnergyConsumption = halls.reduce(
		(sum, h) => sum + h.energy_consumption,
		0
	);

	// Calculate average response time
	const avgResponseTime = calculateAverageResponseTime(reservations);

	return {
		totalReserves,
		activeUsers,
		availableHalls,
		approvalRate:
			totalReserves > 0
				? Math.round((approvedReserves / totalReserves) * 100)
				: 0,
		avgResponseTime,
		pendingReserves,
		draftReserves,
		totalEnergyConsumption,
	};
}

function calculateAverageResponseTime(reservations: any[]): string {
	const processedReservations = reservations.filter(
		(r) => r.status !== 'pending' && r.modified_date && r.created_date
	);

	if (processedReservations.length === 0) return '0h';

	const totalHours = processedReservations.reduce((sum, reservation) => {
		const created = new Date(
			`${reservation.created_date}T${reservation.created_time}`
		);
		const modified = new Date(
			`${reservation.modified_date}T${reservation.modified_time}`
		);
		const diffHours =
			(modified.getTime() - created.getTime()) / (1000 * 60 * 60);
		return sum + diffHours;
	}, 0);

	const avgHours = totalHours / processedReservations.length;
	return `${avgHours.toFixed(1)}h`;
}

function getStartOfMonth(): string {
	const date = new Date();
	date.setDate(1);
	return date.toISOString().split('T')[0];
}

function getEndOfMonth(): string {
	const date = new Date();
	date.setMonth(date.getMonth() + 1, 0);
	return date.toISOString().split('T')[0];
}

// Export functions for individual data fetching
export {
	processHallUsageByMonth,
	processEventTypes,
	processPopularHalls,
	processDailyUsage,
	processStatusDistribution,
	processUserRoles,
	processBuildingUsage,
	calculateKeyMetrics,
};

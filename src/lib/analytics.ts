import { fetchRealMetricsData } from './analytics-real-metrics';

export interface AnalyticsFilters {
	status: string;
	isSubmitted: string;
}

// Simple analytics interface - building step by step
export interface AnalyticsData {
	metrics: {
		totalReservations: number;
		activeUsers: number;
		completionRate: number;
		totalReservationsChange: number;
		activeUsersChange: number;
		completionRateChange: number;
	};
}

// Simple function to start with
export async function fetchAnalyticsData(
	filters?: AnalyticsFilters
): Promise<AnalyticsData> {
	// Simulate API call delay
	await new Promise((resolve) => setTimeout(resolve, 500));

	try {
		// Fetch real metrics data from database with filters
		const metrics = await fetchRealMetricsData(filters);

		return {
			metrics,
		};
	} catch (error) {
		console.error('Error fetching analytics data:', error);

		// Return mock data as fallback
		return {
			metrics: {
				totalReservations: 327,
				activeUsers: 142,
				completionRate: 92.5,
				totalReservationsChange: 12,
				activeUsersChange: 8,
				completionRateChange: 2.1,
			},
		};
	}
}

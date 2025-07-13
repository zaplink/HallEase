import { createClient } from '@/lib/supabaseClient';

export class DebugReportsService {
	private static supabase = createClient();

	/**
	 * Test basic database connection and table access
	 */
	static async testConnection(): Promise<any> {
		const supabase = this.supabase;

		try {
			console.log('Testing database connection...');

			// Test 1: Basic connection
			const { data: authData, error: authError } =
				await supabase.auth.getUser();
			console.log('Auth check:', {
				user: authData.user?.id,
				error: authError,
			});

			// Test 2: Check if reserve table exists and get count
			const { data: reserveData, error: reserveError } = await supabase
				.from('reserve')
				.select('count', { count: 'exact' });
			console.log('Reserve table test:', {
				count: reserveData,
				error: reserveError,
			});

			// Test 3: Get a few reserve records
			const { data: sampleReserve, error: sampleError } = await supabase
				.from('reserve')
				.select('*')
				.limit(5);
			console.log('Sample reserve records:', {
				data: sampleReserve,
				error: sampleError,
			});

			// Test 4: Check profiles table
			const { data: profilesData, error: profilesError } = await supabase
				.from('profiles')
				.select('*')
				.limit(5);
			console.log('Profiles table test:', {
				data: profilesData,
				error: profilesError,
			});

			// Test 5: Check hall table
			const { data: hallData, error: hallError } = await supabase
				.from('hall')
				.select('*')
				.limit(5);
			console.log('Hall table test:', {
				data: hallData,
				error: hallError,
			});

			// Test 6: Check hall_assign table
			const { data: hallAssignData, error: hallAssignError } =
				await supabase.from('hall_assign').select('*').limit(5);
			console.log('Hall assign table test:', {
				data: hallAssignData,
				error: hallAssignError,
			});

			return {
				auth: { user: authData.user?.id, error: authError },
				reserve: { count: reserveData, error: reserveError },
				sample: { data: sampleReserve, error: sampleError },
				profiles: { data: profilesData, error: profilesError },
				hall: { data: hallData, error: hallError },
				hallAssign: { data: hallAssignData, error: hallAssignError },
			};
		} catch (error) {
			console.error('Debug test failed:', error);
			throw error;
		}
	}

	/**
	 * Get basic report metrics without complex joins
	 */
	static async getBasicMetrics(): Promise<any> {
		const supabase = this.supabase;

		try {
			// Get all submitted reports
			const { data: allReports, error: reportsError } = await supabase
				.from('reserve')
				.select('*')
				.eq('is_submitted', true);

			if (reportsError) {
				console.error('Error fetching reports:', reportsError);
				throw new Error('Failed to fetch reports data');
			}

			const reports = allReports || [];
			console.log('Found reports:', reports.length);

			// Calculate basic metrics
			const totalReports = reports.length;
			const pendingReports = reports.filter(
				(r) => r.status === 'pending'
			).length;
			const approvedReports = reports.filter(
				(r) => r.status === 'approved'
			).length;
			const rejectedReports = reports.filter(
				(r) => r.status === 'rejected'
			).length;
			const waitingReports = reports.filter(
				(r) => r.status === 'waiting'
			).length;

			const reportsByType = {
				extra_lecture: reports.filter((r) => r.type === 'extra_lecture')
					.length,
				event: reports.filter((r) => r.type === 'event').length,
			};

			const reportsByStatus = {
				pending: pendingReports,
				approved: approvedReports,
				waiting: waitingReports,
				rejected: rejectedReports,
			};

			// Get recent activity (last 7 days)
			const recentActivity: Array<{ date: string; count: number }> = [];
			for (let i = 6; i >= 0; i--) {
				const date = new Date();
				date.setDate(date.getDate() - i);
				const dateStr = date.toISOString().split('T')[0];

				const dayReports = reports.filter(
					(r) => r.created_date === dateStr
				);
				recentActivity.push({
					date: dateStr,
					count: dayReports.length,
				});
			}

			return {
				totalReports,
				pendingReports,
				approvedReports,
				rejectedReports,
				waitingReports,
				reportsByType,
				reportsByStatus,
				reportsByHall: [], // Will implement later
				recentActivity,
			};
		} catch (error) {
			console.error('Error in getBasicMetrics:', error);
			throw error;
		}
	}

	/**
	 * Get basic reports without complex joins
	 */
	static async getBasicReports(): Promise<any[]> {
		const supabase = this.supabase;

		try {
			// Get basic report data
			const { data: reports, error: reportsError } = await supabase
				.from('reserve')
				.select('*')
				.eq('is_submitted', true)
				.order('created_date', { ascending: false })
				.limit(20);

			if (reportsError) {
				console.error('Error fetching basic reports:', reportsError);
				throw new Error('Failed to fetch basic reports');
			}

			console.log('Found basic reports:', reports?.length || 0);
			return reports || [];
		} catch (error) {
			console.error('Error in getBasicReports:', error);
			throw error;
		}
	}
}

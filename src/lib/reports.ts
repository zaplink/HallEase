import { createClient } from '@/lib/supabaseClient';

export interface ReportMetrics {
	totalReports: number;
	pendingReports: number;
	approvedReports: number;
	rejectedReports: number;
	waitingReports: number;
	reportsByType: {
		extra_lecture: number;
		event: number;
	};
	reportsByStatus: {
		pending: number;
		approved: number;
		waiting: number;
		rejected: number;
	};
	reportsByHall: Array<{
		hall_code: string;
		count: number;
	}>;
	recentActivity: Array<{
		date: string;
		count: number;
	}>;
}

export interface DetailedReport {
	id: string;
	date: string;
	start_time: string;
	end_time: string;
	status: string;
	type: string;
	hall_option: string;
	is_submitted: boolean;
	is_consented: boolean;
	created_date: string;
	created_time: string;
	modified_date?: string;
	modified_time?: string;

	// Joined data
	profile?: {
		id: string;
		full_name: string;
		email: string;
		role: string;
		position?: string;
	};

	// Event data (if type is event)
	event?: {
		name: string;
		description: string;
		organizer: string;
		type: string;
		attendee_count: number;
		additional_notes?: string;
	};

	// Extra lecture data (if type is extra_lecture)
	extra_lecture?: {
		description: string;
		attendee_count: number;
		type: string;
		additional_notes?: string;
		course?: {
			char: string;
			digit: string;
			name: string;
		};
	};

	// Hall assignments
	halls?: Array<{
		hall_code: string;
		building: string;
		capacity: number;
		type: string;
		floor: number;
	}>;
}

export interface ReportFilters {
	status?: string;
	type?: string;
	dateFrom?: string;
	dateTo?: string;
	search?: string;
	hall?: string;
}

export class ReportsService {
	private static supabase = createClient();

	/**
	 * Get report metrics for dashboard overview
	 */
	static async getReportMetrics(): Promise<ReportMetrics> {
		const supabase = this.supabase;

		// Get total reports count
		const { data: allReports, error: reportsError } = await supabase
			.from('reserve')
			.select('*')
			.eq('is_submitted', true);

		if (reportsError) {
			console.error('Error fetching reports:', reportsError);
			throw new Error('Failed to fetch reports data');
		}

		const reports = allReports || [];

		// Calculate metrics
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

		// Get reports by hall
		const { data: hallAssignments, error: hallError } = await supabase.from(
			'hall_assign'
		).select(`
				reserve_id,
				hall!hall_id(code)
			`);

		let reportsByHall: Array<{ hall_code: string; count: number }> = [];
		if (!hallError && hallAssignments) {
			// Filter to only include submitted reports
			const submittedReportIds = new Set(reports.map((r) => r.id));
			const filteredAssignments = hallAssignments.filter(
				(assignment: any) =>
					submittedReportIds.has(assignment.reserve_id)
			);

			const hallCounts: Record<string, number> = {};
			filteredAssignments.forEach((assignment: any) => {
				const hallCode = assignment.hall?.code;
				if (hallCode) {
					hallCounts[hallCode] = (hallCounts[hallCode] || 0) + 1;
				}
			});
			reportsByHall = Object.entries(hallCounts)
				.map(([hall_code, count]) => ({ hall_code, count }))
				.sort((a, b) => b.count - a.count);
		}

		// Get recent activity (last 7 days)
		const sevenDaysAgo = new Date();
		sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

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
			reportsByHall,
			recentActivity,
		};
	}

	/**
	 * Get detailed reports with filters
	 */
	static async getDetailedReports(
		filters: ReportFilters = {}
	): Promise<DetailedReport[]> {
		const supabase = this.supabase;

		let query = supabase
			.from('reserve')
			.select(
				`
				*,
				profiles!profile_id(id, full_name, email, role, position)
			`
			)
			.eq('is_submitted', true)
			.order('created_date', { ascending: false })
			.order('created_time', { ascending: false });

		// Apply filters
		if (filters.status) {
			query = query.eq('status', filters.status);
		}
		if (filters.type) {
			query = query.eq('type', filters.type);
		}
		if (filters.dateFrom) {
			query = query.gte('date', filters.dateFrom);
		}
		if (filters.dateTo) {
			query = query.lte('date', filters.dateTo);
		}

		const { data, error } = await query;

		if (error) {
			console.error('Error fetching detailed reports:', error);
			throw new Error('Failed to fetch detailed reports');
		}

		let reports = data || [];

		// Get additional data for each report
		const enrichedReports = await Promise.all(
			reports.map(async (report) => {
				let enrichedReport = { ...report, profile: report.profiles };

				// Get event data if type is event
				if (report.type === 'event') {
					const { data: eventData } = await supabase
						.from('event')
						.select('*')
						.eq('reserve_id', report.id)
						.single();
					if (eventData) {
						enrichedReport.event = eventData;
					}
				}

				// Get extra_lecture data if type is extra_lecture
				if (report.type === 'extra_lecture') {
					const { data: lectureData } = await supabase
						.from('extra_lecture')
						.select(
							`
							*,
							course!course_id(char, digit, name)
						`
						)
						.eq('reserve_id', report.id)
						.single();
					if (lectureData) {
						enrichedReport.extra_lecture = lectureData;
					}
				}

				// Get hall assignments
				const { data: hallAssignments } = await supabase
					.from('hall_assign')
					.select(
						`
						hall!hall_id(code, building, capacity, type, floor)
					`
					)
					.eq('reserve_id', report.id);

				if (hallAssignments) {
					enrichedReport.halls = hallAssignments
						.map((assignment: any) => assignment.hall)
						.filter(Boolean);
				}

				return enrichedReport;
			})
		);

		// Apply text search filter
		let filteredReports = enrichedReports;
		if (filters.search) {
			const searchLower = filters.search.toLowerCase();
			filteredReports = enrichedReports.filter(
				(report) =>
					report.id.toLowerCase().includes(searchLower) ||
					report.profile?.full_name
						?.toLowerCase()
						.includes(searchLower) ||
					report.event?.name?.toLowerCase().includes(searchLower) ||
					report.extra_lecture?.description
						?.toLowerCase()
						.includes(searchLower)
			);
		}

		// Apply hall filter
		if (filters.hall) {
			filteredReports = filteredReports.filter((report) =>
				report.halls?.some((hall: any) => hall?.code === filters.hall)
			);
		}

		return filteredReports;
	}

	/**
	 * Update report status
	 */
	static async updateReportStatus(
		reportId: string,
		status: string
	): Promise<void> {
		const supabase = this.supabase;

		const { error } = await supabase
			.from('reserve')
			.update({
				status,
				modified_date: new Date().toISOString().split('T')[0],
				modified_time: new Date().toTimeString().split(' ')[0],
			})
			.eq('id', reportId);

		if (error) {
			console.error('Error updating report status:', error);
			throw new Error('Failed to update report status');
		}
	}

	/**
	 * Delete a report
	 */
	static async deleteReport(reportId: string): Promise<void> {
		const supabase = this.supabase;

		// Note: This should cascade delete related records
		const { error } = await supabase
			.from('reserve')
			.delete()
			.eq('id', reportId);

		if (error) {
			console.error('Error deleting report:', error);
			throw new Error('Failed to delete report');
		}
	}

	/**
	 * Export reports data
	 */
	static async exportReports(
		filters: ReportFilters = {},
		format: 'csv' | 'json' = 'csv'
	): Promise<string> {
		const reports = await this.getDetailedReports(filters);

		if (format === 'json') {
			return JSON.stringify(reports, null, 2);
		}

		// CSV format
		const headers = [
			'ID',
			'Date',
			'Start Time',
			'End Time',
			'Status',
			'Type',
			'User',
			'Email',
			'Halls',
			'Created Date',
			'Modified Date',
		];

		const csvRows = [
			headers.join(','),
			...reports.map((report) =>
				[
					report.id,
					report.date,
					report.start_time,
					report.end_time,
					report.status,
					report.type,
					report.profile?.full_name || '',
					report.profile?.email || '',
					report.halls?.map((h) => h.hall_code).join('; ') || '',
					report.created_date,
					report.modified_date || '',
				]
					.map((field) => `"${field}"`)
					.join(',')
			),
		];

		return csvRows.join('\n');
	}
}

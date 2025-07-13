import { supabase } from '@/lib/supabaseClient';

// Type definitions for different report types
export interface IssueReport {
	id: string;
	issue_type: string;
	title: string;
	description: string;
	status: string;
	priority: string;
	reporter_id: string;
	created_date: string;
	created_time: string;
	resolved_date?: string;
	resolved_by?: string;
	resolution_notes?: string;
	reporter?: {
		full_name: string;
		email: string;
		role: string;
	};
}

export interface SystemReport {
	id: string;
	type: 'error' | 'warning' | 'info' | 'security';
	level: 'low' | 'medium' | 'high' | 'critical';
	message: string;
	timestamp: string;
	module: string;
	resolved: boolean;
	resolved_date?: string;
	resolved_by?: string;
	stack_trace?: string;
	user_id?: string;
	session_id?: string;
}

export interface ComplianceReport {
	id: string;
	type:
		| 'policy_violation'
		| 'usage_exceeded'
		| 'unauthorized_access'
		| 'data_breach'
		| 'security_incident';
	description: string;
	user_id: string;
	resource_id: string;
	resource_type: string;
	severity: 'low' | 'medium' | 'high' | 'critical';
	status: 'open' | 'investigating' | 'resolved' | 'false_positive';
	created_date: string;
	created_time: string;
	resolved_date?: string;
	resolved_by?: string;
	resolution_notes?: string;
	automated_detection: boolean;
	user?: {
		full_name: string;
		email: string;
		role: string;
	};
}

export interface UserActivityReport {
	id: string;
	user_id: string;
	action: string;
	resource: string;
	resource_id?: string;
	timestamp: string;
	ip_address?: string;
	user_agent?: string;
	success: boolean;
	error_message?: string;
	session_id?: string;
	user?: {
		full_name: string;
		email: string;
		role: string;
	};
}

export interface AuditReport {
	id: string;
	admin_id: string;
	action: string;
	resource_type: string;
	resource_id: string;
	old_values?: Record<string, unknown>;
	new_values?: Record<string, unknown>;
	timestamp: string;
	ip_address?: string;
	admin?: {
		full_name: string;
		email: string;
		role: string;
	};
}

export interface PerformanceReport {
	id: string;
	metric_name: string;
	metric_value: number;
	metric_unit: string;
	timestamp: string;
	service: string;
	environment: string;
	threshold_exceeded: boolean;
	alert_sent: boolean;
}

export class ReportsServiceNew {
	private static supabase = supabase;

	// Issue Reports Methods
	static async getIssueReports(filters?: {
		status?: string;
		priority?: string;
		type?: string;
		dateFrom?: string;
		dateTo?: string;
		search?: string;
	}): Promise<IssueReport[]> {
		try {
			let query = this.supabase
				.from('issue_reports')
				.select(
					`
          *,
          reporter:profiles!reporter_id(full_name, email, role)
        `
				)
				.order('created_date', { ascending: false });

			if (filters?.status) {
				query = query.eq('status', filters.status);
			}
			if (filters?.priority) {
				query = query.eq('priority', filters.priority);
			}
			if (filters?.type) {
				query = query.eq('issue_type', filters.type);
			}
			if (filters?.dateFrom) {
				query = query.gte('created_date', filters.dateFrom);
			}
			if (filters?.dateTo) {
				query = query.lte('created_date', filters.dateTo);
			}
			if (filters?.search) {
				query = query.or(
					`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`
				);
			}

			const { data, error } = await query;
			if (error) {
				console.error('Error fetching issue reports:', error);
				return [];
			}
			return data || [];
		} catch (error) {
			console.error('Error fetching issue reports:', error);
			return [];
		}
	}

	static async createIssueReport(
		report: Omit<IssueReport, 'id' | 'created_date' | 'created_time'>
	): Promise<IssueReport> {
		try {
			const { data, error } = await this.supabase
				.from('issue_reports')
				.insert({
					...report,
					created_date: new Date().toISOString().split('T')[0],
					created_time: new Date().toTimeString().split(' ')[0],
				})
				.select()
				.single();

			if (error) throw error;
			return data;
		} catch (error) {
			console.error('Error creating issue report:', error);
			throw error;
		}
	}

	static async updateIssueReportStatus(
		id: string,
		status: string,
		resolvedBy?: string,
		resolutionNotes?: string
	): Promise<void> {
		try {
			const updateData: Record<string, unknown> = {
				status,
				updated_date: new Date().toISOString().split('T')[0],
				updated_time: new Date().toTimeString().split(' ')[0],
			};

			if (status === 'resolved') {
				updateData.resolved_date = new Date()
					.toISOString()
					.split('T')[0];
				updateData.resolved_time = new Date()
					.toTimeString()
					.split(' ')[0];
				updateData.assigned_to = resolvedBy;
				updateData.resolution_notes = resolutionNotes;
			}

			const { error } = await this.supabase
				.from('issue_reports')
				.update(updateData)
				.eq('id', id);

			if (error) {
				console.error('Error updating issue report status:', error);
				return;
			}
		} catch (error) {
			console.error('Error updating issue report status:', error);
			return;
		}
	}

	static async deleteIssueReport(id: string): Promise<void> {
		try {
			const { error } = await this.supabase
				.from('issue_reports')
				.delete()
				.eq('id', id);

			if (error) {
				console.error('Error deleting issue report:', error);
				return;
			}
		} catch (error) {
			console.error('Error deleting issue report:', error);
			return;
		}
	}

	// System Reports Methods
	static async getSystemReports(filters?: {
		type?: string;
		level?: string;
		module?: string;
		resolved?: boolean;
		dateFrom?: string;
		dateTo?: string;
	}): Promise<SystemReport[]> {
		try {
			// Check if system_reports table exists by trying a simple query
			const { error: tableCheckError } = await this.supabase
				.from('system_reports')
				.select('id')
				.limit(1);

			if (tableCheckError) {
				console.log(
					'System reports table does not exist yet, returning empty array'
				);
				return [];
			}

			let query = this.supabase
				.from('system_reports')
				.select('*')
				.order('created_at', { ascending: false });

			// Apply filters
			if (filters?.type) query = query.eq('type', filters.type);
			if (filters?.level) query = query.eq('level', filters.level);
			if (filters?.module) query = query.eq('module', filters.module);
			if (filters?.resolved !== undefined)
				query = query.eq('resolved', filters.resolved);
			if (filters?.dateFrom)
				query = query.gte('created_at', filters.dateFrom);
			if (filters?.dateTo)
				query = query.lte('created_at', filters.dateTo);

			const { data, error } = await query;

			if (error) {
				console.error('Error fetching system reports:', error);
				return [];
			}

			return (
				data?.map((report) => ({
					id: report.id,
					type: report.type,
					level: report.level,
					message: report.message,
					module: report.module,
					timestamp: new Date(report.created_at).toLocaleString(),
					resolved: report.resolved,
					details: report.details || null,
					created_at: report.created_at,
					resolved_at: report.resolved_at,
				})) || []
			);
		} catch (error) {
			console.error('Error fetching system reports:', error);
			return [];
		}
	}

	static async createSystemReport(
		report: Omit<SystemReport, 'id' | 'timestamp'>
	): Promise<SystemReport> {
		try {
			const { data, error } = await this.supabase
				.from('system_reports')
				.insert({
					...report,
					timestamp: new Date().toISOString(),
				})
				.select()
				.single();

			if (error) throw error;
			return data;
		} catch (error) {
			console.error('Error creating system report:', error);
			throw error;
		}
	}

	static async updateSystemReportStatus(
		id: string,
		resolved: boolean
	): Promise<void> {
		try {
			// Check if system_reports table exists
			const { error: tableCheckError } = await this.supabase
				.from('system_reports')
				.select('id')
				.limit(1);

			if (tableCheckError) {
				console.log(
					'System reports table does not exist yet, operation skipped'
				);
				return;
			}

			const { error } = await this.supabase
				.from('system_reports')
				.update({
					resolved,
					resolved_at: resolved ? new Date().toISOString() : null,
				})
				.eq('id', id);

			if (error) {
				console.error('Error updating system report status:', error);
				return;
			}
		} catch (error) {
			console.error('Error updating system report status:', error);
			return;
		}
	}

	static async deleteSystemReport(id: string): Promise<void> {
		try {
			// Check if system_reports table exists
			const { error: tableCheckError } = await this.supabase
				.from('system_reports')
				.select('id')
				.limit(1);

			if (tableCheckError) {
				console.log(
					'System reports table does not exist yet, operation skipped'
				);
				return;
			}

			const { error } = await this.supabase
				.from('system_reports')
				.delete()
				.eq('id', id);

			if (error) {
				console.error('Error deleting system report:', error);
				return;
			}
		} catch (error) {
			console.error('Error deleting system report:', error);
			return;
		}
	}

	// Compliance Reports Methods
	static async getComplianceReports(filters?: {
		type?: string;
		severity?: string;
		status?: string;
		userId?: string;
		dateFrom?: string;
		dateTo?: string;
	}): Promise<ComplianceReport[]> {
		try {
			// Check if compliance_reports table exists by trying a simple query
			const { error: tableCheckError } = await this.supabase
				.from('compliance_reports')
				.select('id')
				.limit(1);

			if (tableCheckError) {
				console.log(
					'Compliance reports table does not exist yet, returning empty array'
				);
				return [];
			}

			let query = this.supabase
				.from('compliance_reports')
				.select(
					`
          *,
          user:profiles!user_id(full_name, email, role)
        `
				)
				.order('created_date', { ascending: false });

			if (filters?.type) {
				query = query.eq('type', filters.type);
			}
			if (filters?.severity) {
				query = query.eq('severity', filters.severity);
			}
			if (filters?.status) {
				query = query.eq('status', filters.status);
			}
			if (filters?.userId) {
				query = query.eq('user_id', filters.userId);
			}
			if (filters?.dateFrom) {
				query = query.gte('created_date', filters.dateFrom);
			}
			if (filters?.dateTo) {
				query = query.lte('created_date', filters.dateTo);
			}

			const { data, error } = await query;
			if (error) {
				console.error('Error fetching compliance reports:', error);
				return [];
			}
			return data || [];
		} catch (error) {
			console.error('Error fetching compliance reports:', error);
			return [];
		}
	}

	static async createComplianceReport(
		report: Omit<ComplianceReport, 'id' | 'created_date' | 'created_time'>
	): Promise<ComplianceReport> {
		try {
			const { data, error } = await this.supabase
				.from('compliance_reports')
				.insert({
					...report,
					created_date: new Date().toISOString().split('T')[0],
					created_time: new Date().toTimeString().split(' ')[0],
				})
				.select()
				.single();

			if (error) throw error;
			return data;
		} catch (error) {
			console.error('Error creating compliance report:', error);
			throw error;
		}
	}

	// User Activity Reports Methods
	static async getUserActivityReports(filters?: {
		userId?: string;
		action?: string;
		success?: boolean;
		dateFrom?: string;
		dateTo?: string;
		limit?: number;
	}): Promise<UserActivityReport[]> {
		try {
			// Check if user_activity_reports table exists by trying a simple query
			const { error: tableCheckError } = await this.supabase
				.from('user_activity_reports')
				.select('id')
				.limit(1);

			if (tableCheckError) {
				console.log(
					'User activity reports table does not exist yet, returning empty array'
				);
				return [];
			}

			let query = this.supabase
				.from('user_activity_reports')
				.select(
					`
          *,
          user:profiles!user_id(full_name, email, role)
        `
				)
				.order('timestamp', { ascending: false });

			if (filters?.userId) {
				query = query.eq('user_id', filters.userId);
			}
			if (filters?.action) {
				query = query.eq('action', filters.action);
			}
			if (filters?.success !== undefined) {
				query = query.eq('success', filters.success);
			}
			if (filters?.dateFrom) {
				query = query.gte('timestamp', filters.dateFrom);
			}
			if (filters?.dateTo) {
				query = query.lte('timestamp', filters.dateTo);
			}
			if (filters?.limit) {
				query = query.limit(filters.limit);
			}

			const { data, error } = await query;
			if (error) {
				console.error('Error fetching user activity reports:', error);
				return [];
			}
			return data || [];
		} catch (error) {
			console.error('Error fetching user activity reports:', error);
			return [];
		}
	}

	static async logUserActivity(
		activity: Omit<UserActivityReport, 'id' | 'timestamp'>
	): Promise<void> {
		try {
			const { error } = await this.supabase
				.from('user_activity_reports')
				.insert({
					...activity,
					timestamp: new Date().toISOString(),
				});

			if (error) throw error;
		} catch (error) {
			console.error('Error logging user activity:', error);
			// Don't throw error for activity logging to avoid breaking main functionality
		}
	}

	// Performance Reports Methods
	static async getPerformanceReports(filters?: {
		service?: string;
		metricName?: string;
		thresholdExceeded?: boolean;
		dateFrom?: string;
		dateTo?: string;
	}): Promise<PerformanceReport[]> {
		try {
			let query = this.supabase
				.from('performance_reports')
				.select('*')
				.order('timestamp', { ascending: false });

			if (filters?.service) {
				query = query.eq('service', filters.service);
			}
			if (filters?.metricName) {
				query = query.eq('metric_name', filters.metricName);
			}
			if (filters?.thresholdExceeded !== undefined) {
				query = query.eq(
					'threshold_exceeded',
					filters.thresholdExceeded
				);
			}
			if (filters?.dateFrom) {
				query = query.gte('timestamp', filters.dateFrom);
			}
			if (filters?.dateTo) {
				query = query.lte('timestamp', filters.dateTo);
			}

			const { data, error } = await query;
			if (error) throw error;
			return data || [];
		} catch (error) {
			console.error('Error fetching performance reports:', error);
			throw error;
		}
	}

	// Export Methods
	static async exportReports(
		type: string,
		format: 'csv' | 'json',
		filters?: Record<string, unknown>
	): Promise<string> {
		let data: (
			| IssueReport
			| SystemReport
			| ComplianceReport
			| UserActivityReport
			| PerformanceReport
		)[] = [];

		switch (type) {
			case 'issues':
				data = await this.getIssueReports(filters);
				break;
			case 'system':
				data = await this.getSystemReports(filters);
				break;
			case 'compliance':
				data = await this.getComplianceReports(filters);
				break;
			case 'activity':
				data = await this.getUserActivityReports(filters);
				break;
			case 'performance':
				data = await this.getPerformanceReports(filters);
				break;
			default:
				throw new Error('Invalid report type');
		}

		if (format === 'json') {
			return JSON.stringify(data, null, 2);
		} else {
			// CSV format
			if (data.length === 0) return '';

			// Cast to Record<string, unknown> for CSV processing
			const typedData = data as unknown as Record<string, unknown>[];
			const headers = Object.keys(typedData[0]).filter(
				(key) => typeof typedData[0][key] !== 'object'
			);
			const csv = [
				headers.join(','),
				...typedData.map((row) =>
					headers
						.map((header) => {
							const value = row[header];
							if (value === null || value === undefined)
								return '';
							if (
								typeof value === 'string' &&
								value.includes(',')
							) {
								return `"${value.replace(/"/g, '""')}"`;
							}
							return value;
						})
						.join(',')
				),
			].join('\n');

			return csv;
		}
	}

	// Dashboard Statistics
	static async getReportsDashboardStats(): Promise<{
		issueReports: { total: number; open: number; resolved: number };
		systemReports: { total: number; unresolved: number; critical: number };
		complianceReports: { total: number; open: number; critical: number };
		userActivity: {
			totalToday: number;
			failedLogins: number;
			suspiciousActivity: number;
		};
	}> {
		try {
			const [issueStats, systemStats, complianceStats, activityStats] =
				await Promise.all([
					// Issue reports stats (use existing table)
					(async () => {
						try {
							const { data } = await this.supabase
								.from('issue_reports')
								.select('status');
							const total = data?.length || 0;
							const open =
								data?.filter(
									(r: { status: string }) =>
										r.status === 'open' ||
										r.status === 'in_progress'
								).length || 0;
							const resolved =
								data?.filter(
									(r: { status: string }) =>
										r.status === 'resolved' ||
										r.status === 'closed'
								).length || 0;
							return { total, open, resolved };
						} catch {
							return { total: 0, open: 0, resolved: 0 };
						}
					})(),

					// System reports stats (might not exist)
					(async () => {
						try {
							const { data } = await this.supabase
								.from('system_reports')
								.select('resolved, level');
							const total = data?.length || 0;
							const unresolved =
								data?.filter(
									(r: { resolved: boolean }) => !r.resolved
								).length || 0;
							const critical =
								data?.filter(
									(r: { level: string }) =>
										r.level === 'critical'
								).length || 0;
							return { total, unresolved, critical };
						} catch {
							return { total: 0, unresolved: 0, critical: 0 };
						}
					})(),

					// Compliance reports stats (might not exist)
					(async () => {
						try {
							const { data } = await this.supabase
								.from('compliance_reports')
								.select('status, severity');
							const total = data?.length || 0;
							const open =
								data?.filter(
									(r: { status: string }) =>
										r.status === 'open'
								).length || 0;
							const critical =
								data?.filter(
									(r: { severity: string }) =>
										r.severity === 'critical'
								).length || 0;
							return { total, open, critical };
						} catch {
							return { total: 0, open: 0, critical: 0 };
						}
					})(),

					// User activity stats (might not exist)
					(async () => {
						try {
							const { data } = await this.supabase
								.from('user_activity_reports')
								.select('action, success')
								.gte(
									'timestamp',
									new Date().toISOString().split('T')[0]
								);
							const totalToday = data?.length || 0;
							const failedLogins =
								data?.filter(
									(r: { action: string; success: boolean }) =>
										r.action === 'login' && !r.success
								).length || 0;
							const suspiciousActivity =
								data?.filter(
									(r: { action: string }) =>
										r.action.includes('unauthorized') ||
										r.action.includes('suspicious')
								).length || 0;
							return {
								totalToday,
								failedLogins,
								suspiciousActivity,
							};
						} catch {
							return {
								totalToday: 0,
								failedLogins: 0,
								suspiciousActivity: 0,
							};
						}
					})(),
				]);

			return {
				issueReports: issueStats,
				systemReports: systemStats,
				complianceReports: complianceStats,
				userActivity: activityStats,
			};
		} catch (error) {
			console.error('Error fetching dashboard stats:', error);
			// Return default stats if everything fails
			return {
				issueReports: { total: 0, open: 0, resolved: 0 },
				systemReports: { total: 0, unresolved: 0, critical: 0 },
				complianceReports: { total: 0, open: 0, critical: 0 },
				userActivity: {
					totalToday: 0,
					failedLogins: 0,
					suspiciousActivity: 0,
				},
			};
		}
	}
}

import { createClient } from '@/lib/supabaseClient';
import {
	IssueReport,
	CreateIssueReportData,
	UpdateIssueReportData,
	IssueReportFilters,
} from '@/types/issue-reports';

const supabase = createClient();

export class IssueReportsService {
	/**
	 * Create a new issue report
	 */
	static async createIssue(
		data: CreateIssueReportData,
		userId: string
	): Promise<IssueReport> {
		const { data: result, error } = await supabase
			.from('issue_reports')
			.insert({
				issue_type: data.issueType,
				title: data.title,
				description: data.description,
				status: 'open',
				priority: 'medium',
				reporter_id: userId,
				created_date: new Date().toISOString().split('T')[0],
				created_time: new Date().toTimeString().split(' ')[0],
			})
			.select()
			.single();

		if (error) {
			throw new Error(error.message);
		}

		return result;
	}

	/**
	 * Get all issues with optional filters
	 */
	static async getIssues(
		filters?: IssueReportFilters
	): Promise<IssueReport[]> {
		let query = supabase
			.from('issue_reports')
			.select(
				`
				*,
				reporter:profiles!reporter_id(id, full_name, email, role, position),
				assignee:profiles!assigned_to(id, full_name, email, role, position)
			`
			)
			.order('created_date', { ascending: false })
			.order('created_time', { ascending: false });

		// Apply filters
		if (filters?.status) {
			query = query.eq('status', filters.status);
		}
		if (filters?.priority) {
			query = query.eq('priority', filters.priority);
		}
		if (filters?.issue_type) {
			query = query.eq('issue_type', filters.issue_type);
		}
		if (filters?.assigned_to) {
			query = query.eq('assigned_to', filters.assigned_to);
		}
		if (filters?.reporter_id) {
			query = query.eq('reporter_id', filters.reporter_id);
		}
		if (filters?.date_from) {
			query = query.gte('created_date', filters.date_from);
		}
		if (filters?.date_to) {
			query = query.lte('created_date', filters.date_to);
		}

		const { data, error } = await query;

		if (error) {
			throw new Error(error.message);
		}

		return data || [];
	}

	/**
	 * Get a single issue by ID
	 */
	static async getIssueById(id: string): Promise<IssueReport | null> {
		const { data, error } = await supabase
			.from('issue_reports')
			.select(
				`
				*,
				reporter:profiles!reporter_id(id, full_name, email, role, position),
				assignee:profiles!assigned_to(id, full_name, email, role, position)
			`
			)
			.eq('id', id)
			.single();

		if (error) {
			if (error.code === 'PGRST116') {
				return null; // No rows returned
			}
			throw new Error(error.message);
		}

		return data;
	}

	/**
	 * Update an issue
	 */
	static async updateIssue(
		id: string,
		updates: UpdateIssueReportData
	): Promise<IssueReport> {
		const updateData: any = {
			...updates,
			updated_date: new Date().toISOString().split('T')[0],
			updated_time: new Date().toTimeString().split(' ')[0],
		};

		// Set resolved date/time if status is being set to resolved
		if (updates.status === 'resolved') {
			updateData.resolved_date = new Date().toISOString().split('T')[0];
			updateData.resolved_time = new Date().toTimeString().split(' ')[0];
		}

		const { data, error } = await supabase
			.from('issue_reports')
			.update(updateData)
			.eq('id', id)
			.select()
			.single();

		if (error) {
			throw new Error(error.message);
		}

		return data;
	}

	/**
	 * Delete an issue (admin only)
	 */
	static async deleteIssue(id: string): Promise<void> {
		const { error } = await supabase
			.from('issue_reports')
			.delete()
			.eq('id', id);

		if (error) {
			throw new Error(error.message);
		}
	}

	/**
	 * Get issues by reporter (for user to see their own issues)
	 */
	static async getMyIssues(userId: string): Promise<IssueReport[]> {
		return this.getIssues({ reporter_id: userId });
	}

	/**
	 * Upload screenshot to Supabase Storage
	 */
	static async uploadScreenshot(file: File, userId: string): Promise<string> {
		const fileExt = file.name.split('.').pop();
		const fileName = `${userId}-${Date.now()}.${fileExt}`;

		// Convert file to buffer
		const bytes = await file.arrayBuffer();
		const buffer = Buffer.from(bytes);

		// Upload to Supabase Storage
		const { data, error } = await supabase.storage
			.from('issue-screenshots')
			.upload(`screenshots/${fileName}`, buffer, {
				contentType: file.type,
				upsert: false,
			});

		if (error) {
			throw new Error(error.message);
		}

		// Get public URL
		const {
			data: { publicUrl },
		} = supabase.storage.from('issue-screenshots').getPublicUrl(data.path);

		return publicUrl;
	}

	/**
	 * Get issue statistics
	 */
	static async getIssueStats(): Promise<{
		total: number;
		open: number;
		in_progress: number;
		resolved: number;
		closed: number;
		byType: Record<string, number>;
		byPriority: Record<string, number>;
	}> {
		const { data, error } = await supabase
			.from('issue_reports')
			.select('status, issue_type, priority');

		if (error) {
			throw new Error(error.message);
		}

		const issues = data || [];

		const stats = {
			total: issues.length,
			open: issues.filter((i) => i.status === 'open').length,
			in_progress: issues.filter((i) => i.status === 'in_progress')
				.length,
			resolved: issues.filter((i) => i.status === 'resolved').length,
			closed: issues.filter((i) => i.status === 'closed').length,
			byType: {} as Record<string, number>,
			byPriority: {} as Record<string, number>,
		};

		// Count by type
		issues.forEach((issue) => {
			stats.byType[issue.issue_type] =
				(stats.byType[issue.issue_type] || 0) + 1;
		});

		// Count by priority
		issues.forEach((issue) => {
			stats.byPriority[issue.priority] =
				(stats.byPriority[issue.priority] || 0) + 1;
		});

		return stats;
	}
}

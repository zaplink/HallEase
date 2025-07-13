export interface IssueReport {
	id: string;
	issue_type: 'booking' | 'technical' | 'other';
	title?: string;
	description: string;
	screenshot_url?: string;
	status: 'open' | 'in_progress' | 'resolved' | 'closed';
	priority: 'low' | 'medium' | 'high' | 'critical';
	reporter_id: string;
	assigned_to?: string;
	created_date: string;
	created_time: string;
	updated_date?: string;
	updated_time?: string;
	resolved_date?: string;
	resolved_time?: string;
	resolution_notes?: string;

	// Joined data
	reporter?: {
		id: string;
		full_name: string;
		email: string;
		role: string;
		position?: string;
	};
	assignee?: {
		id: string;
		full_name: string;
		email: string;
		role: string;
		position?: string;
	};
}

export interface CreateIssueReportData {
	issueType: 'booking' | 'technical' | 'other';
	title?: string;
	description: string;
	screenshot?: File;
}

export interface UpdateIssueReportData {
	status?: 'open' | 'in_progress' | 'resolved' | 'closed';
	priority?: 'low' | 'medium' | 'high' | 'critical';
	assigned_to?: string;
	resolution_notes?: string;
}

export interface IssueReportFilters {
	status?: string;
	priority?: string;
	issue_type?: string;
	assigned_to?: string;
	reporter_id?: string;
	date_from?: string;
	date_to?: string;
}

export const ISSUE_TYPES = {
	booking: 'Booking Problem',
	technical: 'Technical Issue',
	other: 'Other',
} as const;

export const ISSUE_STATUSES = {
	open: 'Open',
	in_progress: 'In Progress',
	resolved: 'Resolved',
	closed: 'Closed',
} as const;

export const ISSUE_PRIORITIES = {
	low: 'Low',
	medium: 'Medium',
	high: 'High',
	critical: 'Critical',
} as const;

export const PRIORITY_COLORS = {
	low: 'bg-gray-100 text-gray-800',
	medium: 'bg-blue-100 text-blue-800',
	high: 'bg-yellow-100 text-yellow-800',
	critical: 'bg-red-100 text-red-800',
} as const;

export const STATUS_COLORS = {
	open: 'bg-gray-100 text-gray-800',
	in_progress: 'bg-blue-100 text-blue-800',
	resolved: 'bg-green-100 text-green-800',
	closed: 'bg-purple-100 text-purple-800',
} as const;

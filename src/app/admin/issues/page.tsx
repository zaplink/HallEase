'use client';

import React, { useState, useEffect } from 'react';
import SidebarLayout from '@/layouts/Sidebar/Layout';
import { createClient } from '@/lib/supabaseClient';
import {
	IssueReport,
	ISSUE_TYPES,
	ISSUE_STATUSES,
	ISSUE_PRIORITIES,
	PRIORITY_COLORS,
	STATUS_COLORS,
} from '@/types/issue-reports';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {
	AlertTriangle,
	Bug,
	HelpCircle,
	Calendar,
	User,
	ExternalLink,
	Filter,
	RefreshCw,
	Search,
} from 'lucide-react';
import { toast } from 'sonner';

const supabase = createClient();

const getIssueIcon = (type: string) => {
	switch (type) {
		case 'booking':
			return <Calendar className='w-4 h-4' />;
		case 'technical':
			return <Bug className='w-4 h-4' />;
		case 'other':
			return <HelpCircle className='w-4 h-4' />;
		default:
			return <AlertTriangle className='w-4 h-4' />;
	}
};

export default function IssueManagementPage() {
	const [issues, setIssues] = useState<IssueReport[]>([]);
	const [loading, setLoading] = useState(true);
	const [filters, setFilters] = useState({
		status: '',
		priority: '',
		issue_type: '',
		search: '',
	});

	useEffect(() => {
		fetchIssues();
	}, []);

	const fetchIssues = async () => {
		try {
			setLoading(true);

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
			if (filters.status) {
				query = query.eq('status', filters.status);
			}
			if (filters.priority) {
				query = query.eq('priority', filters.priority);
			}
			if (filters.issue_type) {
				query = query.eq('issue_type', filters.issue_type);
			}

			const { data, error } = await query;

			if (error) {
				console.error('Error fetching issues:', error);
				toast.error('Failed to load issues');
				return;
			}

			let filteredData = data || [];

			// Apply text search filter
			if (filters.search) {
				const searchLower = filters.search.toLowerCase();
				filteredData = filteredData.filter(
					(issue) =>
						issue.title?.toLowerCase().includes(searchLower) ||
						issue.description.toLowerCase().includes(searchLower) ||
						issue.reporter?.full_name
							?.toLowerCase()
							.includes(searchLower)
				);
			}

			setIssues(filteredData);
		} catch (error) {
			console.error('Error:', error);
			toast.error('Failed to load issues');
		} finally {
			setLoading(false);
		}
	};

	const updateIssueStatus = async (issueId: string, newStatus: string) => {
		try {
			const { error } = await supabase
				.from('issue_reports')
				.update({
					status: newStatus,
					updated_date: new Date().toISOString().split('T')[0],
					updated_time: new Date().toTimeString().split(' ')[0],
				})
				.eq('id', issueId);

			if (error) {
				console.error('Error updating issue:', error);
				toast.error('Failed to update issue status');
				return;
			}

			toast.success('Issue status updated');
			fetchIssues(); // Refresh the list
		} catch (error) {
			console.error('Error:', error);
			toast.error('Failed to update issue status');
		}
	};

	const handleFilterChange = (key: string, value: string) => {
		setFilters((prev) => ({ ...prev, [key]: value }));
	};

	useEffect(() => {
		const timeoutId = setTimeout(() => {
			fetchIssues();
		}, 300);

		return () => clearTimeout(timeoutId);
	}, [filters]);

	const getStats = () => {
		const total = issues.length;
		const open = issues.filter((i) => i.status === 'open').length;
		const inProgress = issues.filter(
			(i) => i.status === 'in_progress'
		).length;
		const resolved = issues.filter((i) => i.status === 'resolved').length;

		return { total, open, inProgress, resolved };
	};

	const stats = getStats();

	return (
		<SidebarLayout>
			<div className='p-6 bg-gray-50 min-h-screen'>
				<div className='max-w-7xl mx-auto'>
					<div className='flex justify-between items-center mb-6'>
						<div>
							<h1 className='text-2xl font-bold text-gray-900'>
								Issue Management
							</h1>
							<p className='text-gray-600'>
								Manage and track user-reported issues
							</p>
						</div>
						<Button
							onClick={() => fetchIssues()}
							disabled={loading}
						>
							<RefreshCw
								className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`}
							/>
							Refresh
						</Button>
					</div>

					{/* Stats Cards */}
					<div className='grid grid-cols-1 md:grid-cols-4 gap-4 mb-6'>
						<Card>
							<CardContent className='p-4'>
								<div className='flex items-center justify-between'>
									<div>
										<p className='text-sm font-medium text-gray-600'>
											Total Issues
										</p>
										<p className='text-2xl font-bold'>
											{stats.total}
										</p>
									</div>
									<AlertTriangle className='h-8 w-8 text-gray-400' />
								</div>
							</CardContent>
						</Card>
						<Card>
							<CardContent className='p-4'>
								<div className='flex items-center justify-between'>
									<div>
										<p className='text-sm font-medium text-gray-600'>
											Open
										</p>
										<p className='text-2xl font-bold text-red-600'>
											{stats.open}
										</p>
									</div>
									<div className='h-8 w-8 bg-red-100 rounded-full flex items-center justify-center'>
										<span className='text-red-600 text-sm font-bold'>
											{stats.open}
										</span>
									</div>
								</div>
							</CardContent>
						</Card>
						<Card>
							<CardContent className='p-4'>
								<div className='flex items-center justify-between'>
									<div>
										<p className='text-sm font-medium text-gray-600'>
											In Progress
										</p>
										<p className='text-2xl font-bold text-blue-600'>
											{stats.inProgress}
										</p>
									</div>
									<div className='h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center'>
										<span className='text-blue-600 text-sm font-bold'>
											{stats.inProgress}
										</span>
									</div>
								</div>
							</CardContent>
						</Card>
						<Card>
							<CardContent className='p-4'>
								<div className='flex items-center justify-between'>
									<div>
										<p className='text-sm font-medium text-gray-600'>
											Resolved
										</p>
										<p className='text-2xl font-bold text-green-600'>
											{stats.resolved}
										</p>
									</div>
									<div className='h-8 w-8 bg-green-100 rounded-full flex items-center justify-center'>
										<span className='text-green-600 text-sm font-bold'>
											{stats.resolved}
										</span>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Filters */}
					<Card className='mb-6'>
						<CardHeader>
							<CardTitle className='flex items-center'>
								<Filter className='w-4 h-4 mr-2' />
								Filters
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
								<div>
									<label className='text-sm font-medium text-gray-700 mb-1 block'>
										Search
									</label>
									<div className='relative'>
										<Search className='absolute left-3 top-3 h-4 w-4 text-gray-400' />
										<Input
											placeholder='Search issues...'
											value={filters.search}
											onChange={(e) =>
												handleFilterChange(
													'search',
													e.target.value
												)
											}
											className='pl-10'
										/>
									</div>
								</div>
								<div>
									<label className='text-sm font-medium text-gray-700 mb-1 block'>
										Status
									</label>
									<Select
										value={filters.status || 'all'}
										onValueChange={(value) =>
											handleFilterChange(
												'status',
												value === 'all' ? '' : value
											)
										}
									>
										<SelectTrigger>
											<SelectValue placeholder='All statuses' />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value='all'>
												All statuses
											</SelectItem>
											{Object.entries(ISSUE_STATUSES).map(
												([key, label]) => (
													<SelectItem
														key={key}
														value={key}
													>
														{label}
													</SelectItem>
												)
											)}
										</SelectContent>
									</Select>
								</div>
								<div>
									<label className='text-sm font-medium text-gray-700 mb-1 block'>
										Priority
									</label>
									<Select
										value={filters.priority || 'all'}
										onValueChange={(value) =>
											handleFilterChange(
												'priority',
												value === 'all' ? '' : value
											)
										}
									>
										<SelectTrigger>
											<SelectValue placeholder='All priorities' />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value='all'>
												All priorities
											</SelectItem>
											{Object.entries(
												ISSUE_PRIORITIES
											).map(([key, label]) => (
												<SelectItem
													key={key}
													value={key}
												>
													{label}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
								<div>
									<label className='text-sm font-medium text-gray-700 mb-1 block'>
										Type
									</label>
									<Select
										value={filters.issue_type || 'all'}
										onValueChange={(value) =>
											handleFilterChange(
												'issue_type',
												value === 'all' ? '' : value
											)
										}
									>
										<SelectTrigger>
											<SelectValue placeholder='All types' />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value='all'>
												All types
											</SelectItem>
											{Object.entries(ISSUE_TYPES).map(
												([key, label]) => (
													<SelectItem
														key={key}
														value={key}
													>
														{label}
													</SelectItem>
												)
											)}
										</SelectContent>
									</Select>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Issues List */}
					<div className='space-y-4'>
						{loading ? (
							<div className='text-center py-8'>
								<RefreshCw className='w-8 h-8 animate-spin mx-auto mb-2 text-gray-400' />
								<p className='text-gray-600'>
									Loading issues...
								</p>
							</div>
						) : issues.length === 0 ? (
							<Card>
								<CardContent className='p-8 text-center'>
									<AlertTriangle className='w-12 h-12 mx-auto mb-4 text-gray-400' />
									<h3 className='text-lg font-medium text-gray-900 mb-2'>
										No Issues Found
									</h3>
									<p className='text-gray-600'>
										No issues match your current filters.
									</p>
								</CardContent>
							</Card>
						) : (
							issues.map((issue) => (
								<Card
									key={issue.id}
									className='hover:shadow-md transition-shadow'
								>
									<CardContent className='p-6'>
										<div className='flex items-start justify-between'>
											<div className='flex-1'>
												<div className='flex items-center gap-2 mb-2'>
													{getIssueIcon(
														issue.issue_type
													)}
													<h3 className='font-semibold text-gray-900'>
														{issue.title ||
															`${ISSUE_TYPES[issue.issue_type]} Report`}
													</h3>
													<Badge
														className={
															STATUS_COLORS[
																issue.status
															]
														}
													>
														{
															ISSUE_STATUSES[
																issue.status
															]
														}
													</Badge>
													<Badge
														className={
															PRIORITY_COLORS[
																issue.priority
															]
														}
													>
														{
															ISSUE_PRIORITIES[
																issue.priority
															]
														}
													</Badge>
												</div>

												<p className='text-gray-700 mb-3 line-clamp-2'>
													{issue.description}
												</p>

												<div className='flex items-center gap-4 text-sm text-gray-500'>
													<div className='flex items-center gap-1'>
														<User className='w-4 h-4' />
														{issue.reporter
															?.full_name ||
															'Unknown User'}
													</div>
													<div className='flex items-center gap-1'>
														<Calendar className='w-4 h-4' />
														{new Date(
															`${issue.created_date}T${issue.created_time}`
														).toLocaleString()}
													</div>
													{issue.screenshot_url && (
														<a
															href={
																issue.screenshot_url
															}
															target='_blank'
															rel='noopener noreferrer'
															className='flex items-center gap-1 text-blue-600 hover:text-blue-800'
														>
															<ExternalLink className='w-4 h-4' />
															Screenshot
														</a>
													)}
												</div>
											</div>

											<div className='flex gap-2 ml-4'>
												{issue.status === 'open' && (
													<Button
														size='sm'
														variant='outline'
														onClick={() =>
															updateIssueStatus(
																issue.id,
																'in_progress'
															)
														}
													>
														Start Working
													</Button>
												)}
												{issue.status ===
													'in_progress' && (
													<Button
														size='sm'
														variant='outline'
														onClick={() =>
															updateIssueStatus(
																issue.id,
																'resolved'
															)
														}
													>
														Mark Resolved
													</Button>
												)}
												{issue.status ===
													'resolved' && (
													<Button
														size='sm'
														variant='outline'
														onClick={() =>
															updateIssueStatus(
																issue.id,
																'closed'
															)
														}
													>
														Close
													</Button>
												)}
											</div>
										</div>
									</CardContent>
								</Card>
							))
						)}
					</div>
				</div>
			</div>
		</SidebarLayout>
	);
}

'use client';

import React, { useState, useEffect } from 'react';
import SidebarLayout from '@/layouts/Sidebar/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DebugReportsService } from '@/lib/debug-reports';
import { ReportsService } from '@/lib/reports';
import { toast } from 'sonner';
import {
	FileText,
	Clock,
	CheckCircle,
	XCircle,
	AlertCircle,
	Loader2,
	Bug,
} from 'lucide-react';

const STATUS_COLORS = {
	pending: 'bg-yellow-100 text-yellow-800',
	approved: 'bg-green-100 text-green-800',
	waiting: 'bg-blue-100 text-blue-800',
	rejected: 'bg-red-100 text-red-800',
};

const STATUS_ICONS = {
	pending: Clock,
	approved: CheckCircle,
	waiting: AlertCircle,
	rejected: XCircle,
};

const TYPE_COLORS = {
	event: 'bg-purple-100 text-purple-800',
	extra_lecture: 'bg-indigo-100 text-indigo-800',
};

export default function ReportsDebugPage() {
	const [debugInfo, setDebugInfo] = useState<any>(null);
	const [metrics, setMetrics] = useState<any>(null);
	const [reports, setReports] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const [showDebug, setShowDebug] = useState(false);

	const runDebugTest = async () => {
		try {
			setLoading(true);
			const debug = await DebugReportsService.testConnection();
			setDebugInfo(debug);
			console.log('Debug info:', debug);
		} catch (error) {
			console.error('Debug test failed:', error);
			toast.error('Debug test failed');
		} finally {
			setLoading(false);
		}
	};

	const loadBasicData = async () => {
		try {
			setLoading(true);
			const [metricsData, reportsData] = await Promise.all([
				DebugReportsService.getBasicMetrics(),
				DebugReportsService.getBasicReports(),
			]);
			setMetrics(metricsData);
			setReports(reportsData);
			console.log('Loaded metrics:', metricsData);
			console.log('Loaded reports:', reportsData);
		} catch (error) {
			console.error('Error loading basic data:', error);
			const errorMessage =
				error instanceof Error ? error.message : 'Unknown error';
			toast.error('Failed to load data: ' + errorMessage);
		} finally {
			setLoading(false);
		}
	};

	const loadFullData = async () => {
		try {
			setLoading(true);
			const [metricsData, reportsData] = await Promise.all([
				ReportsService.getReportMetrics(),
				ReportsService.getDetailedReports(),
			]);
			setMetrics(metricsData);
			setReports(reportsData);
			console.log('Loaded full metrics:', metricsData);
			console.log('Loaded full reports:', reportsData);
		} catch (error) {
			console.error('Error loading full data:', error);
			const errorMessage =
				error instanceof Error ? error.message : 'Unknown error';
			toast.error('Failed to load full data: ' + errorMessage);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		loadBasicData();
	}, []);

	const formatDate = (date: string) => {
		return new Date(date).toLocaleDateString();
	};

	const formatTime = (time: string) => {
		return time?.slice(0, 5) || 'N/A'; // HH:MM format
	};

	return (
		<SidebarLayout>
			<div className='p-6 space-y-6'>
				{/* Header */}
				<div className='flex justify-between items-center'>
					<div>
						<h1 className='text-3xl font-bold text-gray-900'>
							Reports Dashboard (Debug Mode)
						</h1>
						<p className='text-gray-600 mt-1'>
							Debug and test reports functionality
						</p>
					</div>
					<div className='flex gap-2'>
						<Button
							variant='outline'
							onClick={() => setShowDebug(!showDebug)}
							className='flex items-center gap-2'
						>
							<Bug className='w-4 h-4' />
							{showDebug ? 'Hide Debug' : 'Show Debug'}
						</Button>
						<Button
							onClick={runDebugTest}
							disabled={loading}
							className='flex items-center gap-2'
						>
							{loading ? (
								<Loader2 className='w-4 h-4 animate-spin' />
							) : (
								<Bug className='w-4 h-4' />
							)}
							Run Debug Test
						</Button>
						<Button
							onClick={loadBasicData}
							disabled={loading}
							variant='outline'
						>
							Load Basic Data
						</Button>
						<Button
							onClick={loadFullData}
							disabled={loading}
							variant='outline'
						>
							Load Full Data
						</Button>
					</div>
				</div>

				{/* Debug Info */}
				{showDebug && debugInfo && (
					<Card>
						<CardHeader>
							<CardTitle>Debug Information</CardTitle>
						</CardHeader>
						<CardContent>
							<pre className='bg-gray-100 p-4 rounded-lg overflow-auto text-sm'>
								{JSON.stringify(debugInfo, null, 2)}
							</pre>
						</CardContent>
					</Card>
				)}

				{/* Loading State */}
				{loading && (
					<div className='flex items-center justify-center py-12'>
						<div className='flex items-center gap-2'>
							<Loader2 className='w-6 h-6 animate-spin' />
							<span>Loading reports...</span>
						</div>
					</div>
				)}

				{/* Metrics Overview */}
				{metrics && (
					<div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
						<Card>
							<CardContent className='p-6'>
								<div className='flex items-center justify-between'>
									<div>
										<p className='text-sm font-medium text-gray-600'>
											Total Reports
										</p>
										<p className='text-2xl font-bold text-gray-900'>
											{metrics.totalReports}
										</p>
									</div>
									<FileText className='w-8 h-8 text-blue-600' />
								</div>
							</CardContent>
						</Card>
						<Card>
							<CardContent className='p-6'>
								<div className='flex items-center justify-between'>
									<div>
										<p className='text-sm font-medium text-gray-600'>
											Pending
										</p>
										<p className='text-2xl font-bold text-yellow-600'>
											{metrics.pendingReports}
										</p>
									</div>
									<Clock className='w-8 h-8 text-yellow-600' />
								</div>
							</CardContent>
						</Card>
						<Card>
							<CardContent className='p-6'>
								<div className='flex items-center justify-between'>
									<div>
										<p className='text-sm font-medium text-gray-600'>
											Approved
										</p>
										<p className='text-2xl font-bold text-green-600'>
											{metrics.approvedReports}
										</p>
									</div>
									<CheckCircle className='w-8 h-8 text-green-600' />
								</div>
							</CardContent>
						</Card>
						<Card>
							<CardContent className='p-6'>
								<div className='flex items-center justify-between'>
									<div>
										<p className='text-sm font-medium text-gray-600'>
											Rejected
										</p>
										<p className='text-2xl font-bold text-red-600'>
											{metrics.rejectedReports}
										</p>
									</div>
									<XCircle className='w-8 h-8 text-red-600' />
								</div>
							</CardContent>
						</Card>
					</div>
				)}

				{/* Basic Reports Table */}
				{reports && reports.length > 0 && (
					<Card>
						<CardHeader>
							<CardTitle className='flex items-center gap-2'>
								<FileText className='w-5 h-5' />
								Reports ({reports.length})
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className='overflow-x-auto'>
								<table className='w-full'>
									<thead>
										<tr className='border-b'>
											<th className='text-left p-2'>
												ID
											</th>
											<th className='text-left p-2'>
												Type
											</th>
											<th className='text-left p-2'>
												Date & Time
											</th>
											<th className='text-left p-2'>
												Status
											</th>
											<th className='text-left p-2'>
												Created
											</th>
											<th className='text-left p-2'>
												Hall Option
											</th>
										</tr>
									</thead>
									<tbody>
										{reports.map((report) => {
											const StatusIcon =
												STATUS_ICONS[
													report.status as keyof typeof STATUS_ICONS
												] || Clock;
											return (
												<tr
													key={report.id}
													className='border-b hover:bg-gray-50'
												>
													<td className='p-2'>
														<span className='text-sm font-mono'>
															{report.id.slice(
																0,
																8
															)}
															...
														</span>
													</td>
													<td className='p-2'>
														<Badge
															className={
																TYPE_COLORS[
																	report.type as keyof typeof TYPE_COLORS
																] ||
																'bg-gray-100 text-gray-800'
															}
														>
															{report.type ===
															'extra_lecture'
																? 'Extra Lecture'
																: 'Event'}
														</Badge>
													</td>
													<td className='p-2'>
														<div>
															<div>
																{formatDate(
																	report.date
																)}
															</div>
															<div className='text-sm text-gray-600'>
																{formatTime(
																	report.start_time
																)}{' '}
																-{' '}
																{formatTime(
																	report.end_time
																)}
															</div>
														</div>
													</td>
													<td className='p-2'>
														<Badge
															className={
																STATUS_COLORS[
																	report.status as keyof typeof STATUS_COLORS
																] ||
																'bg-gray-100 text-gray-800'
															}
														>
															<StatusIcon className='w-3 h-3 mr-1' />
															{report.status}
														</Badge>
													</td>
													<td className='p-2'>
														<div className='text-sm text-gray-600'>
															{formatDate(
																report.created_date
															)}
														</div>
													</td>
													<td className='p-2'>
														<Badge variant='outline'>
															{report.hall_option}
														</Badge>
													</td>
												</tr>
											);
										})}
									</tbody>
								</table>
							</div>
						</CardContent>
					</Card>
				)}

				{/* No Data State */}
				{!loading && (!reports || reports.length === 0) && (
					<Card>
						<CardContent className='p-8 text-center'>
							<FileText className='w-12 h-12 text-gray-400 mx-auto mb-4' />
							<h3 className='text-lg font-medium text-gray-900 mb-2'>
								No Reports Found
							</h3>
							<p className='text-gray-600 mb-4'>
								There are no submitted reservation reports in
								the database yet.
							</p>
							<Button onClick={loadBasicData}>
								Refresh Data
							</Button>
						</CardContent>
					</Card>
				)}
			</div>
		</SidebarLayout>
	);
}

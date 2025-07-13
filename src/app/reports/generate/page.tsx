'use client';

import React, { useState, useEffect } from 'react';
import SidebarLayout from '@/layouts/Sidebar/Layout';
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
	Calendar,
	Download,
	FileSpreadsheet,
	Loader2,
	BarChart3,
} from 'lucide-react';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabaseClient';
import * as XLSX from 'xlsx';

// Types
interface Hall {
	id: string;
	code: string;
	type: string;
	capacity: number;
	building: string;
	floor: number;
	is_available: boolean;
}

interface ReservationData {
	id: string;
	date: string;
	start_time: string;
	end_time: string;
	status: string;
	type: 'event' | 'extra_lecture' | 'general_lecture';
	name: string;
	booker_name?: string;
	attendee_count?: number;
	duration_hours: number;
}

interface UsageReport {
	hall: Hall;
	period: string;
	periodLabel: string;
	fromDate: string;
	toDate: string;
	totalReservations: number;
	totalHours: number;
	utilizationRate: number;
	eventCount: number;
	lectureCount: number;
	generalLectureCount: number;
	averageAttendees: number;
	peakUsageDays: string[];
	reservations: ReservationData[];
}

// Time period options
const TIME_PERIODS = [
	{ value: '1week', label: '1 Week', days: 7 },
	{ value: '2weeks', label: '2 Weeks', days: 14 },
	{ value: '1month', label: '1 Month', days: 30 },
	{ value: '2months', label: '2 Months', days: 60 },
	{ value: '3months', label: '3 Months', days: 90 },
	{ value: '6months', label: '6 Months', days: 180 },
	{ value: '1year', label: '1 Year', days: 365 },
];

// Hall type mapping
const HALL_TYPE_MAP: Record<string, string> = {
	EW: 'Engineering Workshop',
	LCH: 'Lecture Hall',
	CMP: 'Computer Lab',
	'CMP-VR': 'Computer Lab - VR',
	'CMP-MAIN': 'Computer Lab - Main',
	'CMP-MAT': 'Computer Lab - Material',
	'CMP-DAT': 'Computer Lab - Data Science',
	ELP: 'Chemistry Lab',
	ML: 'Mechanical Lab',
};

export default function GenerateReportPage() {
	const [halls, setHalls] = useState<Hall[]>([]);
	const [selectedHall, setSelectedHall] = useState<string>('');
	const [selectedPeriod, setSelectedPeriod] = useState<string>('1month');
	const [useCustomDates, setUseCustomDates] = useState<boolean>(false);
	const [fromDate, setFromDate] = useState<string>('');
	const [toDate, setToDate] = useState<string>('');
	const [loading, setLoading] = useState(false);
	const [loadingHalls, setLoadingHalls] = useState(true);
	const [report, setReport] = useState<UsageReport | null>(null);
	const [generating, setGenerating] = useState(false);

	// Set default dates (last 30 days)
	useEffect(() => {
		const today = new Date();
		const thirtyDaysAgo = new Date();
		thirtyDaysAgo.setDate(today.getDate() - 30);

		setToDate(today.toISOString().split('T')[0]);
		setFromDate(thirtyDaysAgo.toISOString().split('T')[0]);
	}, []);

	// Fetch halls on component mount
	useEffect(() => {
		fetchHalls();
	}, []);

	const fetchHalls = async () => {
		try {
			const supabase = createClient();
			const { data, error } = await supabase
				.from('hall')
				.select('*')
				.order('code');

			if (error) throw error;
			setHalls(data || []);
		} catch (error) {
			console.error('Error fetching halls:', error);
			toast.error('Failed to load halls');
		} finally {
			setLoadingHalls(false);
		}
	};

	// Calculate date range based on selected period or custom dates
	const getDateRange = () => {
		if (useCustomDates) {
			const startDate = new Date(fromDate);
			const endDate = new Date(toDate);
			const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
			const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

			return {
				start: fromDate,
				end: toDate,
				days: diffDays,
			};
		} else {
			const period = TIME_PERIODS.find((p) => p.value === selectedPeriod);
			const endDate = new Date();
			const startDate = new Date();
			startDate.setDate(endDate.getDate() - (period?.days || 30));

			return {
				start: startDate.toISOString().split('T')[0],
				end: endDate.toISOString().split('T')[0],
				days: period?.days || 30,
			};
		}
	};

	// Calculate time difference in hours
	const calculateDuration = (startTime: string, endTime: string): number => {
		const start = new Date(`1970-01-01T${startTime}`);
		const end = new Date(`1970-01-01T${endTime}`);
		return (end.getTime() - start.getTime()) / (1000 * 60 * 60);
	};

	// Generate recurring general lectures for the time period
	const generateRecurringGeneralLectures = async (
		hallId: string,
		dateRange: { start: string; end: string }
	): Promise<ReservationData[]> => {
		try {
			const supabase = createClient();

			// Fetch general lectures scheduled for this hall
			const { data: generalLectures, error } = await supabase
				.from('general_lecture')
				.select(
					`
					id,
					day,
					start_time,
					end_time,
					course_id,
					course:course_id (
						char,
						digit,
						name
					)
				`
				)
				.eq('hall_id', hallId);

			if (error) {
				console.log(
					'General lecture table not found or no data:',
					error
				);
				return [];
			}

			if (!generalLectures || generalLectures.length === 0) {
				console.log('No general lectures found for hall:', hallId);
				return [];
			}

			console.log(
				`Found ${generalLectures.length} general lecture schedules for hall`
			);

			const recurringLectures: ReservationData[] = [];
			const startDate = new Date(dateRange.start);
			const endDate = new Date(dateRange.end);

			// Day mapping
			const dayMap: Record<string, number> = {
				SUNDAY: 0,
				MONDAY: 1,
				TUESDAY: 2,
				WEDNESDAY: 3,
				THURSDAY: 4,
				FRIDAY: 5,
				SATURDAY: 6,
			};

			// For each general lecture schedule
			generalLectures.forEach((lecture) => {
				const lectureDayNumber = dayMap[lecture.day.toUpperCase()];
				if (lectureDayNumber === undefined) return;

				// Find all occurrences of this day in the date range
				for (
					let currentDate = new Date(startDate);
					currentDate <= endDate;
					currentDate.setDate(currentDate.getDate() + 1)
				) {
					if (currentDate.getDay() === lectureDayNumber) {
						const course = Array.isArray(lecture.course)
							? lecture.course[0]
							: lecture.course;
						const courseName = course
							? `${course.char} ${course.digit} - ${course.name}`
							: 'General Lecture';

						recurringLectures.push({
							id: `gl_${lecture.id}_${currentDate.toISOString().split('T')[0]}`,
							date: currentDate.toISOString().split('T')[0],
							start_time: lecture.start_time,
							end_time: lecture.end_time,
							status: 'approved',
							type: 'general_lecture',
							name: courseName,
							booker_name: 'Academic Department',
							attendee_count: 0, // General lectures don't have specific attendee counts
							duration_hours: calculateDuration(
								lecture.start_time,
								lecture.end_time
							),
						});
					}
				}
			});

			console.log(
				`Generated ${recurringLectures.length} recurring general lecture instances`
			);
			return recurringLectures;
		} catch (error) {
			console.error(
				'Error generating recurring general lectures:',
				error
			);
			return [];
		}
	};

	// Fetch reservation data for the selected hall and period
	const fetchReservationData = async (
		hallId: string,
		dateRange: { start: string; end: string }
	) => {
		try {
			const supabase = createClient();

			console.log(
				'Fetching reservation data for hall:',
				hallId,
				'from',
				dateRange.start,
				'to',
				dateRange.end
			);

			// First, get hall assignments for the selected hall
			const { data: assignments, error: assignError } = await supabase
				.from('hall_assign')
				.select('reserve_id')
				.eq('hall_id', hallId);

			if (assignError) {
				console.error('Error fetching hall assignments:', assignError);
				throw assignError;
			}

			if (!assignments || assignments.length === 0) {
				console.log('No hall assignments found for hall:', hallId);
				return [];
			}

			console.log(`Found ${assignments.length} hall assignments`);

			const reserveIds = assignments.map((a) => a.reserve_id);

			// Get reserve data for these assignments within the date range
			const { data: reserveData, error: reserveError } = await supabase
				.from('reserve')
				.select(
					`
					id,
					date,
					start_time,
					end_time,
					status,
					type,
					profile_id
				`
				)
				.in('id', reserveIds)
				.gte('date', dateRange.start)
				.lte('date', dateRange.end)
				.eq('status', 'approved');

			if (reserveError) {
				console.error('Error fetching reserve data:', reserveError);
				throw reserveError;
			}

			console.log(
				`Found ${reserveData?.length || 0} approved reservations in date range`
			);

			if (!reserveData || reserveData.length === 0) {
				return [];
			}

			// Get profile data for bookers
			const profileIds = reserveData
				.map((r) => r.profile_id)
				.filter(Boolean);
			let profileData: Array<{ id: string; full_name: string }> = [];
			if (profileIds.length > 0) {
				const { data: profiles } = await supabase
					.from('profiles')
					.select('id, full_name')
					.in('id', profileIds);
				profileData = profiles || [];
			}

			// Get event and lecture details
			const finalReserveIds = reserveData.map((r) => r.id);

			// Fetch extra lectures
			const { data: extraLectures, error: lectureError } = await supabase
				.from('extra_lecture')
				.select('attendee_count, reserve_id, course_id')
				.in('reserve_id', finalReserveIds);

			if (lectureError) {
				console.error('Error fetching extra lectures:', lectureError);
			}

			// Fetch events
			const { data: events, error: eventError } = await supabase
				.from('event')
				.select('name, attendee_count, reserve_id')
				.in('reserve_id', finalReserveIds);

			if (eventError) {
				console.error('Error fetching events:', eventError);
			}

			// Create lookup maps
			const profileMap = new Map(
				profileData.map((p) => [p.id, p.full_name])
			);
			const lectureMap = new Map(
				(extraLectures || []).map((l) => [l.reserve_id, l])
			);
			const eventMap = new Map(
				(events || []).map((e) => [e.reserve_id, e])
			);

			// Map to ReservationData format
			const reservations: ReservationData[] = reserveData.map(
				(reserve) => {
					const lecture = lectureMap.get(reserve.id);
					const event = eventMap.get(reserve.id);
					const attendeeCount =
						lecture?.attendee_count || event?.attendee_count || 0;

					let name = 'Unknown';
					if (event?.name) {
						name = event.name;
					} else if (reserve.type === 'extra_lecture') {
						name = `Extra Lecture (Course ID: ${lecture?.course_id || 'N/A'})`;
					} else {
						name = `${reserve.type} Reservation`;
					}

					return {
						id: reserve.id,
						date: reserve.date,
						start_time: reserve.start_time,
						end_time: reserve.end_time,
						status: reserve.status,
						type: reserve.type as
							| 'event'
							| 'extra_lecture'
							| 'general_lecture',
						name,
						booker_name:
							profileMap.get(reserve.profile_id) || 'Unknown',
						attendee_count: attendeeCount,
						duration_hours: calculateDuration(
							reserve.start_time,
							reserve.end_time
						),
					};
				}
			);

			console.log(
				`Successfully processed ${reservations.length} reservations from database`
			);
			return reservations;
		} catch (error) {
			console.error('Error fetching reservation data:', error);
			throw error;
		}
	};

	// Generate the usage report
	const generateReport = async () => {
		if (!selectedHall) {
			toast.error('Please select a hall');
			return;
		}

		if (useCustomDates) {
			if (!fromDate || !toDate) {
				toast.error('Please select both from and to dates');
				return;
			}
			if (new Date(fromDate) > new Date(toDate)) {
				toast.error('From date must be before to date');
				return;
			}
		} else if (!selectedPeriod) {
			toast.error('Please select a time period');
			return;
		}

		setGenerating(true);
		setReport(null);

		try {
			const hall = halls.find((h) => h.id === selectedHall);
			if (!hall) throw new Error('Hall not found');

			const dateRange = getDateRange();
			const periodLabel = useCustomDates
				? `${fromDate} to ${toDate}`
				: TIME_PERIODS.find((p) => p.value === selectedPeriod)?.label ||
					'';

			// Fetch real reservation data
			console.log('Fetching reservation data from database...');
			const realReservations = await fetchReservationData(
				selectedHall,
				dateRange
			);

			// Generate recurring general lectures based on schedule
			console.log('Generating recurring general lectures...');
			const recurringGeneralLectures =
				await generateRecurringGeneralLectures(selectedHall, dateRange);

			// Combine all reservations
			const allReservations = [
				...realReservations,
				...recurringGeneralLectures,
			];

			console.log(
				`Total reservations: ${allReservations.length} (${realReservations.length} real + ${recurringGeneralLectures.length} recurring general lectures)`
			);

			// Calculate statistics
			const totalReservations = allReservations.length;
			const totalHours = allReservations.reduce(
				(sum, r) => sum + r.duration_hours,
				0
			);
			const eventCount = allReservations.filter(
				(r) => r.type === 'event'
			).length;
			const lectureCount = allReservations.filter(
				(r) => r.type === 'extra_lecture'
			).length;
			const generalLectureCount = allReservations.filter(
				(r) => r.type === 'general_lecture'
			).length;

			// Calculate utilization rate (assuming 12 hours per day as maximum usage)
			const maxPossibleHours = dateRange.days * 12;
			const utilizationRate =
				totalHours > 0 ? (totalHours / maxPossibleHours) * 100 : 0;

			// Calculate average attendees
			const reservationsWithAttendees = allReservations.filter(
				(r) => r.attendee_count && r.attendee_count > 0
			);
			const averageAttendees =
				reservationsWithAttendees.length > 0
					? reservationsWithAttendees.reduce(
							(sum, r) => sum + (r.attendee_count || 0),
							0
						) / reservationsWithAttendees.length
					: 0;

			// Find peak usage days
			const usageByDay = allReservations.reduce(
				(acc, r) => {
					const date = r.date;
					acc[date] = (acc[date] || 0) + r.duration_hours;
					return acc;
				},
				{} as Record<string, number>
			);

			const peakUsageDays = Object.entries(usageByDay)
				.sort(([, a], [, b]) => b - a)
				.slice(0, 3)
				.map(([date]) => date);

			const usageReport: UsageReport = {
				hall,
				period: selectedPeriod,
				periodLabel,
				fromDate: dateRange.start,
				toDate: dateRange.end,
				totalReservations,
				totalHours,
				utilizationRate,
				eventCount,
				lectureCount,
				generalLectureCount,
				averageAttendees,
				peakUsageDays,
				reservations: allReservations.sort(
					(a, b) =>
						new Date(a.date).getTime() - new Date(b.date).getTime()
				),
			};

			setReport(usageReport);

			// Success message based on data availability
			if (allReservations.length > 0) {
				const realCount = realReservations.length;
				const recurringCount = recurringGeneralLectures.length;
				toast.success(
					`Report generated! ${realCount} real reservations + ${recurringCount} recurring lectures = ${allReservations.length} total`
				);
			} else {
				toast.success(
					'Report generated - no reservations found in the selected period.'
				);
			}
		} catch (error) {
			console.error('Error generating report:', error);
			let errorMessage = 'Failed to generate report';

			if (error instanceof Error) {
				if (error.message.includes('Database connection failed')) {
					errorMessage =
						'Database connection failed. Please check your connection and try again.';
				} else if (error.message.includes('hall_assign')) {
					errorMessage =
						'Database table structure issue. Please contact system administrator.';
				} else {
					errorMessage = `Error: ${error.message}`;
				}
			}

			toast.error(errorMessage);
		} finally {
			setGenerating(false);
		}
	};

	// Export report to Excel
	const exportToExcel = () => {
		if (!report) return;

		try {
			// Create workbook
			const wb = XLSX.utils.book_new();

			// Summary sheet
			const summaryData = [
				['Hall Usage Report'],
				[''],
				['Hall Information'],
				['Hall Code', report.hall.code],
				[
					'Hall Type',
					HALL_TYPE_MAP[report.hall.type] || report.hall.type,
				],
				['Capacity', report.hall.capacity],
				['Building', report.hall.building],
				['Floor', report.hall.floor],
				[''],
				['Report Period'],
				['Period', report.periodLabel],
				['Start Date', report.fromDate],
				['End Date', report.toDate],
				[''],
				['Usage Statistics'],
				['Total Reservations', report.totalReservations],
				['Total Hours Used', Math.round(report.totalHours * 100) / 100],
				[
					'Utilization Rate',
					`${Math.round(report.utilizationRate * 100) / 100}%`,
				],
				['Events', report.eventCount],
				['Extra Lectures', report.lectureCount],
				['General Lectures', report.generalLectureCount],
				[
					'Average Attendees',
					Math.round(report.averageAttendees * 100) / 100,
				],
				[''],
				['Peak Usage Days'],
				...report.peakUsageDays.map((day) => ['', day]),
			];

			const summaryWs = XLSX.utils.aoa_to_sheet(summaryData);
			XLSX.utils.book_append_sheet(wb, summaryWs, 'Summary');

			// Detailed reservations sheet
			const reservationHeaders = [
				'Date',
				'Start Time',
				'End Time',
				'Duration (Hours)',
				'Type',
				'Name/Course',
				'Booked By',
				'Attendees',
				'Status',
			];

			const reservationData = [
				reservationHeaders,
				...report.reservations.map((r) => [
					r.date,
					r.start_time,
					r.end_time,
					Math.round(r.duration_hours * 100) / 100,
					r.type,
					r.name,
					r.booker_name || '',
					r.attendee_count || '',
					r.status,
				]),
			];

			const reservationWs = XLSX.utils.aoa_to_sheet(reservationData);
			XLSX.utils.book_append_sheet(wb, reservationWs, 'Reservations');

			// Daily usage summary sheet
			const dailyUsage = report.reservations.reduce(
				(acc, r) => {
					const date = r.date;
					if (!acc[date]) {
						acc[date] = {
							date,
							totalHours: 0,
							totalReservations: 0,
							events: 0,
							lectures: 0,
							generalLectures: 0,
						};
					}
					acc[date].totalHours += r.duration_hours;
					acc[date].totalReservations += 1;
					if (r.type === 'event') acc[date].events += 1;
					else if (r.type === 'extra_lecture')
						acc[date].lectures += 1;
					else if (r.type === 'general_lecture')
						acc[date].generalLectures += 1;
					return acc;
				},
				{} as Record<string, any>
			);

			const dailyUsageData = [
				[
					'Date',
					'Total Hours',
					'Total Reservations',
					'Events',
					'Extra Lectures',
					'General Lectures',
				],
				...Object.values(dailyUsage).map((day: any) => [
					day.date,
					Math.round(day.totalHours * 100) / 100,
					day.totalReservations,
					day.events,
					day.lectures,
					day.generalLectures,
				]),
			];

			const dailyUsageWs = XLSX.utils.aoa_to_sheet(dailyUsageData);
			XLSX.utils.book_append_sheet(wb, dailyUsageWs, 'Daily Usage');

			// Generate filename
			const filename = `${report.hall.code}_Usage_Report_${report.fromDate}_to_${report.toDate}_${new Date().toISOString().split('T')[0]}.xlsx`;

			// Save file
			XLSX.writeFile(wb, filename);
			toast.success('Excel report downloaded successfully!');
		} catch (error) {
			console.error('Error exporting to Excel:', error);
			toast.error('Failed to export Excel file');
		}
	};

	if (loadingHalls) {
		return (
			<SidebarLayout>
				<div className='flex items-center justify-center min-h-screen'>
					<div className='flex items-center gap-2'>
						<Loader2 className='w-6 h-6 animate-spin' />
						<span>Loading halls...</span>
					</div>
				</div>
			</SidebarLayout>
		);
	}

	return (
		<SidebarLayout>
			<div className='p-6 space-y-6'>
				{/* Header */}
				<div className='flex justify-between items-center'>
					<div>
						<h1 className='text-3xl font-bold text-gray-900'>
							Generate Hall Usage Report
						</h1>
						<p className='text-gray-600 mt-1'>
							Generate detailed usage reports for hall utilization
							analysis
						</p>
					</div>
				</div>

				{/* Report Configuration */}
				<Card>
					<CardHeader>
						<CardTitle className='flex items-center gap-2'>
							<BarChart3 className='w-5 h-5' />
							Report Configuration
						</CardTitle>
					</CardHeader>
					<CardContent className='space-y-6'>
						<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
							{/* Hall Selection */}
							<div className='space-y-2'>
								<label className='text-sm font-medium text-gray-700'>
									Select Hall
								</label>
								<Select
									value={selectedHall}
									onValueChange={setSelectedHall}
								>
									<SelectTrigger>
										<SelectValue placeholder='Choose a hall...' />
									</SelectTrigger>
									<SelectContent>
										{halls.map((hall) => (
											<SelectItem
												key={hall.id}
												value={hall.id}
											>
												<div className='flex items-center justify-between w-full'>
													<span className='font-medium'>
														{hall.code}
													</span>
													<div className='flex items-center gap-2 ml-4'>
														<Badge
															variant='outline'
															className='text-xs'
														>
															{HALL_TYPE_MAP[
																hall.type
															] || hall.type}
														</Badge>
														<span className='text-xs text-gray-500'>
															Cap: {hall.capacity}
														</span>
													</div>
												</div>
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>

							{/* Date Range Selection Toggle */}
							<div className='space-y-2'>
								<label className='text-sm font-medium text-gray-700'>
									Date Range Options
								</label>
								<div className='flex items-center space-x-4'>
									<label className='flex items-center space-x-2'>
										<input
											type='radio'
											checked={!useCustomDates}
											onChange={() =>
												setUseCustomDates(false)
											}
											className='text-blue-600'
										/>
										<span className='text-sm'>
											Predefined Period
										</span>
									</label>
									<label className='flex items-center space-x-2'>
										<input
											type='radio'
											checked={useCustomDates}
											onChange={() =>
												setUseCustomDates(true)
											}
											className='text-blue-600'
										/>
										<span className='text-sm'>
											Custom Date Range
										</span>
									</label>
								</div>
							</div>
						</div>

						{/* Conditional Period Selection */}
						{!useCustomDates ? (
							<div className='space-y-2'>
								<label className='text-sm font-medium text-gray-700'>
									Time Period
								</label>
								<Select
									value={selectedPeriod}
									onValueChange={setSelectedPeriod}
								>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										{TIME_PERIODS.map((period) => (
											<SelectItem
												key={period.value}
												value={period.value}
											>
												<div className='flex items-center justify-between w-full'>
													<span>{period.label}</span>
													<span className='text-xs text-gray-500 ml-4'>
														({period.days} days)
													</span>
												</div>
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						) : (
							<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
								{/* From Date Selection */}
								<div className='space-y-2'>
									<label className='text-sm font-medium text-gray-700'>
										From Date
									</label>
									<Input
										type='date'
										value={fromDate}
										onChange={(e) =>
											setFromDate(e.target.value)
										}
										max={toDate}
									/>
								</div>

								{/* To Date Selection */}
								<div className='space-y-2'>
									<label className='text-sm font-medium text-gray-700'>
										To Date
									</label>
									<Input
										type='date'
										value={toDate}
										onChange={(e) =>
											setToDate(e.target.value)
										}
										min={fromDate}
									/>
								</div>
							</div>
						)}

						{/* Generate Button */}
						<div className='flex justify-center'>
							<Button
								onClick={generateReport}
								disabled={
									!selectedHall ||
									(!selectedPeriod && !useCustomDates) ||
									(useCustomDates &&
										(!fromDate || !toDate)) ||
									generating
								}
								className='px-8'
							>
								{generating ? (
									<>
										<Loader2 className='w-4 h-4 mr-2 animate-spin' />
										Generating Report...
									</>
								) : (
									<>
										<FileSpreadsheet className='w-4 h-4 mr-2' />
										Generate Report
									</>
								)}
							</Button>
						</div>
					</CardContent>
				</Card>

				{/* Report Results */}
				{report && (
					<Card>
						<CardHeader>
							<div className='flex justify-between items-center'>
								<CardTitle className='flex items-center gap-2'>
									<Calendar className='w-5 h-5' />
									Usage Report: {report.hall.code}
								</CardTitle>
								<Button
									onClick={exportToExcel}
									className='bg-green-600 hover:bg-green-700'
								>
									<Download className='w-4 h-4 mr-2' />
									Download Excel
								</Button>
							</div>
						</CardHeader>
						<CardContent className='space-y-6'>
							{/* Summary Stats */}
							<div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
								<div className='bg-blue-50 p-4 rounded-lg'>
									<div className='text-2xl font-bold text-blue-600'>
										{report.totalReservations}
									</div>
									<div className='text-sm text-blue-800'>
										Total Reservations
									</div>
								</div>
								<div className='bg-green-50 p-4 rounded-lg'>
									<div className='text-2xl font-bold text-green-600'>
										{Math.round(report.totalHours * 10) /
											10}
										h
									</div>
									<div className='text-sm text-green-800'>
										Total Hours Used
									</div>
								</div>
								<div className='bg-purple-50 p-4 rounded-lg'>
									<div className='text-2xl font-bold text-purple-600'>
										{Math.round(
											report.utilizationRate * 10
										) / 10}
										%
									</div>
									<div className='text-sm text-purple-800'>
										Utilization Rate
									</div>
								</div>
								<div className='bg-orange-50 p-4 rounded-lg'>
									<div className='text-2xl font-bold text-orange-600'>
										{Math.round(report.averageAttendees)}
									</div>
									<div className='text-sm text-orange-800'>
										Avg. Attendees
									</div>
								</div>
							</div>

							{/* Breakdown by Type */}
							<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
								<div className='bg-red-50 p-4 rounded-lg'>
									<div className='text-xl font-bold text-red-600'>
										{report.eventCount}
									</div>
									<div className='text-sm text-red-800'>
										Events
									</div>
								</div>
								<div className='bg-yellow-50 p-4 rounded-lg'>
									<div className='text-xl font-bold text-yellow-600'>
										{report.lectureCount}
									</div>
									<div className='text-sm text-yellow-800'>
										Extra Lectures
									</div>
								</div>
								<div className='bg-indigo-50 p-4 rounded-lg'>
									<div className='text-xl font-bold text-indigo-600'>
										{report.generalLectureCount}
									</div>
									<div className='text-sm text-indigo-800'>
										General Lectures
									</div>
								</div>
							</div>

							{/* Recent Reservations Preview */}
							<div>
								<h3 className='text-lg font-medium mb-4'>
									Recent Reservations (
									{report.reservations.length} total)
								</h3>
								<div className='overflow-x-auto'>
									<table className='w-full border-collapse border border-gray-200'>
										<thead className='bg-gray-50'>
											<tr>
												<th className='border border-gray-200 p-2 text-left'>
													Date
												</th>
												<th className='border border-gray-200 p-2 text-left'>
													Time
												</th>
												<th className='border border-gray-200 p-2 text-left'>
													Type
												</th>
												<th className='border border-gray-200 p-2 text-left'>
													Name
												</th>
												<th className='border border-gray-200 p-2 text-left'>
													Duration
												</th>
												<th className='border border-gray-200 p-2 text-left'>
													Attendees
												</th>
											</tr>
										</thead>
										<tbody>
											{report.reservations
												.slice(0, 10)
												.map((reservation) => (
													<tr
														key={reservation.id}
														className='hover:bg-gray-50'
													>
														<td className='border border-gray-200 p-2'>
															{new Date(
																reservation.date
															).toLocaleDateString()}
														</td>
														<td className='border border-gray-200 p-2'>
															{
																reservation.start_time
															}{' '}
															-{' '}
															{
																reservation.end_time
															}
														</td>
														<td className='border border-gray-200 p-2'>
															<Badge
																variant={
																	reservation.type ===
																	'event'
																		? 'default'
																		: reservation.type ===
																			  'extra_lecture'
																			? 'secondary'
																			: 'outline'
																}
																className='text-xs'
															>
																{reservation.type.replace(
																	'_',
																	' '
																)}
															</Badge>
														</td>
														<td className='border border-gray-200 p-2'>
															{reservation.name}
														</td>
														<td className='border border-gray-200 p-2'>
															{Math.round(
																reservation.duration_hours *
																	10
															) / 10}
															h
														</td>
														<td className='border border-gray-200 p-2'>
															{reservation.attendee_count ||
																'-'}
														</td>
													</tr>
												))}
										</tbody>
									</table>
									{report.reservations.length > 10 && (
										<div className='text-center mt-4 text-sm text-gray-600'>
											Showing 10 of{' '}
											{report.reservations.length}{' '}
											reservations. Download Excel for
											complete data.
										</div>
									)}
								</div>
							</div>
						</CardContent>
					</Card>
				)}
			</div>
		</SidebarLayout>
	);
}

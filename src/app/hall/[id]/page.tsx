'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import SidebarLayout from '@/layouts/Sidebar/Layout';
import { Hall as HallType } from '@/app/halls/hall';
import { getHall } from '@/lib/getHall';

import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import PageHeader from '@/components/custom/PageHeader';
import Loading from '@/components/custom/Loading';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { createClient } from '@/lib/supabaseClient';

import { useRouter } from 'next/navigation';
// Hall type mapping
const hallTypeMap: Record<string, string> = {
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

// Reservation interface
interface HallReservation {
	id: string;
	date: string;
	start_time: string;
	end_time: string;
	status: string;
	type: 'event' | 'extra_lecture';
	name: string;
	bookedBy: string;
	attendeeCount?: number;
}

// Utility functions for formatting
const formatDate = (dateString: string) => {
	return new Date(dateString).toLocaleDateString('en-US', {
		weekday: 'short',
		year: 'numeric',
		month: 'short',
		day: 'numeric',
	});
};

const formatTime = (timeString: string) => {
	return new Date(`1970-01-01T${timeString}`).toLocaleTimeString('en-US', {
		hour: 'numeric',
		minute: '2-digit',
		hour12: true,
	});
};

export default function Hall() {
	const { id: hallCode } = useParams<{ id: string }>();

	const [hall, setHall] = useState<HallType | null>(null);
	const [reservations, setReservations] = useState<HallReservation[]>([]);
	const [loading, setLoading] = useState<boolean>(true);

	const router = useRouter();

	// Function to get hall reservations by hall ID
	const getHallReservations = async (
		hallId: string
	): Promise<HallReservation[]> => {
		try {
			const supabase = createClient();

			// Get hall assignments with reservation details
			const { data: assignments, error: assignError } = await supabase
				.from('hall_assign')
				.select(
					`
					reserve_id,
					reserve:reserve_id (
						id,
						date,
						start_time,
						end_time,
						status,
						type,
						profiles:profile_id (
							full_name
						)
					)
				`
				)
				.eq('hall_id', hallId);

			if (assignError) {
				console.error('Error fetching hall assignments:', assignError);
				return [];
			}

			if (!assignments || assignments.length === 0) {
				return [];
			}

			// Get event and lecture details
			const reserveIds = assignments.map((a) => a.reserve_id);

			const [eventData, lectureData] = await Promise.all([
				supabase
					.from('event')
					.select('name, attendee_count, reserve_id')
					.in('reserve_id', reserveIds),
				supabase
					.from('extra_lecture')
					.select(
						`
						attendee_count,
						reserve_id,
						course:course_id (
							char,
							digit
						)
					`
					)
					.in('reserve_id', reserveIds),
			]);

			// Create lookup maps
			const eventMap = new Map(
				(eventData.data || []).map((e) => [e.reserve_id, e])
			);
			const lectureMap = new Map(
				(lectureData.data || []).map((l) => [l.reserve_id, l])
			);

			// Build reservation list
			const reservationsList: HallReservation[] = assignments
				.filter((a) => a.reserve)
				.map((assignment) => {
					const reserve = assignment.reserve as any;
					const profile = Array.isArray(reserve.profiles)
						? reserve.profiles[0]
						: reserve.profiles;

					let name = 'Unknown';
					let attendeeCount: number | undefined;

					if (reserve.type === 'event') {
						const event = eventMap.get(reserve.id);
						name = event?.name || 'Unnamed Event';
						attendeeCount = event?.attendee_count;
					} else if (reserve.type === 'extra_lecture') {
						const lecture = lectureMap.get(reserve.id);
						const course = Array.isArray(lecture?.course)
							? lecture.course[0]
							: lecture?.course;
						name = course
							? `${course.char} ${course.digit}`
							: 'Unknown Course';
						attendeeCount = lecture?.attendee_count;
					}

					return {
						id: reserve.id,
						date: reserve.date,
						start_time: reserve.start_time,
						end_time: reserve.end_time,
						status: reserve.status,
						type: reserve.type,
						name,
						bookedBy: profile?.full_name || 'Unknown',
						attendeeCount,
					};
				});

			return reservationsList;
		} catch (error) {
			console.error('Error fetching hall reservations:', error);
			return [];
		}
	};

	useEffect(() => {
		if (!hallCode) return;

		const fetchData = async () => {
			setLoading(true);
			try {
				const hallData = await getHall(hallCode);
				let reservationData: HallReservation[] = [];

				// Only fetch reservations if we have hall data
				if (hallData) {
					reservationData = await getHallReservations(hallData.id);
				}

				setHall(hallData);
				setReservations(reservationData || []);
			} catch (error) {
				console.error('Error fetching data:', error);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [hallCode]);

	if (loading) {
		return (
			<SidebarLayout>
				<Loading className='mt-10 mx-auto' />
			</SidebarLayout>
		);
	}

	if (!hall) {
		return (
			<SidebarLayout>
				<div className='flex justify-center items-center h-64'>
					<p className='text-lg text-gray-500'>Hall not found</p>
				</div>
			</SidebarLayout>
		);
	}

	// Utility functions
	const formatTime = (time: string) => {
		return new Date(`1970-01-01T${time}`).toLocaleTimeString('en-US', {
			hour: 'numeric',
			minute: '2-digit',
			hour12: true,
		});
	};

	const formatDate = (date: string) => {
		return new Date(date).toLocaleDateString('en-US', {
			weekday: 'short',
			year: 'numeric',
			month: 'short',
			day: 'numeric',
		});
	};

	// Get status badge color
	const getStatusBadgeVariant = (status: string) => {
		switch (status.toLowerCase()) {
			case 'approved':
				return 'default';
			case 'pending':
				return 'secondary';
			case 'rejected':
				return 'destructive';
			case 'waiting':
				return 'outline';
			default:
				return 'secondary';
		}
	};

	// Get energy consumption color
	const getEnergyColor = (consumption: number) => {
		if (consumption <= 30) return 'text-green-600';
		if (consumption <= 60) return 'text-yellow-600';
		return 'text-red-600';
	};

	// Filter upcoming and past reservations
	const now = new Date();
	const upcomingReservations = reservations.filter(
		(r) => new Date(r.date) >= now
	);
	const recentReservations = reservations
		.filter((r) => new Date(r.date) < now)
		.slice(0, 5);

	return (
		<SidebarLayout>
			<PageHeader
				title={hall.code}
				descriptions={[hallTypeMap[hall.type] || hall.type]}
				extra={
					<div className='gap-4 flex flex-row'>
						<Button
							variant='outline'
							onClick={() =>
								router.push(`/hall/${hall.code}/edit`)
							}
							className='px-6'
						>
							Edit
						</Button>
						<Button
							onClick={() => router.push(`/reserve/${hall.code}`)}
							disabled={!hall.is_available}
							className='px-6'
						>
							Reserve
						</Button>
					</div>
				}
			/>

			<Tabs defaultValue='information' className='w-full'>
				<TabsList className='grid w-full grid-cols-3'>
					<TabsTrigger value='information'>Information</TabsTrigger>
					<TabsTrigger value='reservations'>Reservations</TabsTrigger>
					<TabsTrigger value='timeline'>Timeline</TabsTrigger>
				</TabsList>

				<TabsContent value='information' className='space-y-6'>
					<div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
						{/* Basic Information */}
						<Card className='lg:col-span-2'>
							<CardHeader>
								<CardTitle>Hall Details</CardTitle>
							</CardHeader>
							<CardContent>
								<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
									<Table>
										<TableBody>
											<TableRow>
												<TableCell className='font-medium'>
													Status
												</TableCell>
												<TableCell>
													<Badge
														variant={
															hall.is_available
																? 'default'
																: 'destructive'
														}
													>
														{hall.is_available
															? 'Available'
															: 'Not Available'}
													</Badge>
												</TableCell>
											</TableRow>
											<TableRow>
												<TableCell className='font-medium'>
													Capacity
												</TableCell>
												<TableCell className='font-semibold'>
													{hall.capacity} people
												</TableCell>
											</TableRow>
											<TableRow>
												<TableCell className='font-medium'>
													Building
												</TableCell>
												<TableCell>
													{hall.building}
												</TableCell>
											</TableRow>
											<TableRow>
												<TableCell className='font-medium'>
													Floor
												</TableCell>
												<TableCell>
													{hall.floor === 0
														? 'Ground Floor'
														: `${hall.floor}${hall.floor === 1 ? 'st' : hall.floor === 2 ? 'nd' : hall.floor === 3 ? 'rd' : 'th'} Floor`}
												</TableCell>
											</TableRow>
											<TableRow>
												<TableCell className='font-medium'>
													Type
												</TableCell>
												<TableCell>
													{hallTypeMap[hall.type] ||
														hall.type}
												</TableCell>
											</TableRow>
										</TableBody>
									</Table>

									<Table>
										<TableBody>
											<TableRow>
												<TableCell className='font-medium'>
													Energy Consumption
												</TableCell>
												<TableCell>
													<span
														className={`font-semibold ${getEnergyColor(hall.energy_consumption)}`}
													>
														{
															hall.energy_consumption
														}
														%
													</span>
													<span className='text-sm text-gray-500 ml-1'>
														(
														{hall.energy_consumption <=
														30
															? 'Low'
															: hall.energy_consumption <=
																  60
																? 'Medium'
																: 'High'}
														)
													</span>
												</TableCell>
											</TableRow>
											<TableRow>
												<TableCell className='font-medium'>
													Total Reservations
												</TableCell>
												<TableCell className='font-semibold'>
													{reservations.length}
												</TableCell>
											</TableRow>
											<TableRow>
												<TableCell className='font-medium'>
													Upcoming
												</TableCell>
												<TableCell className='font-semibold text-blue-600'>
													{
														upcomingReservations.length
													}
												</TableCell>
											</TableRow>
											<TableRow>
												<TableCell className='font-medium'>
													Air Conditioning
												</TableCell>
												<TableCell>
													<Badge variant='outline'>
														Yes
													</Badge>
												</TableCell>
											</TableRow>
											<TableRow>
												<TableCell className='font-medium'>
													WiFi Available
												</TableCell>
												<TableCell>
													<Badge variant='outline'>
														Yes
													</Badge>
												</TableCell>
											</TableRow>
										</TableBody>
									</Table>
								</div>
							</CardContent>
						</Card>

						{/* Hall Image/Preview */}
						<Card>
							<CardHeader>
								<CardTitle>Hall Preview</CardTitle>
							</CardHeader>
							<CardContent>
								<div className='h-[300px] bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center'>
									<p className='text-gray-500'>
										Hall Image Preview
									</p>
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Description */}
					{hall.description && (
						<Card>
							<CardHeader>
								<CardTitle>Description</CardTitle>
							</CardHeader>
							<CardContent>
								<p className='text-gray-700'>
									{hall.description}
								</p>
							</CardContent>
						</Card>
					)}
				</TabsContent>

				<TabsContent value='reservations' className='space-y-6'>
					{/* Upcoming Reservations */}
					<Card>
						<CardHeader>
							<CardTitle>
								Upcoming Reservations (
								{upcomingReservations.length})
							</CardTitle>
						</CardHeader>
						<CardContent>
							{upcomingReservations.length > 0 ? (
								<div className='space-y-4'>
									{upcomingReservations.map((reservation) => (
										<div
											key={reservation.id}
											className='flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer'
											onClick={() =>
												router.push(
													`/all-reservations/review/${reservation.id}`
												)
											}
										>
											<div className='space-y-1'>
												<h4 className='font-semibold'>
													{reservation.name}
												</h4>
												<p className='text-sm text-gray-600'>
													{formatDate(
														reservation.date
													)}{' '}
													•{' '}
													{formatTime(
														reservation.start_time
													)}{' '}
													-{' '}
													{formatTime(
														reservation.end_time
													)}
												</p>
												<p className='text-sm text-gray-500'>
													Booked by:{' '}
													{reservation.bookedBy}
													{reservation.attendeeCount &&
														` • ${reservation.attendeeCount} attendees`}
												</p>
											</div>
											<Badge
												variant={getStatusBadgeVariant(
													reservation.status
												)}
											>
												{reservation.status
													.charAt(0)
													.toUpperCase() +
													reservation.status.slice(1)}
											</Badge>
										</div>
									))}
								</div>
							) : (
								<p className='text-center text-gray-500 py-8'>
									No upcoming reservations
								</p>
							)}
						</CardContent>
					</Card>

					{/* Recent Reservations */}
					<Card>
						<CardHeader>
							<CardTitle>Recent Reservations</CardTitle>
						</CardHeader>
						<CardContent>
							{recentReservations.length > 0 ? (
								<div className='space-y-4'>
									{recentReservations.map((reservation) => (
										<div
											key={reservation.id}
											className='flex items-center justify-between p-4 border rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer'
											onClick={() =>
												router.push(
													`/all-reservations/review/${reservation.id}`
												)
											}
										>
											<div className='space-y-1'>
												<h4 className='font-semibold'>
													{reservation.name}
												</h4>
												<p className='text-sm text-gray-600'>
													{formatDate(
														reservation.date
													)}{' '}
													•{' '}
													{formatTime(
														reservation.start_time
													)}{' '}
													-{' '}
													{formatTime(
														reservation.end_time
													)}
												</p>
												<p className='text-sm text-gray-500'>
													Booked by:{' '}
													{reservation.bookedBy}
													{reservation.attendeeCount &&
														` • ${reservation.attendeeCount} attendees`}
												</p>
											</div>
											<Badge
												variant={getStatusBadgeVariant(
													reservation.status
												)}
											>
												{reservation.status
													.charAt(0)
													.toUpperCase() +
													reservation.status.slice(1)}
											</Badge>
										</div>
									))}
								</div>
							) : (
								<p className='text-center text-gray-500 py-8'>
									No recent reservations
								</p>
							)}
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value='timeline' className='w-full flex flex-col'>
					<Card>
						<CardHeader>
							<CardTitle>Hall Usage Timeline</CardTitle>
						</CardHeader>
						<CardContent>
							<div className='w-full h-[400px] bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center'>
								<p className='text-gray-500'>
									Timeline visualization coming soon
								</p>
							</div>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</SidebarLayout>
	);
}

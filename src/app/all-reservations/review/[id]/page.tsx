'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import SidebarLayout from '@/layouts/Sidebar/Layout';
import PageHeader from '@/components/custom/PageHeader';
import Loading from '@/components/custom/Loading';
import { createClient } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { XCircle, ArrowLeft, CheckCircle } from 'lucide-react';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { ReservationDetailsCard } from '@/components/custom/ReservationDetailsCard';
import { isHallTypeCompatible } from '@/lib/hallTypeCompatibility';

interface ReservationDetails {
	id: string;
	date: string;
	startTime: string;
	endTime: string;
	status: string;
	type: 'event' | 'extra_lecture';
	hallOption: string;
	isSubmitted: boolean;
	profile: {
		fullName: string;
		email: string;
		role: string;
	};
	createdDate: string;
	createdTime: string;
	modifiedDate: string;
	modifiedTime: string;
	event?: {
		name: string;
		description: string;
		organizer: string;
		type: string;
		attendeeCount: number;
		additionalNotes?: string;
	};
	extraLecture?: {
		description: string;
		attendeeCount: number;
		type: string;
		additionalNotes?: string;
		course: {
			char: string;
			digit: string;
			name: string;
		};
	};
}

export default function ReviewReservationPage() {
	const params = useParams();
	const router = useRouter();
	const reservationId = params.id as string;

	const [reviewMethod, setReviewMethod] = useState<'approve' | 'reject' | ''>(
		''
	);
	const [reservation, setReservation] = useState<ReservationDetails | null>(
		null
	);
	const [loading, setLoading] = useState(true);
	const [updating, setUpdating] = useState(false);
	const [approveDialogOpen, setApproveDialogOpen] = useState(false);
	const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
	const [rejectReason, setRejectReason] = useState('');
	const [halls, setHalls] = useState<
		Array<{
			id: string;
			code: string;
			energy_consumption: number;
			capacity: number;
			type?: string;
		}>
	>([]);
	const [selectedHallId, setSelectedHallId] = useState<string>('');
	const [hallsLoading, setHallsLoading] = useState(false);
	const [assignedHallIds, setAssignedHallIds] = useState<Set<string>>(
		new Set()
	);
	const [assignedHallStatuses, setAssignedHallStatuses] = useState<
		Record<string, string>
	>({});
	const [assignedHallConflicts, setAssignedHallConflicts] = useState<
		Record<string, { conflict: boolean; time?: string }>
	>({});

	useEffect(() => {
		fetchReservationDetails();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [reservationId]);

	useEffect(() => {
		if (reservation && reservation.hallOption === 'availability') {
			fetchAllHalls();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [reservation]);

	const fetchReservationDetails = async () => {
		try {
			const supabase = createClient();

			// Get reservation with profile
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
					hall_option,
					is_submitted,
					created_date,
					created_time,
					modified_date,
					modified_time,
					profiles:profile_id (
						full_name,
						email,
						role
					)
				`
				)
				.eq('id', reservationId)
				.single();

			if (reserveError || !reserveData) {
				setLoading(false);
				setReservation(null);
				return;
			}

			const profileData = Array.isArray(reserveData.profiles)
				? reserveData.profiles[0]
				: reserveData.profiles;

			const reservationDetails: ReservationDetails = {
				id: reserveData.id,
				date: reserveData.date,
				startTime: reserveData.start_time,
				endTime: reserveData.end_time,
				status: reserveData.status,
				type: reserveData.type as 'event' | 'extra_lecture',
				hallOption: reserveData.hall_option,
				isSubmitted: reserveData.is_submitted,
				profile: {
					fullName: profileData?.full_name || 'Unknown',
					email: profileData?.email || 'Unknown',
					role: profileData?.role || 'Unknown',
				},
				createdDate: reserveData.created_date || '',
				createdTime: reserveData.created_time || '',
				modifiedDate: reserveData.modified_date || '',
				modifiedTime: reserveData.modified_time || '',
			};

			// Fetch event or extra lecture details based on type
			if (reserveData.type === 'event') {
				const { data: eventData, error: eventError } = await supabase
					.from('event')
					.select(
						'name, description, organizer, type, attendee_count, additional_notes'
					)
					.eq('reserve_id', reservationId)
					.single();

				if (eventError) {
					console.error('Event fetch error:', {
						message: eventError.message,
						details: eventError.details,
						hint: eventError.hint,
						code: eventError.code,
					});
					// Continue without event data
				} else if (eventData) {
					reservationDetails.event = {
						name: eventData.name || 'N/A',
						description: eventData.description || '',
						organizer: eventData.organizer || 'N/A',
						type: eventData.type || 'N/A',
						attendeeCount: eventData.attendee_count || 0,
						additionalNotes: eventData.additional_notes || '',
					};
				}
			} else if (reserveData.type === 'extra_lecture') {
				const { data: lectureData, error: lectureError } =
					await supabase
						.from('extra_lecture')
						.select(
							`
						description,
						attendee_count,
						type,
						additional_notes,
						course:course_id (
							char,
							digit,
							name
						)
					`
						)
						.eq('reserve_id', reservationId)
						.single();

				if (lectureError) {
					console.error('Lecture fetch error:', {
						message: lectureError.message,
						details: lectureError.details,
						hint: lectureError.hint,
						code: lectureError.code,
					});
				} else if (lectureData) {
					const course = Array.isArray(lectureData.course)
						? lectureData.course[0]
						: lectureData.course;

					reservationDetails.extraLecture = {
						description: lectureData.description,
						attendeeCount: lectureData.attendee_count,
						type: lectureData.type,
						additionalNotes: lectureData.additional_notes,
						course: {
							char: course?.char || '',
							digit: course?.digit || '',
							name: course?.name || '',
						},
					};
				}
			}

			setReservation(reservationDetails);
		} catch (err) {
			console.error('Error fetching reservation details:', {
				error: err,
				message: err instanceof Error ? err.message : String(err),
				stack: err instanceof Error ? err.stack : undefined,
				reservationId,
			});
			setReservation(null);
		} finally {
			setLoading(false);
		}
	};

	const fetchAllHalls = async () => {
		setHallsLoading(true);
		try {
			const supabase = createClient();
			// Fetch halls with type
			const { data: hallsData, error: hallsError } = await supabase
				.from('hall')
				.select('id, code, energy_consumption, capacity, type');
			// Fetch hall assignments with reserve_id
			const { data: assignData, error: assignError } = await supabase
				.from('hall_assign')
				.select('hall_id, reserve_id');
			// Fetch statuses and times for assigned reservations
			let hallStatuses: Record<string, string> = {};
			let hallConflicts: Record<
				string,
				{ conflict: boolean; time?: string }
			> = {};
			if (assignData && assignData.length > 0) {
				const reserveIds = Array.from(
					new Set(assignData.map((row: any) => row.reserve_id))
				);
				if (reserveIds.length > 0) {
					const { data: reserveData, error: reserveError } =
						await supabase
							.from('reserve')
							.select('id, status, date, start_time, end_time')
							.in('id', reserveIds);
					if (!reserveError && reserveData) {
						// Map reserve_id to status and time
						const reserveStatusMap: Record<string, string> = {};
						const reserveTimeMap: Record<
							string,
							{
								date: string;
								start_time: string;
								end_time: string;
							}
						> = {};
						reserveData.forEach((row: any) => {
							reserveStatusMap[row.id] = row.status;
							reserveTimeMap[row.id] = {
								date: row.date,
								start_time: row.start_time,
								end_time: row.end_time,
							};
						});
						// Get current reservation date/time
						const currentDate = reservation?.date;
						const currentStart = reservation?.startTime;
						const currentEnd = reservation?.endTime;
						assignData.forEach((row: any) => {
							hallStatuses[row.hall_id] =
								reserveStatusMap[row.reserve_id] || 'unknown';
							// Check for time conflict
							let conflict = false;
							let conflictTime = undefined;
							const assigned = reserveTimeMap[row.reserve_id];
							if (
								assigned &&
								currentDate &&
								currentStart &&
								currentEnd
							) {
								// Only check if not the same reservation
								if (row.reserve_id !== reservation?.id) {
									// Compare date
									if (assigned.date === currentDate) {
										// Compare time overlap
										// Times are in 'HH:MM:SS' format
										const toMinutes = (t: string) => {
											const [h, m] = t.split(':');
											return (
												parseInt(h) * 60 + parseInt(m)
											);
										};
										const assignedStart = toMinutes(
											assigned.start_time
										);
										const assignedEnd = toMinutes(
											assigned.end_time
										);
										const currStart =
											toMinutes(currentStart);
										const currEnd = toMinutes(currentEnd);
										if (
											currStart < assignedEnd &&
											currEnd > assignedStart
										) {
											conflict = true;
											conflictTime = `${assigned.start_time.substring(0, 5)} - ${assigned.end_time.substring(0, 5)}`;
										}
									}
								}
							}
							hallConflicts[row.hall_id] = {
								conflict,
								time: conflictTime,
							};
						});
					}
				}
			}
			if (hallsError) {
				console.error('Error fetching halls:', hallsError);
				setHalls([]);
			} else {
				setHalls(Array.isArray(hallsData) ? hallsData : []);
			}
			if (assignError) {
				console.error('Error fetching hall assignments:', assignError);
				setAssignedHallIds(new Set());
				setAssignedHallStatuses({});
				setAssignedHallConflicts({});
			} else {
				const ids = new Set(
					(assignData || []).map((row: any) => row.hall_id)
				);
				setAssignedHallIds(ids);
				setAssignedHallStatuses(hallStatuses);
				setAssignedHallConflicts(hallConflicts);
			}
		} catch (err) {
			console.error('Error fetching halls or assignments:', err);
			setHalls([]);
			setAssignedHallIds(new Set());
			setAssignedHallStatuses({});
			setAssignedHallConflicts({});
		} finally {
			setHallsLoading(false);
		}
	};

	const handleUpdateStatus = async (status: 'approved' | 'rejected') => {
		if (!reservation) return;

		setUpdating(true);
		try {
			const supabase = createClient();
			const { error: updateError } = await supabase
				.from('reserve')
				.update({ status })
				.eq('id', reservationId);

			if (updateError) throw updateError;

			// If rejected, insert note into reject_review table
			if (status === 'rejected' && rejectReason.trim()) {
				await supabase.from('reject_review').insert({
					reserve_id: reservationId,
					note: rejectReason.trim(),
				});
			}

			// Prepare email data
			const eventDateTime = reservation.date
				? `${formatDate(reservation.date)} ${formatTime(reservation.startTime)} - ${formatTime(reservation.endTime)}`
				: 'N/A';

			const eventName =
				reservation.event?.name ||
				reservation.extraLecture?.course?.name ||
				'Unnamed Event';

			const eventLocation =
				reservation.hallOption === 'availability'
					? 'Preferred Hall: Any Available'
					: `Requested Hall: ${reservation.hallOption}`;

			// Send email notification
			try {
				const emailPayload = {
					toEmail: reservation.profile.email,
					eventName,
					eventDateTime,
					eventLocation,
					reservationId: reservation.id,
					status,
					requesterName: reservation.profile.fullName,
				};

				const emailRes = await fetch('/api/send-status-mail', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(emailPayload),
				});

				if (!emailRes.ok) {
					let errorMessage = 'Failed to send notification email';
					try {
						const errorData = await emailRes.json();
						console.error('Status email API error:', {
							status: emailRes.status,
							statusText: emailRes.statusText,
							error: errorData,
							reservationId,
							payload: emailPayload,
						});

						// Use detailed error message if available
						if (errorData.error && errorData.details) {
							errorMessage = `${errorData.error}: ${errorData.details}`;
						}
					} catch (parseErr) {
						console.error(
							'Failed to parse email API error response:',
							{
								error: parseErr,
								status: emailRes.status,
								statusText: emailRes.statusText,
								reservationId,
							}
						);
					}
					toast.error(errorMessage + ' (status was updated)', {
						duration: 5000,
					});
				}
			} catch (emailErr) {
				const errorDetails = {
					error: emailErr,
					message:
						emailErr instanceof Error
							? emailErr.message
							: String(emailErr),
					stack:
						process.env.NODE_ENV === 'development' &&
						emailErr instanceof Error
							? emailErr.stack
							: undefined,
					reservationId,
					networkError:
						emailErr instanceof TypeError &&
						emailErr.message.includes('fetch'),
				};
				console.error(
					'Status email network/system error:',
					errorDetails
				);
				// Show more specific error message based on error type
				const isNetworkError =
					emailErr instanceof TypeError &&
					emailErr.message.includes('fetch');
				const errorMessage = isNetworkError
					? 'Network error while sending email notification'
					: 'System error while sending email notification';
				toast.error(errorMessage + ' (status was updated)', {
					duration: 5000,
				});
			}

			// Update UI
			setReservation((prev) => (prev ? { ...prev, status } : null));

			toast.success(`The reservation has been ${status} successfully.`);

			if (status === 'approved') {
				setApproveDialogOpen(false);
			} else {
				setRejectDialogOpen(false);
			}
		} catch (err) {
			console.error('Failed to update reservation status:', err);
			toast.error(
				'Failed to update reservation status. Please try again.'
			);
		} finally {
			setUpdating(false);
		}
	};

	const formatDate = (dateString: string) => {
		if (!dateString) return 'N/A';
		const date = new Date(dateString);
		const weekday = date.toLocaleDateString('en-US', { weekday: 'short' });
		const day = date.getDate();
		const month = date.toLocaleDateString('en-US', { month: 'short' });
		const year = date.getFullYear();
		return `${weekday}, ${day} ${month} ${year}`;
	};

	const formatTime = (timeString: string) => {
		if (!timeString) return 'N/A';
		return timeString.substring(0, 5); // Remove seconds
	};

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

	if (loading) {
		return (
			<SidebarLayout>
				<PageHeader title='Review Reservation' />
				<div className='container mx-auto'>
					<Loading text='Loading reservation details' pageView />
				</div>
			</SidebarLayout>
		);
	}

	if (!reservation) {
		return (
			<SidebarLayout>
				<PageHeader title='Review Reservation' />
				<div className='container mx-auto py-8'>
					<Card className='max-w-md mx-auto'>
						<CardContent className='pt-6 flex flex-col items-center'>
							<XCircle className='h-5 w-5 text-gray-400 mb-3' />
							<p className='text-sm text-muted-foreground mb-6'>
								Reservation not found
							</p>
							<Button
								onClick={() => router.push('/all-reservations')}
								variant='outline'
								className='flex items-center gap-2 mx-auto'
							>
								<ArrowLeft className='h-4 w-4' />
								Back to All Reservations
							</Button>
						</CardContent>
					</Card>
				</div>
			</SidebarLayout>
		);
	}

	const isActionable =
		reservation.status !== 'approved' && reservation.status !== 'rejected';

	const attendeeCount =
		reservation?.event?.attendeeCount ??
		reservation?.extraLecture?.attendeeCount;
	const hallsWithStatus = halls.map((hall) => {
		const isEnough =
			typeof attendeeCount === 'number' &&
			Number(hall.capacity) >= attendeeCount;
		return {
			...hall,
			isEnough,
		};
	});

	const filteredHalls =
		reservation &&
		((reservation.event &&
			typeof reservation.event.attendeeCount === 'number') ||
			(reservation.extraLecture &&
				typeof reservation.extraLecture.attendeeCount === 'number'))
			? halls.filter((hall) => {
					const attendeeCount =
						reservation.event?.attendeeCount ??
						reservation.extraLecture?.attendeeCount ??
						0;
					return Number(hall.capacity) >= attendeeCount;
				})
			: halls;

	return (
		<SidebarLayout>
			<PageHeader
				title='Review Reservation'
				descriptions={[
					`ID: ${reservation.id}`,
					<span
						key='status'
						className='flex items-center gap-2 text-sm font-medium'
					>
						Status:{' '}
						<Badge
							variant={getStatusBadgeVariant(reservation.status)}
						>
							{reservation.status.charAt(0).toUpperCase() +
								reservation.status.slice(1)}
						</Badge>
					</span>,
				]}
			/>
			<div className='container mx-auto px-0 space-y-6'>
				{/* Unified Reservation Details Card */}
				<Card className='border border-muted bg-background rounded-md shadow-none px-6 py-6'>
					<CardHeader className='pb-2 px-0'>
						<CardTitle className='text-lg font-semibold tracking-tight text-foreground'>
							Reservation Details
						</CardTitle>
					</CardHeader>
					<CardContent className='space-y-6 pt-0 px-0'>
						<ReservationDetailsCard
							reservation={reservation}
							formatDate={formatDate}
							formatTime={formatTime}
						/>
					</CardContent>
				</Card>
				{/* Suggested Halls Card */}
				{reservation.hallOption === 'availability' && (
					<Card className='border border-muted bg-background rounded-md shadow-none mt-6'>
						<CardHeader className='pb-2'>
							<CardTitle className='text-lg font-semibold tracking-tight text-foreground'>
								Assign from Suggested Halls
							</CardTitle>
						</CardHeader>
						<CardContent className='pt-0'>
							<label
								htmlFor='hall-dropdown-dialog'
								className='block mb-2 text-sm font-medium text-foreground'
							>
								Select Hall
							</label>
							<select
								id='hall-dropdown-dialog'
								className='w-full p-2 border rounded focus:outline-none focus:ring focus:border-blue-300 bg-background text-foreground'
								disabled={hallsLoading}
								value={selectedHallId}
								onChange={(e) =>
									setSelectedHallId(e.target.value)
								}
							>
								<option value=''>-- Choose a hall --</option>
								{halls.map((hall) => {
									const attendeeCount =
										reservation.event?.attendeeCount ??
										reservation.extraLecture
											?.attendeeCount ??
										0;
									const hasLowCapacity =
										Number(hall.capacity) < attendeeCount;
									const isAssigned = assignedHallIds.has(
										hall.id
									);
									const assignedStatus = isAssigned
										? assignedHallStatuses[hall.id]
										: undefined;
									const conflictInfo = isAssigned
										? assignedHallConflicts[hall.id]
										: undefined;
									const hallType = hall.type ?? '';
									let reservationType = '';
									if (reservation.type === 'event') {
										reservationType =
											reservation.event?.type ?? '';
									} else if (
										reservation.type === 'extra_lecture'
									) {
										reservationType =
											reservation.extraLecture?.type ??
											'';
									}
									const isCompatible = isHallTypeCompatible(
										reservationType,
										hallType
									);
									let compatibilityReason = `(${reservationType} ~ ${hallType})`;
									let label = `${hall.code} (Capacity: ${hall.capacity !== undefined && hall.capacity !== null && !isNaN(Number(hall.capacity)) ? Number(hall.capacity) : 'N/A'}, Energy: ${typeof hall.energy_consumption === 'number' && !isNaN(Number(hall.energy_consumption)) ? (Number(hall.energy_consumption) / 100).toFixed(2) : '0.00'}`;
									if (hasLowCapacity)
										label += ', capacity is low';
									if (isAssigned)
										label += `, already assigned${assignedStatus ? ': ' + assignedStatus : ''}`;
									if (conflictInfo?.conflict)
										label += `, conflict: ${conflictInfo.time}`;
									label += isCompatible
										? `, compatible ${compatibilityReason}`
										: `, not compatible ${compatibilityReason}`;
									label += ')';
									return (
										<option
											key={hall.id}
											value={hall.id}
											className={
												hasLowCapacity
													? 'text-red-600'
													: isAssigned
														? conflictInfo?.conflict
															? 'text-yellow-600'
															: 'text-orange-500'
														: isCompatible
															? 'text-green-600'
															: 'text-gray-400'
											}
											disabled={false}
										>
											{label}
										</option>
									);
								})}
							</select>
							{hallsLoading && (
								<div className='text-xs text-muted-foreground mt-2'>
									Loading halls...
								</div>
							)}
							<div className='text-xs mt-2'>
								<span className='text-red-600'>
									Halls marked in red have lower capacity than
									required attendees.
								</span>
								<br />
								<span className='text-orange-500'>
									Halls marked in orange are already assigned
									to another reservation.
								</span>
							</div>
						</CardContent>
					</Card>
				)}

				{/* Action Buttons */}
				{isActionable && (
					<>
						{/* Approve Card */}
						<Card className='border border-muted bg-background rounded-md shadow-none mb-4'>
							<CardHeader className='pb-2'>
								<CardTitle className='text-lg font-semibold tracking-tight text-foreground'>
									Review: Approve
								</CardTitle>
							</CardHeader>
							<CardContent className='pt-0'>
								<AlertDialog
									open={approveDialogOpen}
									onOpenChange={setApproveDialogOpen}
								>
									<AlertDialogTrigger asChild>
										<Button
											disabled={updating}
											className='bg-green-600 hover:bg-green-700'
										>
											<CheckCircle className='h-4 w-4 mr-2' />
											Approve Reservation
										</Button>
									</AlertDialogTrigger>
									<AlertDialogContent>
										<AlertDialogHeader>
											<AlertDialogTitle>
												Approve Reservation
											</AlertDialogTitle>
											<AlertDialogDescription>
												Please select a hall to assign
												before approving. This will
												confirm the reservation and
												allocate the selected hall.
											</AlertDialogDescription>
										</AlertDialogHeader>
										<AlertDialogFooter>
											<AlertDialogCancel
												disabled={updating}
											>
												Cancel
											</AlertDialogCancel>
											<AlertDialogAction
												onClick={async () => {
													if (!selectedHallId) {
														toast.error(
															'Please select a hall to assign before approving.'
														);
														return;
													}
													setUpdating(true);
													try {
														const supabase =
															createClient();
														// Assign hall in hall_assign table
														const {
															error: assignError,
														} = await supabase
															.from('hall_assign')
															.insert({
																hall_id:
																	selectedHallId,
																reserve_id:
																	reservationId,
															});
														if (assignError)
															throw assignError;
														// Update reservation status
														await handleUpdateStatus(
															'approved'
														);
													} catch (err) {
														console.error(
															'Failed to assign hall or approve:',
															err
														);
														toast.error(
															'Failed to assign hall or approve reservation.'
														);
													} finally {
														setUpdating(false);
													}
												}}
												disabled={
													updating || !selectedHallId
												}
												className='bg-green-600 hover:bg-green-700'
											>
												{updating
													? 'Approving...'
													: 'Approve'}
											</AlertDialogAction>
										</AlertDialogFooter>
									</AlertDialogContent>
								</AlertDialog>
							</CardContent>
						</Card>
						{/* Reject Card */}
						<Card className='border border-muted bg-background rounded-md shadow-none'>
							<CardHeader className='pb-2'>
								<CardTitle className='text-lg font-semibold tracking-tight text-foreground'>
									Review: Reject
								</CardTitle>
							</CardHeader>
							<CardContent className='pt-0'>
								<AlertDialog
									open={rejectDialogOpen}
									onOpenChange={setRejectDialogOpen}
								>
									<AlertDialogTrigger asChild>
										<Button
											disabled={updating}
											variant='destructive'
										>
											<XCircle className='h-4 w-4 mr-2' />
											Reject Reservation
										</Button>
									</AlertDialogTrigger>
									<AlertDialogContent>
										<AlertDialogHeader>
											<AlertDialogTitle>
												Reject Reservation
											</AlertDialogTitle>
											<AlertDialogDescription>
												Are you sure you want to reject
												this reservation? This action
												will deny the reservation
												request and cannot be undone.
											</AlertDialogDescription>
											<div className='mt-4'>
												<label
													htmlFor='reject-reason'
													className='block mb-2 text-sm font-medium text-foreground'
												>
													Reason / Notes (optional)
												</label>
												<textarea
													id='reject-reason'
													className='w-full p-2 border rounded focus:outline-none focus:ring focus:border-blue-300 bg-background text-foreground'
													rows={3}
													value={rejectReason}
													onChange={(e) =>
														setRejectReason(
															e.target.value
														)
													}
													placeholder='Add a reason or notes for rejection...'
												/>
											</div>
										</AlertDialogHeader>
										<AlertDialogFooter>
											<AlertDialogCancel
												disabled={updating}
											>
												Cancel
											</AlertDialogCancel>
											<AlertDialogAction
												onClick={async () => {
													// You can send the reason to the backend here if needed
													// For now, just log it and call handleUpdateStatus
													if (!rejectReason.trim()) {
														// Optionally require a reason, or just allow empty
														// toast.error('Please provide a reason for rejection.');
														// return;
													}
													// TODO: send reason to backend if needed
													// Example: await supabase.from('reserve').update({ reject_reason: rejectReason })
													// For now, just log
													console.log(
														'Reject reason:',
														rejectReason
													);
													handleUpdateStatus(
														'rejected'
													);
													setRejectReason('');
												}}
												disabled={updating}
												className='bg-destructive hover:bg-destructive/90'
											>
												{updating
													? 'Rejecting...'
													: 'Reject'}
											</AlertDialogAction>
										</AlertDialogFooter>
									</AlertDialogContent>
								</AlertDialog>
							</CardContent>
						</Card>
					</>
				)}

				{!isActionable && (
					<Card className='border border-muted bg-background rounded-md shadow-none'>
						<CardContent className='pt-6'>
							<div className='text-center text-muted-foreground'>
								This reservation has already been{' '}
								{reservation.status}. No further actions are
								available.
							</div>
						</CardContent>
					</Card>
				)}
			</div>
		</SidebarLayout>
	);
}

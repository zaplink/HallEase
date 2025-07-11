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

	const [reservation, setReservation] = useState<ReservationDetails | null>(
		null
	);
	const [loading, setLoading] = useState(true);
	const [updating, setUpdating] = useState(false);
	const [approveDialogOpen, setApproveDialogOpen] = useState(false);
	const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
	const [halls, setHalls] = useState<
		Array<{ id: string; code: string; energy_consumption: number }>
	>([]);
	const [hallsLoading, setHallsLoading] = useState(false);

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
			const { data, error } = await supabase
				.from('hall')
				.select('id, code, energy_consumption');
			if (error) {
				console.error('Error fetching halls:', error);
				setHalls([]);
			} else {
				setHalls(Array.isArray(data) ? data : []);
			}
		} catch (err) {
			console.error('Error fetching halls:', err);
			setHalls([]);
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
						{/* Show all halls dropdown if hallOption is 'availability' */}
						{reservation.hallOption === 'availability' && (
							<div className='mt-4'>
								<label
									htmlFor='hall-dropdown'
									className='block mb-2 text-sm font-medium text-foreground'
								>
									Select Hall
								</label>
								<select
									id='hall-dropdown'
									className='w-full p-2 border rounded focus:outline-none focus:ring focus:border-blue-300 bg-background text-foreground'
									disabled={hallsLoading}
								>
									<option value=''>
										-- Choose a hall --
									</option>
									{halls.map((hall) => (
										<option key={hall.id} value={hall.id}>
											{hall.code} (Energy:{' '}
											{Number(hall.energy_consumption) &&
											!isNaN(
												Number(hall.energy_consumption)
											)
												? (
														Number(
															hall.energy_consumption
														) / 100
													).toFixed(2)
												: '0.00'}
											)
										</option>
									))}
								</select>
								{hallsLoading && (
									<div className='text-xs text-muted-foreground mt-2'>
										Loading halls...
									</div>
								)}
							</div>
						)}
					</CardContent>
				</Card>

				{/* Action Buttons */}
				{isActionable && (
					<Card className='border border-muted bg-background rounded-md shadow-none'>
						<CardHeader className='pb-2'>
							<CardTitle className='text-lg font-semibold tracking-tight text-foreground'>
								Review Actions
							</CardTitle>
						</CardHeader>
						<CardContent className='pt-0'>
							<div className='flex space-x-4'>
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
												Are you sure you want to approve
												this reservation? This action
												will confirm the reservation and
												allocate the requested hall.
											</AlertDialogDescription>
										</AlertDialogHeader>
										<AlertDialogFooter>
											<AlertDialogCancel
												disabled={updating}
											>
												Cancel
											</AlertDialogCancel>
											<AlertDialogAction
												onClick={() =>
													handleUpdateStatus(
														'approved'
													)
												}
												disabled={updating}
												className='bg-green-600 hover:bg-green-700'
											>
												{updating
													? 'Approving...'
													: 'Approve'}
											</AlertDialogAction>
										</AlertDialogFooter>
									</AlertDialogContent>
								</AlertDialog>

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
										</AlertDialogHeader>
										<AlertDialogFooter>
											<AlertDialogCancel
												disabled={updating}
											>
												Cancel
											</AlertDialogCancel>
											<AlertDialogAction
												onClick={() =>
													handleUpdateStatus(
														'rejected'
													)
												}
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
							</div>
						</CardContent>
					</Card>
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

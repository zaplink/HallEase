'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import SidebarLayout from '@/layouts/Sidebar/Layout';
import PageHeader from '@/components/custom/PageHeader';
import Loading from '@/components/custom/Loading';
import { createClient } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { toast } from 'sonner';
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
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
	const [error, setError] = useState<string | null>(null);
	const [updating, setUpdating] = useState(false);
	const [approveDialogOpen, setApproveDialogOpen] = useState(false);
	const [rejectDialogOpen, setRejectDialogOpen] = useState(false);

	useEffect(() => {
		fetchReservationDetails();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [reservationId]);

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

			if (reserveError) {
				throw new Error(
					`Failed to fetch reservation: ${reserveError.message}`
				);
			}

			if (!reserveData) {
				throw new Error('Reservation not found');
			}

			// Handle profiles which might be an array or single object
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
					console.error('Event fetch error:', eventError);
				} else if (eventData) {
					reservationDetails.event = {
						name: eventData.name,
						description: eventData.description,
						organizer: eventData.organizer,
						type: eventData.type,
						attendeeCount: eventData.attendee_count,
						additionalNotes: eventData.additional_notes,
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
					console.error('Lecture fetch error:', lectureError);
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
			console.error('Error fetching reservation details:', err);
			setError(
				err instanceof Error
					? err.message
					: 'Failed to load reservation details'
			);
		} finally {
			setLoading(false);
		}
	};

	const handleUpdateStatus = async (newStatus: 'approved' | 'rejected') => {
		if (!reservation) return;

		setUpdating(true);
		try {
			const supabase = createClient();
			const { error } = await supabase
				.from('reserve')
				.update({ status: newStatus })
				.eq('id', reservation.id);

			if (error) {
				throw new Error(`Failed to update status: ${error.message}`);
			}

			toast.success(`Reservation ${newStatus} successfully`);

			// Update local state
			setReservation((prev) =>
				prev ? { ...prev, status: newStatus } : null
			);
		} catch (err) {
			console.error('Error updating status:', err);
			toast.error(
				err instanceof Error
					? err.message
					: 'Failed to update reservation status'
			);
		} finally {
			setUpdating(false);
			setApproveDialogOpen(false);
			setRejectDialogOpen(false);
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
				<Loading reason='Loading reservation details' pageView />
			</SidebarLayout>
		);
	}

	if (error || !reservation) {
		return (
			<SidebarLayout>
				<PageHeader
					title='Review Reservation'
					descriptions={['Error loading reservation details']}
				/>
				<div className='container mx-auto px-4'>
					<div className='flex items-center justify-center min-h-[200px]'>
						<div className='text-center'>
							<p className='text-destructive mb-4'>
								{error || 'Reservation not found'}
							</p>
							<Button
								onClick={() => router.push('/all-reservations')}
							>
								<ArrowLeft className='h-4 w-4 mr-2' />
								Back to All Reservations
							</Button>
						</div>
					</div>
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

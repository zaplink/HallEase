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
import { ArrowLeft } from 'lucide-react';

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

export default function MyReservationReviewPage() {
	const params = useParams();
	const router = useRouter();
	const reservationId = params.id as string;

	const [reservation, setReservation] = useState<ReservationDetails | null>(
		null
	);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		fetchReservationDetails();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [reservationId]);

	const fetchReservationDetails = async () => {
		try {
			const supabase = createClient();
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
			if (reserveData.type === 'event') {
				const { data: eventData } = await supabase
					.from('event')
					.select(
						'name, description, organizer, type, attendee_count, additional_notes'
					)
					.eq('reserve_id', reservationId)
					.single();
				if (eventData) {
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
				const { data: lectureData } = await supabase
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
				if (lectureData) {
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
		return timeString.substring(0, 5);
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
					title='Reservation Details'
					descriptions={['Error loading reservation details']}
				/>
				<div className='container mx-auto px-4'>
					<div className='flex items-center justify-center min-h-[200px]'>
						<div className='text-center'>
							<p className='text-destructive mb-4'>
								{error || 'Reservation not found'}
							</p>
							<Button
								onClick={() => router.push('/my-reservations')}
							>
								<ArrowLeft className='h-4 w-4 mr-2' />
								Back to My Reservations
							</Button>
						</div>
					</div>
				</div>
			</SidebarLayout>
		);
	}

	return (
		<SidebarLayout>
			<PageHeader
				title='Reservation Details'
				descriptions={[`ID: ${reservation.id}`]}
			/>
			<div className='container mx-auto px-0 space-y-6'>
				<Card className='border border-muted bg-background rounded-md shadow-none px-6 py-6'>
					<CardHeader className='pb-2 px-0'>
						<CardTitle className='text-lg font-semibold tracking-tight text-foreground'>
							Reservation Details
						</CardTitle>
					</CardHeader>
					<CardContent className='space-y-6 pt-0 px-0'>
						<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
							<div className='space-y-1'>
								<div className='text-sm text-muted-foreground font-medium'>
									Date
								</div>
								<p className='text-base text-foreground'>
									{formatDate(reservation.date)}
								</p>
							</div>
							<div className='space-y-1'>
								<div className='text-sm text-muted-foreground font-medium'>
									Time
								</div>
								<p className='text-base text-foreground'>
									{formatTime(reservation.startTime)} -{' '}
									{formatTime(reservation.endTime)}
								</p>
							</div>
							<div className='space-y-1'>
								<div className='text-sm text-muted-foreground font-medium'>
									Booked by
								</div>
								<div>
									<p className='text-base text-foreground'>
										{reservation.profile.fullName}
									</p>
									<p className='text-sm text-muted-foreground'>
										{reservation.profile.email}
									</p>
									<p className='text-xs text-muted-foreground capitalize'>
										{reservation.profile.role}
									</p>
								</div>
							</div>
							<div className='space-y-1'>
								<div className='text-sm text-muted-foreground font-medium'>
									Hall Option
								</div>
								<p className='text-base text-foreground capitalize'>
									{reservation.hallOption}
								</p>
							</div>
							<div className='space-y-1'>
								<div className='text-sm text-muted-foreground font-medium'>
									Requested On
								</div>
								<p className='text-base text-foreground'>
									{formatDate(reservation.createdDate)}
								</p>
							</div>
							<div className='space-y-1'>
								<div className='text-sm text-muted-foreground font-medium'>
									Last Modified
								</div>
								<p className='text-base text-foreground'>
									{formatDate(reservation.modifiedDate)}{' '}
									{formatTime(reservation.modifiedTime)}
								</p>
							</div>
						</div>
						{reservation.type === 'event' && reservation.event && (
							<div className='pt-6'>
								<h4 className='text-base font-semibold mb-3 pb-2 border-b'>
									Event Details
								</h4>
								<div className='grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3'>
									<div>
										<span className='font-medium text-muted-foreground'>
											Event Name:{' '}
										</span>
										<span className='text-foreground'>
											{reservation.event.name}
										</span>
									</div>
									<div>
										<span className='font-medium text-muted-foreground'>
											Organizer:{' '}
										</span>
										<span className='text-foreground'>
											{reservation.event.organizer}
										</span>
									</div>
									<div>
										<span className='font-medium text-muted-foreground'>
											Event Type:{' '}
										</span>
										<span className='capitalize text-foreground'>
											{reservation.event.type}
										</span>
									</div>
									<div>
										<span className='font-medium text-muted-foreground'>
											Expected Attendees:{' '}
										</span>
										<span className='text-foreground'>
											{reservation.event.attendeeCount}
										</span>
									</div>
									{reservation.event.description && (
										<div className='col-span-2'>
											<span className='font-medium text-muted-foreground'>
												Description:{' '}
											</span>
											<span className='text-foreground/80'>
												{reservation.event.description}
											</span>
										</div>
									)}
									{reservation.event.additionalNotes && (
										<div className='col-span-2'>
											<span className='font-medium text-muted-foreground'>
												Additional Notes:{' '}
											</span>
											<span className='text-foreground/80'>
												{
													reservation.event
														.additionalNotes
												}
											</span>
										</div>
									)}
								</div>
							</div>
						)}
						{reservation.type === 'extra_lecture' &&
							reservation.extraLecture && (
								<div className='pt-6'>
									<h4 className='text-base font-semibold mb-3 pb-2 border-b'>
										Extra Lecture Details
									</h4>
									<div className='grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3'>
										<div>
											<span className='font-medium text-muted-foreground'>
												Course:{' '}
											</span>
											<span className='text-foreground'>
												{
													reservation.extraLecture
														.course.char
												}{' '}
												{
													reservation.extraLecture
														.course.digit
												}{' '}
												-{' '}
												{
													reservation.extraLecture
														.course.name
												}
											</span>
										</div>
										<div>
											<span className='font-medium text-muted-foreground'>
												Lecture Type:{' '}
											</span>
											<span className='capitalize text-foreground'>
												{reservation.extraLecture.type}
											</span>
										</div>
										<div>
											<span className='font-medium text-muted-foreground'>
												Expected Attendees:{' '}
											</span>
											<span className='text-foreground'>
												{
													reservation.extraLecture
														.attendeeCount
												}
											</span>
										</div>
										{reservation.extraLecture
											.description && (
											<div className='col-span-2'>
												<span className='font-medium text-muted-foreground'>
													Description:{' '}
												</span>
												<span className='text-foreground/80'>
													{
														reservation.extraLecture
															.description
													}
												</span>
											</div>
										)}
										{reservation.extraLecture
											.additionalNotes && (
											<div className='col-span-2'>
												<span className='font-medium text-muted-foreground'>
													Additional Notes:{' '}
												</span>
												<span className='text-foreground/80'>
													{
														reservation.extraLecture
															.additionalNotes
													}
												</span>
											</div>
										)}
									</div>
								</div>
							)}
					</CardContent>
				</Card>
			</div>
		</SidebarLayout>
	);
}

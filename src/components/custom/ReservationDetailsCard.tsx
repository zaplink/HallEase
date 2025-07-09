import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import React from 'react';

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

interface Props {
	reservation: ReservationDetails;
	formatDate: (date: string) => string;
	formatTime: (time: string) => string;
}

export const ReservationDetailsCard: React.FC<Props> = ({
	reservation,
	formatDate,
	formatTime,
}) => (
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
						{formatDate(reservation.createdDate)}{' '}
						{formatTime(reservation.createdTime)}
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
									{reservation.event.additionalNotes}
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
									{reservation.extraLecture.course.char}{' '}
									{reservation.extraLecture.course.digit} -{' '}
									{reservation.extraLecture.course.name}
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
									{reservation.extraLecture.attendeeCount}
								</span>
							</div>
							{reservation.extraLecture.description && (
								<div className='col-span-2'>
									<span className='font-medium text-muted-foreground'>
										Description:{' '}
									</span>
									<span className='text-foreground/80'>
										{reservation.extraLecture.description}
									</span>
								</div>
							)}
							{reservation.extraLecture.additionalNotes && (
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
);

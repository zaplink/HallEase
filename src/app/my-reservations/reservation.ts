export interface Reservation {
	description: string | null;
	type: 'event' | 'extra_lecture';
	date: Date | undefined;
	startHour: string;
	startMinute: string;
	endHour: string;
	endMinute: string;
	hallOpt: string;
	status: string;
}

export interface EventReservation extends Reservation {
	name: string;
	organizer: string;
	attendeeCount: number;
}

export interface LectureReservation extends Reservation {
	course_id: string;
}

export interface Course {
	id: string;
	char: string;
	digit: string;
	name: string;
}

export interface UnifiedReservationRow {
	id: string;
	name: string;
	date: string;
	startTime: string;
	endTime: string;
	type: 'event' | 'extra_lecture';
	status: string;
	bookedBy: string;
	createdDate: string;
	createdTime: string;
}

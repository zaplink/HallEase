export interface ReserveLectureFormData {
	course: string;
	description?: string;
	type: string;
	date: Date | undefined;
	startHour: string;
	startMinute: string;
	endHour: string;
	endMinute: string;
	hallOpt: string;
	hall?: string;
	equipment?: string[];
	additionalNotes?: string;
	additionalDocuments?: FileList | null;
	acceptTerms?: boolean;
}

export const defaultReserveLectureFormData: ReserveLectureFormData = {
	course: '',
	description: '',
	type: '',
	date: undefined,
	startHour: '',
	startMinute: '',
	endHour: '',
	endMinute: '',
	hallOpt: 'availability',
	hall: '',
	equipment: [],
	additionalNotes: '',
	additionalDocuments: null,
	acceptTerms: false,
};

export type SubmissionType = 'pending' | 'draft';

export const eventTypeOptions = [
	{ label: 'Extra Lecture', value: 'extra_lecture' },
	{ label: 'Quiz', value: 'quiz' },
	{ label: 'Practical', value: 'practical' },
];

export function mapBookingDataToApi(data: ReserveLectureFormData) {
	// Create time strings in HH:MM format
	const startTime = `${data.startHour.padStart(2, '0')}:${data.startMinute.padStart(2, '0')}`;
	const endTime = `${data.endHour.padStart(2, '0')}:${data.endMinute.padStart(2, '0')}`;

	// Convert equipment array to semicolon-separated string as per schema
	const equipmentString = data.equipment?.join(';') || '';

	return {
		// Reserve table fields
		course: data.course,
		date: data.date,
		start_time: startTime,
		end_time: endTime,
		hall_option: data.hallOpt,

		// Extra lecture table fields
		description: data.description || null,
		type: data.type,
		additional_notes: data.additionalNotes || null,
		equipment: equipmentString,
	};
}

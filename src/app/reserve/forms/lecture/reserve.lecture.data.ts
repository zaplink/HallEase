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
	additionalDocuments?: any;
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
	{ label: 'Extra Lecutre', value: 'extralecture' },
	{ label: 'Quiz', value: 'quiz' },
	{ label: 'Practical', value: 'practical' },
];

export function mapBookingDataToApi(data: ReserveLectureFormData) {
	return {
		course: data.course,
		description: data.description || null,
		type: data.type,
		date: data.date,
		start_hour: data.startHour,
		start_minute: data.startMinute,
		end_hour: data.endHour,
		end_minute: data.endMinute,
		hall_option: data.hallOpt,
		// hall: data.hall,
		additional_notes: data.additionalNotes || null,
	};
}

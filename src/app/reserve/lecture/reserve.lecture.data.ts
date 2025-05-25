export interface ReserveLectureFormData {
	course: string;
	description: null;
	type: null;
	date: undefined;
	startHour: '';
	startMinute: '';
	endHour: '';
	endMinute: '';
	hallOpt: string;
	hall: '';
	equipments: [];
	additionalNotes: null;
}

export const defaultReserveLectureFormData: ReserveLectureFormData = {
	course: '',
	description: null,
	type: null,
	date: undefined,
	startHour: '',
	startMinute: '',
	endHour: '',
	endMinute: '',
	hallOpt: '',
	hall: '',
	equipments: [],
	additionalNotes: null,
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
		description: data.description,
		type: data.type,
		date: data.date,
		start_hour: data.startHour,
		start_minute: data.startMinute,
		end_hour: data.endHour,
		end_minute: data.endMinute,
		hall_option: data.hallOpt,
		// hall: data.hall,
		additional_notes: data.additionalNotes,
	};
}

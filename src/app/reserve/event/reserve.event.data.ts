export interface ReserveEventFormData {
	name: string;
	description: string | null;
	type: EventType | null;
	organizer: string;
	date: Date | undefined;
	startHour: string;
	startMinute: string;
	endHour: string;
	endMinute: string;
	attendeeList?: FileList | null;
	attendeeCount: number;
	hallOpt: string;
	hall: string;
	equipments: EquipmentItemType[];
	additionalNotes: string | null;
}

export const defaultReserveEventFormData: ReserveEventFormData = {
	name: '',
	description: null,
	type: null,
	organizer: '',
	date: undefined,
	startHour: '',
	startMinute: '',
	endHour: '',
	endMinute: '',
	attendeeCount: 0,
	attendeeList: null,
	hallOpt: '',
	hall: '',
	equipments: [],
	additionalNotes: null,
};

// Mapper function to convert form data from camelCase to snake_case
export function mapBookingDataToApi(data: ReserveEventFormData) {
	return {
		name: data.name,
		description: data.description,
		type: data.type,
		organizer: data.organizer,
		date: data.date,
		start_hour: data.startHour,
		start_minute: data.startMinute,
		end_hour: data.endHour,
		end_minute: data.endMinute,
		attendee_count: data.attendeeCount,
		// attendee_list: data.attendeeList,
		hall_option: data.hallOpt,
		// hall: data.hall,
		// additional_notes: data.additionalNotes,
	};
}

export type EventType = (typeof eventTypeOptions)[number]['value'];

export type EquipmentItemType = {
	name: (typeof equipmentOptions)[number]['value'];
	count: number;
};

export const eventTypeOptions = [
	{ label: 'Conference', value: 'conference' },
	{ label: 'Event', value: 'event' },
	{ label: 'Workshop', value: 'workshop' },
	{ label: 'Seminar', value: 'seminar' },
];

export const equipmentOptions = [
	{ label: 'Smart Board', value: 'smartboard' },
	{ label: 'Projector', value: 'projector' },
	{ label: 'Laptop', value: 'laptop' },
	{ label: 'Microphone', value: 'microphone' },
];

export type SubmissionType = 'pending' | 'draft';

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
	// Create time strings in HH:MM format
	const startTime = `${data.startHour.padStart(2, '0')}:${data.startMinute.padStart(2, '0')}`;
	const endTime = `${data.endHour.padStart(2, '0')}:${data.endMinute.padStart(2, '0')}`;

	// Convert equipment array to semicolon-separated string as per schema
	const equipmentString =
		data.equipments?.map((eq) => eq.name).join(';') || '';

	// Format date to YYYY-MM-DD string for database
	const formattedDate = data.date
		? data.date.toISOString().split('T')[0]
		: null;

	console.log('Mapping data:', {
		originalData: data,
		startTime,
		endTime,
		equipmentString,
		formattedDate,
	});

	return {
		// Reserve table fields
		date: formattedDate,
		start_time: startTime,
		end_time: endTime,
		hall_option: data.hallOpt,

		// Event table fields
		name: data.name,
		description: data.description,
		type: data.type,
		organizer: data.organizer,
		attendee_count: data.attendeeCount,
		additional_notes: data.additionalNotes,
		equipment: equipmentString,
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

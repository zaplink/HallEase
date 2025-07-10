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
	acceptTerms?: boolean; // Add consent field
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
	acceptTerms: false,
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

// Helper to format event date and time for email
export function formatEventDateTime(data: ReserveEventFormData): string {
	if (!data.date) return 'N/A';
	if (
		!data.startHour ||
		!data.startMinute ||
		!data.endHour ||
		!data.endMinute
	)
		return 'N/A';

	const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
	const weekday = days[data.date.getDay()];
	const dateStr = data.date.toLocaleDateString();
	const start = `${data.startHour.padStart(2, '0')}:${data.startMinute.padStart(2, '0')}`;
	const end = `${data.endHour.padStart(2, '0')}:${data.endMinute.padStart(2, '0')}`;
	return `${weekday}, ${dateStr}, ${start} - ${end}`;
}

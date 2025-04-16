// Types of hall booking form data
export interface BookingFormData {
	name: string;
	type: string;
	description: string;
	attendeeCount: number;
	date: Date | undefined;
	startTime: string;
	endTime: string;
	hall: string;
}

// Default values of hall booking form data
export const defaultBookingFormData: BookingFormData = {
	name: '',
	type: '',
	description: '',
	attendeeCount: 0,
	date: undefined,
	startTime: '',
	endTime: '',
	hall: '',
};

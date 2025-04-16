import { supabase } from '@/lib/supabaseClient';
import { BookingFormData } from './booking.types';

// Use to submit booking form details
export async function submitBooking(formData: BookingFormData) {
	const mappedFormData = mapBookingDataToApi(formData);
	const { data, error } = await supabase
		.from('bookings')
		.insert([mappedFormData]);

	if (error) throw new Error(error.message);

	return data;
}

// Mapper function to convert form data from camelCase to snake_case
function mapBookingDataToApi(data: BookingFormData) {
	return {
		name: data.name,
		type: data.type,
		description: data.description,
		attendee_count: data.attendeeCount,
		date: data.date,
		start_time: data.startTime,
		end_time: data.endTime,
		hall: data.hall,
	};
}

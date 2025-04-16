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

// Realtime notifications
// Subscribe to real-time updates from the 'bookings' table

// Subscribe to real-time updates from the 'bookings' table
export function subscribeToNewBookings(
	callback: (newBooking: BookingFormData) => void
) {
	const channel = supabase
		.channel('booking-channel') // Channel name
		.on(
			'postgres_changes',
			{ event: 'INSERT', schema: 'public', table: 'bookings' },
			(payload) => {
				// The callback that will be triggered when a new booking is inserted
				if (payload.new) {
					callback(payload.new as BookingFormData); // Pass the new booking data
				}
			}
		)
		.subscribe();

	return channel;
}

import { supabase } from '@/lib/supabaseClient';
import { BookingFormData, mapBookingDataToApi } from './reserve.event.data';

// Use to submit booking form details
export async function submitBooking(
	formData: BookingFormData,
	status: 'pending' | 'draft'
) {
	const mappedFormData = mapBookingDataToApi(formData);

	const enrichedData = {
		...mappedFormData,
		status,
	};

	const { data, error } = await supabase
		.from('bookings')
		.insert([enrichedData]);

	if (error) throw new Error(error.message);

	return data;
}

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

import { supabase } from '@/lib/supabaseClient';
import {
	ReserveLectureFormData,
	mapBookingDataToApi,
} from './reserve.lecture.data';

// Use to submit booking form details
export async function submitBooking(
	formData: ReserveLectureFormData,
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
	callback: (newBooking: ReserveLectureFormData) => void
) {
	const channel = supabase
		.channel('booking-channel') // Channel name
		.on(
			'postgres_changes',
			{ event: 'INSERT', schema: 'public', table: 'bookings' },
			(payload) => {
				// The callback that will be triggered when a new booking is inserted
				if (payload.new) {
					callback(payload.new as ReserveLectureFormData); // Pass the new booking data
				}
			}
		)
		.subscribe();

	return channel;
}

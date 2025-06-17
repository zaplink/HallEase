import { supabase } from '@/lib/supabaseClient';
import {
	ReserveLectureFormData,
	mapBookingDataToApi,
} from './reserve.lecture.data';
import { pick } from 'lodash';

const {
	data: { user },
	error: userError,
} = await supabase.auth.getUser();

if (userError) {
	throw new Error(userError.message);
}

const profileId = user?.id;

// Use to submit booking form details
export async function submitBooking(
	formData: ReserveLectureFormData,
	status: 'pending' | 'draft'
) {
	const mappedFormData = mapBookingDataToApi(formData);

	// const enrichedData = {
	// 	...mappedFormData,
	// 	status,
	// };

	const reserveData = {
		...pick(mappedFormData, [
			'date',
			'start_hour',
			'start_minute',
			'end_hour',
			'end_minute',
			'hall_option',
			'description',
		]),
		status,
		type: 'lecture',
		profile_id: profileId,
	};

	const { data: reserveDataResult, error: reserveDataError } = await supabase
		.from('reserve')
		.insert([reserveData])
		.select('id');

	if (reserveDataError) {
		console.log(reserveDataError);
		throw new Error(reserveDataError.message);
	}
	const reserveId = reserveDataResult?.[0]?.id;

	const lectureData = {
		...pick(mappedFormData, ['type']),
		status,
		reserve_id: reserveId,
		course_id: mappedFormData.course,
	};

	const { data: lectureDataResult, error: lectureDataError } = await supabase
		.from('extra_lecture')
		.insert([lectureData])
		.select('id');

	if (lectureDataError) throw new Error(lectureDataError.message);
	const lectureId = lectureDataResult?.[0]?.id;

	return {
		reserveId,
		lectureId,
	};
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

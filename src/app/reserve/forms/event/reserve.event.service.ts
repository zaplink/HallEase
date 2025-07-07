import { supabase } from '@/lib/supabaseClient';
import {
	ReserveEventFormData,
	mapBookingDataToApi,
} from './reserve.event.data';
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
export async function submitReserveEvent(
	formData: ReserveEventFormData,
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
		type: 'event',
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

	const eventData = {
		...pick(mappedFormData, [
			'name',
			'type',
			'organizer',
			'attendee_count',
		]),
		status,
		reserve_id: reserveId,
	};

	const { data: eventDataResult, error: eventDataError } = await supabase
		.from('event')
		.insert([eventData])
		.select('id');

	if (eventDataError) throw new Error(eventDataError.message);
	const eventId = eventDataResult?.[0]?.id;

	// Fetch requester email from profile table
	let requesterEmail: string | null = null;
	if (profileId) {
		const { data: profileData, error: profileError } = await supabase
			.from('profiles')
			.select('email')
			.eq('id', profileId)
			.single();
		if (profileError) {
			console.log(profileError);
			throw new Error(profileError.message);
		}
		requesterEmail = profileData?.email ?? null;
	}

	return {
		reserveId,
		eventId,
		requesterEmail, // <-- now returned!
	};

	// const { error: reserveEventsError } = await supabase
	// 	.from('reserve')
	// 	.update({ event_id: eventId })
	// 	.eq('id', reserveId);
	// if (reserveEventsError) throw new Error(reserveEventsError.message);

	// const { error: reserveEventsError } = await supabase
	// 	.from('event')
	// 	.update({ reserve_id: reserveId })
	// 	.eq('id', eventId);
	// if (reserveEventsError) throw new Error(reserveEventsError.message);

	// const { error: joinReserveEventsError } = await supabase
	// 	.from('reserve_events')
	// 	.insert([
	// 		{
	// 			reserve_id: reserveId,
	// 			event_id: eventId,
	// 		},
	// 	]);
	// if (joinReserveEventsError) throw new Error(joinReserveEventsError.message);

	// return {
	// 	reserveId,
	// 	eventId,
	// };

	// return { reserveData: reserveDataResult, eventData: eventDataResult };
}

// Subscribe to real-time updates from the 'bookings' table
export function subscribeToNewBookings(
	callback: (newReserveEvent: ReserveEventFormData) => void
) {
	const channel = supabase
		.channel('reserve-event-channel') // Channel name
		.on(
			'postgres_changes',
			{ event: 'INSERT', schema: 'public', table: 'event' },
			(payload) => {
				// The callback that will be triggered when a new booking is inserted
				if (payload.new) {
					callback(payload.new as ReserveEventFormData); // Pass the new booking data
				}
			}
		)
		.subscribe();

	return channel;
}

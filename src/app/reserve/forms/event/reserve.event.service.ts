import { supabase } from '@/lib/supabaseClient';
import {
	ReserveEventFormData,
	mapBookingDataToApi,
} from './reserve.event.data';

// Use to submit booking form details
export async function submitReserveEvent(
	formData: ReserveEventFormData,
	status: 'pending' | 'draft'
) {
	console.log('submitReserveEvent called with:', { formData, status });

	// Get current user
	const {
		data: { user },
		error: userError,
	} = await supabase.auth.getUser();

	if (userError) {
		throw new Error(userError.message);
	}

	const profileId = user?.id;
	if (!profileId) {
		throw new Error('User not authenticated');
	}

	const mappedFormData = mapBookingDataToApi(formData);
	console.log('Mapped form data:', mappedFormData);

	const now = new Date();

	// Prepare reserve table data according to schema
	const reserveData = {
		date: mappedFormData.date,
		start_time: mappedFormData.start_time,
		end_time: mappedFormData.end_time,
		hall_option: mappedFormData.hall_option || 'availability',
		status,
		type: 'event' as const,
		profile_id: profileId,
		modified_date: now.toISOString().split('T')[0], // YYYY-MM-DD format
		modified_time: now.toTimeString().split(' ')[0], // HH:MM:SS format
		is_submitted: status === 'pending', // true for submitted, false for draft
	};

	console.log('Reserve data to insert:', reserveData);

	// Insert into reserve table
	const { data: reserveDataResult, error: reserveDataError } = await supabase
		.from('reserve')
		.insert([reserveData])
		.select('id');

	console.log('Reserve insert result:', {
		reserveDataResult,
		reserveDataError,
	});

	if (reserveDataError) {
		console.log('Reserve data error:', reserveDataError);
		throw new Error(reserveDataError.message);
	}
	const reserveId = reserveDataResult?.[0]?.id;

	// Insert equipment if any equipment is selected
	let equipmentId: string | null = null;
	if (mappedFormData.equipment && mappedFormData.equipment.trim()) {
		const equipmentData = {
			reserve_id: reserveId,
			description: mappedFormData.equipment, // Already semicolon-separated from mapping
		};

		const { data: equipmentResult, error: equipmentError } = await supabase
			.from('equipment')
			.insert([equipmentData])
			.select('id');

		if (equipmentError) {
			console.log('Equipment data error:', equipmentError);
			throw new Error(equipmentError.message);
		}
		equipmentId = equipmentResult?.[0]?.id;
	}

	// Prepare event table data according to schema
	const eventData = {
		name: mappedFormData.name,
		description: mappedFormData.description || '',
		organizer: mappedFormData.organizer,
		type: mappedFormData.type,
		attendee_count: mappedFormData.attendee_count || 0,
		reserve_id: reserveId,
		additional_notes: mappedFormData.additional_notes || '',
		additional_file: '', // Empty for now, can be populated with file upload logic
		equipment: equipmentId, // UUID foreign key to equipment table
	};

	console.log('Event data to insert:', eventData);

	// Insert into event table
	const { data: eventDataResult, error: eventDataError } = await supabase
		.from('event')
		.insert([eventData])
		.select('id');

	console.log('Event insert result:', { eventDataResult, eventDataError });

	if (eventDataError) {
		console.log('Event data error:', eventDataError);
		throw new Error(eventDataError.message);
	}
	const eventId = eventDataResult?.[0]?.id;

	// Fetch requester email from profiles table
	let requesterEmail: string | null = null;
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

	return {
		reserveId,
		eventId,
		requesterEmail,
	};
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

// Fetch a single event draft by reserve (draft) ID, joining reserve and event tables
export async function getReserveDraftById(draftId: string) {
	if (!draftId) throw new Error('No draftId provided');
	// Fetch reserve row
	const { data: reserve, error: reserveError } = await supabase
		.from('reserve')
		.select(
			`
	  id,
	  date,
	  start_time,
	  end_time,
	  hall_option,
	  status,
	  type,
	  profile_id,
	  modified_date,
	  modified_time,
	  is_submitted,
	  is_consented,
	  created_date,
	  created_time,
	  event (
		id,
		name,
		description,
		organizer,
		type,
		attendee_count,
		additional_notes,
		additional_file,
		equipment
	  )
	`
		)
		.eq('id', draftId)
		.eq('type', 'event')
		.eq('is_submitted', false)
		.single();

	if (reserveError) throw new Error(reserveError.message);
	if (!reserve) throw new Error('Draft not found');

	// Flatten event fields into top-level object for easier form mapping
	const event = Array.isArray(reserve.event)
		? reserve.event[0] || {}
		: reserve.event || {};
	return {
		id: reserve.id,
		date: reserve.date,
		start_time: reserve.start_time,
		end_time: reserve.end_time,
		hall_option: reserve.hall_option,
		status: reserve.status,
		type: reserve.type,
		profile_id: reserve.profile_id,
		modified_date: reserve.modified_date,
		modified_time: reserve.modified_time,
		is_submitted: reserve.is_submitted,
		is_consented: reserve.is_consented,
		created_date: reserve.created_date,
		created_time: reserve.created_time,
		// Event-specific fields
		name: event.name || '',
		description: event.description || '',
		organizer: event.organizer || '',
		event_type: event.type || '',
		attendee_count: event.attendee_count || 0,
		additional_notes: event.additional_notes || '',
		additional_file: event.additional_file || '',
		equipment: event.equipment || '',
	};
}
import { supabase } from '@/lib/supabaseClient';
import {
	ReserveEventFormData,
	mapBookingDataToApi,
} from './reserve.event.data';

// Use to submit booking form details
export async function submitReserveEvent(
	formData: ReserveEventFormData,
	status: 'pending' | 'draft',
	draftId?: string // Optional draft ID for updating existing draft
) {
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
		created_date: now.toISOString().split('T')[0], // YYYY-MM-DD format
		created_time: now.toTimeString().split(' ')[0], // HH:MM:SS format
		modified_date: now.toISOString().split('T')[0], // YYYY-MM-DD format
		modified_time: now.toTimeString().split(' ')[0], // HH:MM:SS format
		is_submitted: status === 'pending', // true for submitted, false for draft
		is_consented: status === 'pending', // true if submitted (consented), false for draft
	};

	console.log('Reserve data to insert/update:', reserveData);
	console.log('Mapped form data:', mappedFormData);
	console.log('Status:', status);
	console.log('Draft ID:', draftId);

	let reserveId: string;

	if (draftId) {
		// Update existing draft
		const { data: reserveUpdateResult, error: reserveUpdateError } =
			await supabase
				.from('reserve')
				.update(reserveData)
				.eq('id', draftId)
				.eq('profile_id', profileId) // Security check
				.select('id');

		console.log('Reserve update result:', {
			reserveUpdateResult,
			reserveUpdateError,
		});

		if (reserveUpdateError) {
			console.log('Reserve update error:', reserveUpdateError);
			throw new Error(reserveUpdateError.message);
		}

		if (!reserveUpdateResult || reserveUpdateResult.length === 0) {
			throw new Error(
				'Draft not found or you do not have permission to update it'
			);
		}

		reserveId = reserveUpdateResult[0].id;
	} else {
		// Insert new reserve record
		const { data: reserveDataResult, error: reserveDataError } =
			await supabase.from('reserve').insert([reserveData]).select('id');

		console.log('Reserve insert result:', {
			reserveDataResult,
			reserveDataError,
		});

		if (reserveDataError) {
			console.log('Reserve data error:', reserveDataError);
			console.error(
				'Detailed error:',
				JSON.stringify(reserveDataError, null, 2)
			);
			throw new Error(reserveDataError.message);
		}

		if (!reserveDataResult || reserveDataResult.length === 0) {
			console.error('No reserve data returned after insert');
			throw new Error('No reserve ID returned after insertion');
		}

		reserveId = reserveDataResult?.[0]?.id;
		console.log('New reserve created with ID:', reserveId);
	}

	// Handle equipment - delete old equipment first if updating draft
	if (draftId) {
		// Delete existing equipment for this reserve
		await supabase.from('equipment').delete().eq('reserve_id', reserveId);
	}

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

	console.log('Event data to insert/update:', eventData);

	let eventId: string;

	if (draftId) {
		// Update existing event
		const { data: eventUpdateResult, error: eventUpdateError } =
			await supabase
				.from('event')
				.update(eventData)
				.eq('reserve_id', reserveId)
				.select('id');

		console.log('Event update result:', {
			eventUpdateResult,
			eventUpdateError,
		});

		if (eventUpdateError) {
			console.log('Event update error:', eventUpdateError);
			throw new Error(eventUpdateError.message);
		}
		eventId = eventUpdateResult?.[0]?.id;
	} else {
		// Insert new event
		const { data: eventDataResult, error: eventDataError } = await supabase
			.from('event')
			.insert([eventData])
			.select('id');

		console.log('Event insert result:', {
			eventDataResult,
			eventDataError,
		});

		if (eventDataError) {
			console.log('Event data error:', eventDataError);
			console.error(
				'Detailed event error:',
				JSON.stringify(eventDataError, null, 2)
			);
			throw new Error(eventDataError.message);
		}

		if (!eventDataResult || eventDataResult.length === 0) {
			console.error('No event data returned after insert');
			throw new Error('No event ID returned after insertion');
		}

		eventId = eventDataResult?.[0]?.id;
		console.log('New event created with ID:', eventId);
	}

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

	console.log('Final result - Reserve ID:', reserveId, 'Event ID:', eventId);

	// Verify the draft was saved by querying it back
	if (status === 'draft') {
		const { data: verifyData, error: verifyError } = await supabase
			.from('reserve')
			.select('id, is_submitted, type')
			.eq('id', reserveId)
			.single();

		console.log('Draft verification result:', { verifyData, verifyError });

		if (verifyError) {
			console.error('Failed to verify draft was saved:', verifyError);
		} else {
			console.log(
				'Draft verified - ID:',
				verifyData.id,
				'is_submitted:',
				verifyData.is_submitted
			);
		}
	}

	return {
		reserveId,
		eventId,
		requesterEmail,
	};
}

// Subscribe to real-time updates from the 'reserve' table
export function subscribeToNewBookings(
	callback: (newReserveEvent: unknown) => void
) {
	const channel = supabase
		.channel('reserve-event-channel') // Channel name
		.on(
			'postgres_changes',
			{ event: 'INSERT', schema: 'public', table: 'reserve' },
			(payload) => {
				// The callback that will be triggered when a new booking is inserted
				if (payload.new) {
					callback(payload.new); // Pass the new booking data
				}
			}
		)
		.subscribe();

	return channel;
}

// Function to load existing drafts for the current user
export async function loadUserDrafts() {
	const {
		data: { user },
		error: userError,
	} = await supabase.auth.getUser();

	if (userError || !user?.id) {
		throw new Error('User not authenticated');
	}

	const { data: drafts, error: draftsError } = await supabase
		.from('reserve')
		.select(
			`
			id,
			date,
			start_time,
			end_time,
			hall_option,
			status,
			modified_date,
			modified_time,
			event (
				id,
				name,
				description,
				organizer,
				type,
				attendee_count,
				additional_notes,
				equipment (
					id,
					description
				)
			)
		`
		)
		.eq('profile_id', user.id)
		.eq('type', 'event')
		.eq('is_submitted', false); // Only get drafts

	if (draftsError) {
		throw new Error(draftsError.message);
	}

	return drafts || [];
}

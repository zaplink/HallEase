import { supabase } from '@/lib/supabaseClient';
import {
	ReserveLectureFormData,
	mapBookingDataToApi,
} from './reserve.lecture.data';

// Use to submit booking form details
export async function submitBooking(
	formData: ReserveLectureFormData,
	status: 'pending' | 'draft',
	draftId?: string // Optional draft ID for updating existing draft
) {
	console.log('submitBooking called with:', { formData, status, draftId });
	console.log('Form data date:', formData.date);
	console.log('Form data times:', {
		startHour: formData.startHour,
		startMinute: formData.startMinute,
		endHour: formData.endHour,
		endMinute: formData.endMinute,
	});

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
		hall_option: mappedFormData.hall_option,
		status,
		type: 'extra_lecture' as const,
		profile_id: profileId,
		created_date: now.toISOString().split('T')[0], // YYYY-MM-DD format
		created_time: now.toTimeString().split(' ')[0], // HH:MM:SS format
		modified_date: now.toISOString().split('T')[0], // YYYY-MM-DD format
		modified_time: now.toTimeString().split(' ')[0], // HH:MM:SS format
		is_submitted: status === 'pending', // true for submitted, false for draft
		is_consented: status === 'pending', // true if submitted (consented), false for draft
	};

	console.log('Reserve data to insert/update:', reserveData);

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

		if (reserveDataError) {
			console.log(reserveDataError);
			throw new Error(reserveDataError.message);
		}
		reserveId = reserveDataResult?.[0]?.id;
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

	// Find course_id based on course UUID (the form stores the UUID as the value)
	let courseId: string | null = null;
	if (mappedFormData.course) {
		// The course field already contains the UUID from the form selection
		courseId = mappedFormData.course;

		// Optionally verify the course exists
		const { data: courseData, error: courseError } = await supabase
			.from('course')
			.select('id, char, digit')
			.eq('id', mappedFormData.course)
			.single();

		if (courseError) {
			console.log('Course verification failed:', courseError);
			console.log('Submitted course ID:', mappedFormData.course);
			// Continue with the course ID anyway - it might be valid
		} else {
			console.log('Course verified:', courseData);
		}
	}

	// Prepare extra_lecture table data according to schema
	const extraLectureData = {
		description: mappedFormData.description,
		attendee_count: 0, // Default value, can be updated if needed
		reserve_id: reserveId,
		course_id: courseId,
		type: mappedFormData.type,
		additional_notes: mappedFormData.additional_notes,
		additional_file: '', // Empty for now, can be populated with file upload logic
		attendee_file: '', // Empty for now
		equipment: equipmentId, // UUID foreign key to equipment table
	};

	let extraLectureId: string;

	if (draftId) {
		// Update existing extra_lecture
		const {
			data: extraLectureUpdateResult,
			error: extraLectureUpdateError,
		} = await supabase
			.from('extra_lecture')
			.update(extraLectureData)
			.eq('reserve_id', reserveId)
			.select('id');

		if (extraLectureUpdateError) {
			throw new Error(extraLectureUpdateError.message);
		}
		extraLectureId = extraLectureUpdateResult?.[0]?.id;
	} else {
		// Insert new extra_lecture
		const { data: extraLectureDataResult, error: extraLectureDataError } =
			await supabase
				.from('extra_lecture')
				.insert([extraLectureData])
				.select('id');

		if (extraLectureDataError) {
			throw new Error(extraLectureDataError.message);
		}
		extraLectureId = extraLectureDataResult?.[0]?.id;
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

	return {
		reserveId,
		extraLectureId,
		requesterEmail,
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
			extra_lecture (
				id,
				description,
				attendee_count,
				course_id,
				type,
				additional_notes,
				equipment (
					id,
					description
				)
			)
		`
		)
		.eq('profile_id', user.id)
		.eq('type', 'extra_lecture')
		.eq('is_submitted', false); // Only get drafts

	if (draftsError) {
		throw new Error(draftsError.message);
	}

	return drafts || [];
}

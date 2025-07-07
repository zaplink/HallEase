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
		hall_option: mappedFormData.hall_option,
		status,
		type: 'extra_lecture',
		profile_id: profileId,
		modified_date: now.toISOString().split('T')[0], // YYYY-MM-DD format
		modified_time: now.toTimeString().split(' ')[0], // HH:MM:SS format
		is_submitted: status === 'pending', // true for submitted, false for draft
	};

	// Insert into reserve table
	const { data: reserveDataResult, error: reserveDataError } = await supabase
		.from('reserve')
		.insert([reserveData])
		.select('id');

	if (reserveDataError) {
		console.log(reserveDataError);
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

	// Find course_id based on course code
	let courseId: string | null = null;
	if (mappedFormData.course) {
		const { data: courseData, error: courseError } = await supabase
			.from('course')
			.select('id')
			.eq('char', mappedFormData.course)
			.single();

		if (courseError) {
			console.log('Course not found:', courseError);
			// Continue without course_id if course not found
		} else {
			courseId = courseData?.id;
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

	// Insert into extra_lecture table
	const { data: extraLectureDataResult, error: extraLectureDataError } =
		await supabase
			.from('extra_lecture')
			.insert([extraLectureData])
			.select('id');

	if (extraLectureDataError) {
		throw new Error(extraLectureDataError.message);
	}
	const extraLectureId = extraLectureDataResult?.[0]?.id;

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

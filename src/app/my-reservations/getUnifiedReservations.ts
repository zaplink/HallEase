import { createClient } from '@/lib/supabaseClient';
import { UnifiedReservationRow } from './reservation';

export async function getUnifiedReservations(): Promise<
	UnifiedReservationRow[]
> {
	const supabase = createClient();

	try {
		// Get current user
		const {
			data: { user },
			error: userError,
		} = await supabase.auth.getUser();
		if (userError || !user) {
			console.error('User not authenticated', userError);
			return [];
		}

		// Get all submitted reservations for this user with profile information
		const { data: reserves, error: reserveError } = await supabase
			.from('reserve')
			.select(
				`
				id,
				date,
				start_time,
				end_time,
				status,
				type,
				created_date,
				created_time,
				profiles:profile_id (
					full_name
				)
			`
			)
			.eq('is_submitted', true)
			.eq('profile_id', user.id);

		if (reserveError) {
			console.error('Error fetching reserves:', reserveError);
			return [];
		}

		if (!reserves || reserves.length === 0) {
			return [];
		}

		// Separate event and extra_lecture reserve IDs
		const eventReserveIds = reserves
			.filter((r) => r.type === 'event')
			.map((r) => r.id);

		const lectureReserveIds = reserves
			.filter((r) => r.type === 'extra_lecture')
			.map((r) => r.id);

		// Fetch event details
		const { data: events, error: eventError } =
			eventReserveIds.length > 0
				? await supabase
						.from('event')
						.select('name, reserve_id')
						.in('reserve_id', eventReserveIds)
				: { data: [], error: null };

		// Fetch extra lecture details with course information
		const { data: lectures, error: lectureError } =
			lectureReserveIds.length > 0
				? await supabase
						.from('extra_lecture')
						.select(
							`
							reserve_id,
							course:course_id (
								char,
								digit
							)
						`
						)
						.in('reserve_id', lectureReserveIds)
				: { data: [], error: null };

		if (eventError) {
			console.error('Error fetching events:', eventError);
		}
		if (lectureError) {
			console.error('Error fetching lectures:', lectureError);
		}

		// Create maps for quick lookup
		const eventMap = new Map(
			(events || []).map((event) => [event.reserve_id, event])
		);

		const lectureMap = new Map(
			(lectures || []).map((lecture) => [lecture.reserve_id, lecture])
		);

		// Build unified results
		const unifiedRows: UnifiedReservationRow[] = reserves.map((reserve) => {
			const profile = Array.isArray(reserve.profiles)
				? reserve.profiles[0]
				: reserve.profiles;

			let name = 'Unknown';

			if (reserve.type === 'event') {
				const event = eventMap.get(reserve.id);
				name = event?.name || 'Unnamed Event';
			} else if (reserve.type === 'extra_lecture') {
				const lecture = lectureMap.get(reserve.id);
				const course = Array.isArray(lecture?.course)
					? lecture.course[0]
					: lecture?.course;

				if (course && course.char && course.digit) {
					name = `${course.char} ${course.digit}`;
				} else {
					name = 'Unknown Course';
				}
			}

			return {
				id: reserve.id,
				name,
				type: reserve.type as 'event' | 'extra_lecture',
				bookedBy: profile?.full_name || 'Unknown User',
				date: reserve.date || '',
				startTime: reserve.start_time || '',
				endTime: reserve.end_time || '',
				status: reserve.status || 'pending',
				createdDate: reserve.created_date || '',
				createdTime: reserve.created_time || '',
				// Set default empty values for modified fields since they don't exist in the database
				modifiedDate: '',
				modifiedTime: '',
			};
		});

		return unifiedRows;
	} catch (error) {
		console.error('Unexpected error fetching reservations:', error);
		return [];
	}
}

import { createClient } from '@/lib/supabaseClient';

export interface DraftSummary {
	id: string;
	name: string;
	organizer: string;
	type: 'event' | 'extra_lecture';
	lastModified: Date;
}

export async function getRecentDrafts(
	limit: number = 5
): Promise<DraftSummary[]> {
	const supabase = createClient();

	try {
		const {
			data: { user },
			error: userError,
		} = await supabase.auth.getUser();

		if (userError || !user) {
			console.error('User not authenticated', userError);
			return [];
		}

		// Get recent draft reservations for this user
		const { data: reserves, error: reserveError } = await supabase
			.from('reserve')
			.select(
				`
        id,
        date,
        type,
        created_date,
        created_time,
        modified_date,
        modified_time,
        profiles:profile_id (
          full_name
        )
      `
			)
			.eq('is_submitted', false)
			.eq('profile_id', user.id)
			.order('created_date', { ascending: false })
			.order('created_time', { ascending: false })
			.limit(limit);

		console.log('getRecentDrafts - User ID:', user.id);
		console.log('getRecentDrafts - Reserve query result:', {
			reserves,
			reserveError,
		});

		if (reserveError) {
			console.error(
				'Error fetching recent draft reserves:',
				reserveError
			);
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
						.select('name, reserve_id, organizer')
						.in('reserve_id', eventReserveIds)
				: { data: [], error: null };

		console.log('getRecentDrafts - Event query result:', {
			events,
			eventError,
		});
		console.log('getRecentDrafts - Event reserve IDs:', eventReserveIds);

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

		// Build draft summaries
		const draftSummaries: DraftSummary[] = reserves.map((reserve) => {
			const profile = Array.isArray(reserve.profiles)
				? reserve.profiles[0]
				: reserve.profiles;

			let name = 'Untitled';
			let organizer = profile?.full_name || 'Unknown';

			if (reserve.type === 'event') {
				const event = eventMap.get(reserve.id);
				name = event?.name || 'Untitled Event';
				organizer = event?.organizer || organizer;
			} else if (reserve.type === 'extra_lecture') {
				const lecture = lectureMap.get(reserve.id);
				const course = Array.isArray(lecture?.course)
					? lecture.course[0]
					: lecture?.course;

				if (course && course.char && course.digit) {
					name = `${course.char} ${course.digit}`;
				} else {
					name = 'Untitled Lecture';
				}
			}

			// Use modified date if available, otherwise use created date
			const dateStr = reserve.modified_date || reserve.created_date;
			const timeStr = reserve.modified_time || reserve.created_time;

			let lastModified = new Date();
			if (dateStr && timeStr) {
				lastModified = new Date(`${dateStr}T${timeStr}`);
			}

			return {
				id: reserve.id,
				name,
				organizer,
				type: reserve.type as 'event' | 'extra_lecture',
				lastModified,
			};
		});

		console.log('getRecentDrafts - Final draft summaries:', draftSummaries);
		return draftSummaries;
	} catch (error) {
		console.error('Unexpected error fetching recent drafts:', error);
		return [];
	}
}

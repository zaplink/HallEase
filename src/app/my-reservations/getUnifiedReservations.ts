import { createClient } from '@/lib/supabaseClient';
import { UnifiedReservationRow } from './reservation';

interface Reserve {
	date: string;
	start_hour: string;
	start_minute: string;
	end_hour: string;
	end_minute: string;
	profile_id: string;
}

interface Course {
	char: string;
	digit: string;
	name: string;
}

interface EventWithReserve {
	name: string;
	organizer: string;
	attendee_count: number;
	status: string;
	reserve: Reserve;
}

interface LectureWithReserve {
	status: string;
	reserve: Reserve;
	course: Course;
}

export async function getUnifiedReservations(): Promise<
	UnifiedReservationRow[]
> {
	const supabase = createClient();

	const {
		data: { user },
		error: userError,
	} = await supabase.auth.getUser();

	if (userError || !user) {
		console.error('User not authenticated', userError);
		return [];
	}

	const [eventRes, lectureRes] = await Promise.all([
		supabase.from('event').select(`
			name,
			organizer,
			attendee_count,
			status,
			reserve:reserve_id (
				date,
				start_hour,
				start_minute,
				end_hour,
				end_minute,
				profile_id
			)
		`),
		supabase.from('extra_lecture').select(`
			status,
			reserve:reserve_id (
				date,
				start_hour,
				start_minute,
				end_hour,
				end_minute,
				profile_id
			),
			course: course_id (
				char,
				digit,
				name
			)
		`),
	]);

	if (eventRes.error || lectureRes.error) {
		console.error(
			'Failed to fetch reservations:',
			eventRes.error,
			lectureRes.error
		);
		return [];
	}

	const userId = user.id;

	const eventData: EventWithReserve[] = (eventRes.data ?? [])
		.map((e) => {
			const reserveRaw = Array.isArray(e.reserve)
				? e.reserve[0]
				: e.reserve;
			if (!reserveRaw || reserveRaw.profile_id !== userId) return null;

			const reserve: Reserve = reserveRaw as Reserve;

			return {
				name: e.name as string,
				organizer: e.organizer as string,
				attendee_count: e.attendee_count as number,
				status: e.status as string,
				reserve,
			};
		})
		.filter(Boolean) as EventWithReserve[];

	const lectureData: LectureWithReserve[] = (lectureRes.data ?? [])
		.map((e) => {
			const reserveRaw = Array.isArray(e.reserve)
				? e.reserve[0]
				: e.reserve;
			const courseRaw = Array.isArray(e.course) ? e.course[0] : e.course;
			if (!reserveRaw || reserveRaw.profile_id !== userId) return null;

			const reserve: Reserve = reserveRaw as Reserve;
			const course: Course = courseRaw as Course;

			return {
				status: e.status as string,
				reserve,
				course,
			};
		})
		.filter(Boolean) as LectureWithReserve[];

	const unifiedRows: UnifiedReservationRow[] = [
		...eventData.map((event) => ({
			name: event.name,
			date: event.reserve.date,
			startTime: `${event.reserve.start_hour}:${event.reserve.start_minute}`,
			endTime: `${event.reserve.end_hour}:${event.reserve.end_minute}`,
			type: 'event' as const,
			status: event.status,
		})),
		...lectureData.map((lecture) => ({
			name: `${lecture.course.char} ${lecture.course.digit} - ${lecture.course.name}`,
			date: lecture.reserve.date,
			startTime: `${lecture.reserve.start_hour}:${lecture.reserve.start_minute}`,
			endTime: `${lecture.reserve.end_hour}:${lecture.reserve.end_minute}`,
			type: 'event' as const,
			status: lecture.status,
		})),
	];

	return unifiedRows;
}

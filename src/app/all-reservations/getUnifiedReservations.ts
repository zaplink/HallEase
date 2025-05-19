import { createClient } from '@/lib/supabaseClient';
import {
	// LectureReservation,
	UnifiedReservationRow,
	// Course,
} from './reservation';
// import { date } from 'zod';

interface EventWithReserve {
	name: string;
	organizer: string;
	attendee_count: number;
	status: string;
	reserve?: {
		date: string;
		start_hour: string;
		start_minute: string;
		end_hour: string;
		end_minute: string;
	};
}

interface LectureWithReserve {
	status: string;
	reserve?: {
		date: string;
		start_hour: string;
		start_minute: string;
		end_hour: string;
		end_minute: string;
	};
	course?: {
		char: string;
		digit: string;
		name: string;
	};
}

export async function getUnifiedReservations(): Promise<
	UnifiedReservationRow[]
> {
	const supabase = createClient();

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
          end_minute
        )
      `),
		// supabase.from('reserve').select('*').eq('type', 'lecture'),
		supabase.from('extra_lecture').select(`
			status,
			reserve:reserve_id (
				date,
				start_hour,
				start_minute,
				end_hour,
				end_minute
			),
			course: course_id (
				char,
				digit,
				name
			)
			`),
		// supabase.from('course').select('id, char, digit, name'),
	]);

	const eventData = ((eventRes.data ?? []) as Record<string, unknown>[]).map(
		(e) => ({
			name: e['name'] as string,
			organizer: e['organizer'] as string,
			attendee_count: e['attendee_count'] as number,
			status: e['status'] as string,
			reserve: Array.isArray(e['reserve'])
				? (e['reserve'][0] as EventWithReserve['reserve'])
				: (e['reserve'] as EventWithReserve['reserve']),
		})
	) as EventWithReserve[];

	const lectureData = (
		(lectureRes.data ?? []) as Record<string, unknown>[]
	).map((e) => ({
		// courseChar: e['char'] as string,
		// courseDigit: e['digit'] as string,
		// courseName: e['name'] as string,
		status: e['status'] as string,
		reserve: Array.isArray(e['reserve'])
			? (e['reserve'][0] as LectureWithReserve['reserve'])
			: (e['reserve'] as LectureWithReserve['reserve']),
		course: Array.isArray(e['course'])
			? (e['course'][0] as LectureWithReserve['course'])
			: (e['course'] as LectureWithReserve['course']),
	})) as LectureWithReserve[];

	console.log('eventData', eventData);

	// const lectureRaw = lectureRes.data ?? [];

	// const courses = (coursesRes.data ?? []) as Course[];

	// const courseMap = new Map<string, string>();
	// courses.forEach((c) => courseMap.set(c.id, c.name));

	// Map raw lecture data (snake_case) to LectureReservation (camelCase)
	// const lectureReservations: LectureReservation[] = lectureRaw.map(
	// 	(lecture: Record<string, unknown>) => ({
	// 		description: lecture['description'] as string | null,
	// 		type: lecture['type'] as 'lecture',
	// 		date: lecture['date'] as Date | undefined,
	// 		startHour: lecture['start_hour'] as string,
	// 		startMinute: lecture['start_minute'] as string,
	// 		endHour: lecture['end_hour'] as string,
	// 		endMinute: lecture['end_minute'] as string,
	// 		hallOpt: lecture['hallOpt'] as string,
	// 		status: lecture['status'] as string,
	// 		course_id: lecture['course_id'] as string,
	// 	})
	// );

	const unifiedRows: UnifiedReservationRow[] = [
		...eventData.map((event) => {
			const reserve = event.reserve;
			return {
				name: event.name ?? 'Unnamed Event',
				date: reserve?.date ?? '',
				startTime: `${reserve?.start_hour ?? '00'}:${reserve?.start_minute ?? '00'}`,
				endTime: `${reserve?.end_hour ?? '00'}:${reserve?.end_minute ?? '00'}`,
				type: 'event' as const,
				status: event.status,
			};
		}),

		...lectureData.map((lecture) => {
			const reserve = lecture.reserve;
			const course = lecture.course;
			return {
				name: `${course?.char} ${course?.digit} - ${course?.name}`,
				date: reserve?.date ?? '',
				startTime: `${reserve?.start_hour ?? '00'}:${reserve?.start_minute ?? '00'}`,
				endTime: `${reserve?.end_hour ?? '00'}:${reserve?.end_minute ?? '00'}`,
				type: 'event' as const,
				status: lecture.status,
			};
		}),

		// ...lectureReservations.map((lecture) => ({
		// 	name: courseMap.get(lecture.course_id) ?? 'Unknown Course',
		// 	date: lecture.date?.toString() ?? '',
		// 	startTime: `${lecture.startHour}:${lecture.startMinute}`,
		// 	endTime: `${lecture.endHour}:${lecture.endMinute}`,
		// 	type: 'lecture' as const,
		// 	status: lecture.status,
		// })),
	];

	return unifiedRows;
}

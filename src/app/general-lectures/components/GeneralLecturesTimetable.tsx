'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { supabase } from '@/lib/supabaseClient';
import { Search, Clock } from 'lucide-react';

// Types
interface Course {
	id: string;
	char: string;
	digit: string;
	name: string;
}

interface Hall {
	id: string;
	code: string;
	description: string;
}

interface GeneralLecture {
	id: string;
	day: string;
	start_time: string;
	end_time: string;
	course_id: string;
	hall_id: string;
	course: Course[];
	hall: Hall[];
}

interface TimetableSlot {
	time: string;
	monday?: GeneralLecture;
	tuesday?: GeneralLecture;
	wednesday?: GeneralLecture;
	thursday?: GeneralLecture;
	friday?: GeneralLecture;
	saturday?: GeneralLecture;
}

const timeSlots = [
	'08:00',
	'08:30',
	'09:00',
	'09:30',
	'10:00',
	'10:30',
	'11:00',
	'11:30',
	'12:00',
	'12:30',
	'13:00',
	'13:30',
	'14:00',
	'14:30',
	'15:00',
	'15:30',
	'16:00',
	'16:30',
	'17:00',
];

const days = [
	'MONDAY',
	'TUESDAY',
	'WEDNESDAY',
	'THURSDAY',
	'FRIDAY',
	'SATURDAY',
];

export default function GeneralLecturesTimetable() {
	const [lectures, setLectures] = useState<GeneralLecture[]>([]);
	const [halls, setHalls] = useState<Hall[]>([]);
	const [courses, setCourses] = useState<Course[]>([]);
	const [selectedHall, setSelectedHall] = useState<string>('');
	const [searchQuery, setSearchQuery] = useState<string>('');
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [totalLecturesCount, setTotalLecturesCount] = useState<number>(0);

	// Log state changes for selectedHall and searchQuery
	useEffect(() => {
		// console.log('[STATE] selectedHall changed:', selectedHall);
		// console.log('STEP 1: Hall selection changed');
		console.log('LOG: Hall changed:', selectedHall);
	}, [selectedHall]);

	useEffect(() => {
		// console.log('[STATE] searchQuery changed:', searchQuery);
		// console.log('STEP 2: Search query changed');
		// ...existing code...
	}, [searchQuery]);

	useEffect(() => {
		// console.log('[STATE] lectures updated:', lectures);
		// console.log('STEP 3: Lectures updated');
		// ...existing code...
	}, [lectures]);

	useEffect(() => {
		// console.log('[STATE] halls updated:', halls);
		// console.log('STEP 4: Halls updated');
		// ...existing code...
	}, [halls]);

	useEffect(() => {
		// console.log('[STATE] courses updated:', courses);
		// console.log('STEP 5: Courses updated');
		// ...existing code...
	}, [courses]);

	// Fetch initial data
	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true);
				console.log('#### 🚀 Starting data fetch...');

				// Check database connectivity first
				console.log('#### 📡 Testing database connectivity...');
				const { data: testData, error: testError } = await supabase
					.from('course')
					.select('count')
					.limit(1);
				console.log('#### [FETCH] course connectivity test:', {
					testData,
					testError,
				});

				if (testError) {
					console.error(
						'❌ Database connectivity test failed:',
						testError
					);
					throw testError;
				}
				console.log('#### ✅ Database connectivity confirmed');

				// Fetch halls
				console.log('#### 🏢 Fetching halls...');
				const { data: hallsData, error: hallsError } = await supabase
					.from('hall')
					.select('id, code, description, is_available')
					.order('code');
				console.log('#### [FETCH] hallsData:', hallsData);
				console.log('#### [FETCH] hallsError:', hallsError);

				if (hallsError) {
					console.error('❌ Halls fetch error:', hallsError);
					throw hallsError;
				}

				console.log('#### 📊 All halls found:', hallsData?.length || 0);
				console.log('#### 🏢 Sample halls:', hallsData?.slice(0, 3));

				const availableHalls =
					hallsData?.filter((h) => h.is_available) || [];
				console.log(
					'#### ✅ Available halls:',
					availableHalls.length,
					availableHalls
				);

				// Fetch courses
				console.log('#### 📚 Fetching courses...');
				const { data: coursesData, error: coursesError } =
					await supabase
						.from('course')
						.select('id, char, digit, name')
						.order('char', { ascending: true })
						.order('digit', { ascending: true });
				console.log('#### [FETCH] coursesData:', coursesData);
				console.log('#### [FETCH] coursesError:', coursesError);

				if (coursesError) {
					console.error('❌ Courses fetch error:', coursesError);
					throw coursesError;
				}

				console.log('#### 📊 Courses found:', coursesData?.length || 0);
				console.log(
					'#### 📚 Sample courses:',
					coursesData?.slice(0, 3)
				);

				setHalls(availableHalls);
				setCourses(coursesData || []);
				console.log('#### [STATE] setHalls:', availableHalls);
				console.log('#### [STATE] setCourses:', coursesData || []);

				// Check total lectures count for debugging
				console.log('#### 🎓 Checking general lectures...');
				const { count, error: countError } = await supabase
					.from('general_lecture')
					.select('*', { count: 'exact', head: true });
				console.log('#### [FETCH] general_lecture count:', count);
				console.log(
					'#### [FETCH] general_lecture countError:',
					countError
				);

				if (countError) {
					console.error('❌ Lectures count error:', countError);
				} else {
					setTotalLecturesCount(count || 0);
					console.log('#### 📊 Total lectures in database:', count);
				}

				// Get a sample of all lectures to understand the data structure
				const { data: sampleLectures, error: sampleError } =
					await supabase.from('general_lecture').select('*').limit(5);
				console.log('#### [FETCH] sampleLectures:', sampleLectures);
				console.log('#### [FETCH] sampleError:', sampleError);

				if (sampleError) {
					console.error('❌ Sample lectures error:', sampleError);
				} else {
					console.log(
						'#### 🎓 Sample lectures structure:',
						sampleLectures
					);
				}
			} catch (err) {
				console.error('💥 Error fetching initial data:', err);
				setError(`Failed to load data: ${(err as Error).message}`);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	// Fetch lectures when hall is selected
	useEffect(() => {
		const fetchLectures = async () => {
			if (!selectedHall) {
				setLectures([]);
				console.log('[FETCH] No hall selected, lectures cleared');
				return;
			}

			try {
				setError(null);
				// console.log('STEP A: Checking hall table for selected hall...');
				// console.log('DEBUG: selectedHall value:', selectedHall);
				console.log('LOG: Fetching hall details for:', selectedHall);
				const { data: hallInfo, error: hallError } = await supabase
					.from('hall')
					.select('*')
					.eq('id', selectedHall)
					.single();
				if (hallError) {
					// console.log('STEP B: Hall not identified!');
					// console.error('❌ Hall verification failed:', hallError);
					throw new Error(`Hall not found: ${hallError.message}`);
				}
				console.log('LOG: Hall details:', hallInfo);
				if (hallInfo && hallInfo.id) {
					console.log('LOG: Hall ID:', hallInfo.id);
				} else {
					console.log('LOG: Hall ID not found in hall data!');
				}
				// Get all general_lecture rows for this hall_id
				const { data: allLectures, error: allLecturesError } =
					await supabase
						.from('general_lecture')
						.select('*')
						.eq('hall_id', selectedHall);
				if (allLecturesError) {
					console.log(
						'LOG: Error fetching general_lecture rows:',
						allLecturesError
					);
				} else {
					console.log(
						'LOG: general_lecture rows for hall_id:',
						selectedHall,
						allLectures
					);
				}
				// Fetch with relationships (original logic, needed for timetable rendering)
				const { data, error } = await supabase
					.from('general_lecture')
					.select(
						`
		id,
		day,
		start_time,
		end_time,
		course_id,
		hall_id,
		course:course_id (
		  id,
		  char,
		  digit,
		  name
		),
		hall:hall_id (
		  id,
		  code,
		  description
		)
	  `
					)
					.eq('hall_id', selectedHall)
					.order('start_time');
				// ...existing code...

				if (error) {
					console.error('❌ Complex query failed:', error);

					// Try simpler query without relationships
					console.log(
						'#### 🔄 Trying simple query without relationships...'
					);
					const { data: simpleData, error: simpleError } =
						await supabase
							.from('general_lecture')
							.select('*')
							.eq('hall_id', selectedHall)
							.order('start_time');
					console.log(
						'#### [FETCH] general_lecture (simple):',
						simpleData
					);
					console.log(
						'#### [FETCH] general_lecture error (simple):',
						simpleError
					);

					if (simpleError) {
						console.error(
							'❌ Simple query also failed:',
							simpleError
						);
						throw simpleError;
					}

					console.log(
						'#### ✅ Simple query succeeded:',
						simpleData?.length || 0,
						'lectures'
					);
					console.log(
						'#### 📊 Simple data sample:',
						simpleData?.slice(0, 2)
					);

					// If simple query works, manually join the data
					if (simpleData && simpleData.length > 0) {
						console.log(
							'#### 🔧 Manually joining course and hall data...'
						);
						const enrichedData = await Promise.all(
							simpleData.map(async (lecture) => {
								// Get course info
								const { data: courseInfo, error: courseError } =
									await supabase
										.from('course')
										.select('*')
										.eq('id', lecture.course_id)
										.single();
								console.log(
									'#### [JOIN] courseInfo:',
									courseInfo,
									'courseError:',
									courseError
								);

								// Get hall info
								const { data: hallInfo, error: hallJoinError } =
									await supabase
										.from('hall')
										.select('*')
										.eq('id', lecture.hall_id)
										.single();
								console.log(
									'#### [JOIN] hallInfo:',
									hallInfo,
									'hallJoinError:',
									hallJoinError
								);

								return {
									...lecture,
									course: courseInfo ? [courseInfo] : [],
									hall: hallInfo ? [hallInfo] : [],
								};
							})
						);

						console.log(
							'#### ✅ Data enrichment complete:',
							enrichedData
						);
						setLectures(enrichedData);
						console.log('#### [STATE] setLectures:', enrichedData);
						return;
					}

					throw error;
				}

				console.log(
					'#### ✅ Complex query succeeded:',
					data?.length || 0,
					'lectures'
				);
				console.log('#### 📊 Complex data sample:', data?.slice(0, 2));
				setLectures(data || []);
				console.log('#### [STATE] setLectures:', data || []);
			} catch (err) {
				console.error('💥 Error fetching lectures:', err);
				setError('Failed to load lectures: ' + (err as Error).message);
			}
		};

		fetchLectures();
	}, [selectedHall, courses]); // Added courses dependency for manual joining

	// Filter courses based on search query
	const filteredCourses = courses.filter((course) => {
		const searchLower = searchQuery.toLowerCase();
		const result =
			course.char.toLowerCase().includes(searchLower) ||
			course.digit.includes(searchLower) ||
			course.name.toLowerCase().includes(searchLower);
		if (searchQuery) {
			console.log('[FILTER] course:', course, 'matches:', result);
		}
		return result;
	});

	// Create timetable data
	const createTimetableData = (): TimetableSlot[] => {
		const timetableData: TimetableSlot[] = timeSlots.map((time) => ({
			time,
		}));
		// New: Track which slots are the start of a lecture and how many slots it spans
		const slotMap: Record<
			string,
			Record<number, { lecture: GeneralLecture; span: number }>
		> = {};
		lectures.forEach((lecture, idx) => {
			const startTime = lecture.start_time.substring(0, 5);
			const endTime = lecture.end_time.substring(0, 5);
			const startIdx = timeSlots.findIndex((slot) => slot === startTime);
			// For endIdx, if the event ends at a slot boundary, we want to span up to but not including that slot
			// e.g., 08:00-09:00 should span 08:00 and 08:30 only, not 09:00
			let endIdx = timeSlots.findIndex((slot) => slot === endTime);
			// If endTime is not a slot, find the next slot after endTime
			if (endIdx === -1) {
				endIdx = timeSlots.findIndex((slot) => slot > endTime);
				if (endIdx === -1) endIdx = timeSlots.length; // span to end
			}
			if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
				const dayLower = lecture.day.toLowerCase();
				let dayKey: keyof Omit<TimetableSlot, 'time'>;
				switch (dayLower) {
					case 'monday':
					case 'mon':
						dayKey = 'monday';
						break;
					case 'tuesday':
					case 'tue':
					case 'tues':
						dayKey = 'tuesday';
						break;
					case 'wednesday':
					case 'wed':
						dayKey = 'wednesday';
						break;
					case 'thursday':
					case 'thu':
					case 'thur':
					case 'thurs':
						dayKey = 'thursday';
						break;
					case 'friday':
					case 'fri':
						dayKey = 'friday';
						break;
					case 'saturday':
					case 'sat':
						dayKey = 'saturday';
						break;
					default:
						return;
				}
				if (!slotMap[dayKey]) slotMap[dayKey] = {};
				slotMap[dayKey][startIdx] = {
					lecture,
					span: endIdx - startIdx,
				};
				for (let i = startIdx; i < endIdx; i++) {
					timetableData[i][dayKey] = lecture;
				}
			}
		});
		// Attach slotMap for rendering
		(timetableData as any).slotMap = slotMap;
		return timetableData;
	};

	const timetableData = createTimetableData();

	// Render lecture cell
	const renderLectureCell = (lecture?: GeneralLecture) => {
		if (!lecture) {
			console.log('[RENDER] Empty lecture cell');
			return (
				<div className='text-center text-gray-400 p-2 h-full'>-</div>
			);
		}
		console.log('[RENDER] Rendering lecture cell:', lecture);
		const course = Array.isArray(lecture.course)
			? lecture.course[0]
			: lecture.course;
		let courseCode = 'Unknown';
		let courseName = 'Unknown Course';
		if (course) {
			courseCode = `${course.char || ''} ${course.digit || ''}`.trim();
			courseName = course.name || 'Unknown Course';
		} else {
			// Fallback: try to find course info from the courses list
			const fallbackCourse = courses.find(
				(c) => c.id === lecture.course_id
			);
			if (fallbackCourse) {
				courseCode = `${fallbackCourse.char} ${fallbackCourse.digit}`;
				courseName = fallbackCourse.name;
				console.log('[RENDER] Fallback course info:', fallbackCourse);
			}
		}
		const timeRange = `${lecture.start_time.substring(0, 5)} - ${lecture.end_time.substring(0, 5)}`;
		return (
			<div className='p-2 bg-blue-50 border border-blue-200 rounded-md h-full flex flex-col justify-center'>
				<div className='font-semibold text-blue-900 text-sm'>
					{courseCode}
				</div>
				<div className='text-xs text-blue-700 flex items-center gap-1 mt-1'>
					<Clock className='w-3 h-3' />
					{timeRange}
				</div>
				<div
					className='text-xs text-gray-600 truncate mt-1'
					title={courseName}
				>
					{courseName}
				</div>
			</div>
		);
	};

	if (loading) {
		return (
			<div className='flex items-center justify-center h-64'>
				<div className='text-center'>
					<div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto'></div>
					<p className='mt-2 text-gray-600'>Loading timetable...</p>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className='flex items-center justify-center h-64'>
				<div className='text-center text-red-600'>
					<p>{error}</p>
					<Button
						onClick={() => window.location.reload()}
						variant='outline'
						className='mt-2'
					>
						Retry
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className='space-y-6'>
			{/* Header with Controls */}
			<div className='bg-white p-6 rounded-lg shadow-sm border'>
				<div className='flex flex-col lg:flex-row gap-4 items-start lg:items-end'>
					{/* Hall Selection */}
					<div className='flex-1 min-w-[250px]'>
						<label className='block text-sm font-medium text-gray-700 mb-2'>
							Select Hall
						</label>
						<Select
							value={selectedHall}
							onValueChange={setSelectedHall}
						>
							<SelectTrigger>
								<SelectValue placeholder='Choose a hall to view timetable' />
							</SelectTrigger>
							<SelectContent>
								{halls.map((hall) => (
									<SelectItem key={hall.id} value={hall.id}>
										{hall.code} - {hall.description}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					{/* Course Search */}
					<div className='flex-1 min-w-[250px]'>
						<label className='block text-sm font-medium text-gray-700 mb-2'>
							Search Courses
						</label>
						<div className='relative'>
							<Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4' />
							<Input
								placeholder='Search by course code or name...'
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className='pl-10'
							/>
						</div>
					</div>

					{/* Clear Button */}
					<Button
						variant='outline'
						onClick={() => {
							setSelectedHall('');
							setSearchQuery('');
						}}
					>
						Clear
					</Button>
				</div>

				{/* Course List */}
				{searchQuery && (
					<div className='mt-4 p-4 bg-gray-50 rounded-md'>
						<h4 className='text-sm font-medium text-gray-700 mb-2'>
							Search Results ({filteredCourses.length} courses
							found)
						</h4>
						<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 max-h-32 overflow-y-auto'>
							{filteredCourses.map((course) => (
								<div
									key={course.id}
									className='text-sm p-2 bg-white border rounded cursor-pointer hover:bg-blue-50'
									title={course.name}
								>
									<span className='font-medium text-blue-600'>
										{course.char} {course.digit}
									</span>
									<span className='text-gray-600 ml-2 truncate block'>
										{course.name}
									</span>
								</div>
							))}
						</div>
					</div>
				)}
			</div>

			{/* Timetable */}
			{selectedHall ? (
				<div className='bg-white rounded-lg shadow-sm border overflow-hidden'>
					<div className='p-4 bg-gray-50 border-b'>
						<h3 className='text-lg font-semibold text-gray-900'>
							Weekly Timetable -{' '}
							{halls.find((h) => h.id === selectedHall)?.code}
						</h3>
						<p className='text-sm text-gray-600'>
							{
								halls.find((h) => h.id === selectedHall)
									?.description
							}
						</p>
						{lectures.length > 0 && (
							<p className='text-xs text-green-600 mt-1'>
								Found {lectures.length} lecture(s) for this hall
							</p>
						)}
						{lectures.length === 0 && (
							<p className='text-xs text-orange-600 mt-1'>
								No lectures found for this hall. The timetable
								may be empty or data might not be available.
							</p>
						)}
					</div>

					<div className='overflow-x-auto'>
						<Table>
							<TableHeader>
								<TableRow className='bg-gray-50'>
									<TableHead className='w-20 font-semibold'>
										Time
									</TableHead>
									{days.map((day) => (
										<TableHead
											key={day}
											className='text-center font-semibold min-w-[150px]'
										>
											{day}
										</TableHead>
									))}
								</TableRow>
							</TableHeader>
							<TableBody>
								{timetableData.map((slot, rowIdx) => (
									<TableRow
										key={slot.time}
										className='hover:bg-gray-50 h-[60px]'
									>
										<TableCell className='font-medium bg-gray-50 border-r h-[60px]'>
											{slot.time}
										</TableCell>
										{days.map((day) => {
											const dayKey = day.toLowerCase();
											const slotMap =
												(timetableData as any)
													.slotMap?.[dayKey] || {};
											// Is this the start of a merged cell?
											if (slotMap[rowIdx]) {
												const { lecture, span } =
													slotMap[rowIdx];
												return (
													<TableCell
														key={day}
														rowSpan={span}
														className='p-2 align-middle'
														style={{
															height:
																span * 60 +
																'px',
															verticalAlign:
																'middle',
															padding: '0.5rem',
														}}
													>
														<div
															style={{
																height: '100%',
															}}
															className='h-full flex flex-col justify-center'
														>
															{renderLectureCell(
																lecture
															)}
														</div>
													</TableCell>
												);
											}
											// Is this slot covered by a merged cell above? If so, skip rendering
											const isCovered = Object.entries(
												slotMap
											).some(([startIdx, value]) => {
												const s = value as {
													span: number;
												};
												return (
													rowIdx > Number(startIdx) &&
													rowIdx <
														Number(startIdx) +
															s.span
												);
											});
											if (isCovered) return null;
											// Otherwise, render a normal cell
											return (
												<TableCell
													key={day}
													className='p-2 h-[30px]'
												>
													{renderLectureCell(
														slot[
															dayKey as keyof TimetableSlot
														] as
															| GeneralLecture
															| undefined
													)}
												</TableCell>
											);
										})}
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>

					{/* Debug Info - Remove this in production */}
					{process.env.NODE_ENV === 'development' &&
						lectures.length > 0 && (
							<div className='p-4 bg-yellow-50 border-t text-xs'>
								<details>
									<summary className='cursor-pointer font-medium'>
										Debug Info (Click to expand)
									</summary>
									<pre className='mt-2 text-xs overflow-auto'>
										{JSON.stringify(lectures, null, 2)}
									</pre>
								</details>
							</div>
						)}
				</div>
			) : (
				<div className='bg-white rounded-lg shadow-sm border'>
					<div className='p-12 text-center text-gray-500'>
						<Clock className='w-12 h-12 mx-auto mb-4 text-gray-300' />
						<h3 className='text-lg font-medium mb-2'>
							No Hall Selected
						</h3>
						<p>
							Please select a hall from the dropdown above to view
							its timetable.
						</p>
					</div>
				</div>
			)}

			{/* Legend */}
			<div className='bg-white p-4 rounded-lg shadow-sm border'>
				<h4 className='text-sm font-medium text-gray-700 mb-3'>
					Legend & Database Status
				</h4>

				{/* Database Status Panel */}
				<div className='mb-4 p-3 bg-gray-50 rounded-md'>
					<h5 className='text-xs font-semibold text-gray-600 mb-2'>
						Database Status
					</h5>
					<div className='grid grid-cols-3 gap-4 text-xs'>
						<div className='text-center'>
							<div className='font-medium text-blue-600'>
								{halls.length}
							</div>
							<div className='text-gray-500'>Available Halls</div>
						</div>
						<div className='text-center'>
							<div className='font-medium text-green-600'>
								{courses.length}
							</div>
							<div className='text-gray-500'>Total Courses</div>
						</div>
						<div className='text-center'>
							<div className='font-medium text-purple-600'>
								{totalLecturesCount}
							</div>
							<div className='text-gray-500'>Total Lectures</div>
						</div>
					</div>
					{selectedHall && (
						<div className='mt-2 pt-2 border-t border-gray-200'>
							<div className='text-center'>
								<div className='font-medium text-orange-600'>
									{lectures.length}
								</div>
								<div className='text-gray-500'>
									Lectures for Selected Hall
								</div>
							</div>
						</div>
					)}
				</div>

				<div className='flex flex-wrap gap-4 text-xs items-center'>
					<div className='flex items-center gap-2'>
						<div className='w-4 h-4 bg-blue-50 border border-blue-200 rounded'></div>
						<span>General Lecture</span>
					</div>
					<div className='flex items-center gap-2'>
						<div className='w-4 h-4 bg-gray-100 border border-gray-200 rounded'></div>
						<span>Free Time</span>
					</div>

					{/* Database Diagnostics */}
					{process.env.NODE_ENV === 'development' && (
						<>
							<Button
								variant='outline'
								size='sm'
								onClick={async () => {
									console.log(
										'🧪 Running database diagnostics...'
									);

									// Test basic table access
									const tables = [
										'course',
										'hall',
										'general_lecture',
									];
									for (const table of tables) {
										try {
											const { data, error } =
												await supabase
													.from(table)
													.select('*')
													.limit(1);
											console.log(
												`✅ Table "${table}":`,
												data ? 'accessible' : 'empty',
												error
													? `Error: ${error.message}`
													: ''
											);
										} catch (err) {
											console.error(
												`❌ Table "${table}":`,
												err
											);
										}
									}

									// Test foreign key relationships
									try {
										const { data: fkTest, error: fkError } =
											await supabase
												.from('general_lecture')
												.select(
													`
												id,
												course_id,
												hall_id,
												course:course_id(id, char, digit),
												hall:hall_id(id, code)
											`
												)
												.limit(3);

										console.log(
											'🔗 Foreign key test:',
											fkError
												? `Error: ${fkError.message}`
												: 'Success'
										);
										console.log('📊 FK test data:', fkTest);
									} catch (err) {
										console.error(
											'❌ Foreign key test failed:',
											err
										);
									}
								}}
								className='ml-4'
							>
								Run Diagnostics
							</Button>

							<Button
								variant='outline'
								size='sm'
								onClick={() => {
									// Add some test data for debugging
									const testLecture: GeneralLecture = {
										id: 'test-1',
										day: 'MONDAY',
										start_time: '09:00:00',
										end_time: '10:00:00',
										course_id: 'test-course',
										hall_id: selectedHall,
										course: [
											{
												id: 'test-course',
												char: 'CSCI',
												digit: '1234',
												name: 'Test Computer Science Course',
											},
										],
										hall: [
											{
												id: selectedHall,
												code: 'TEST-01',
												description: 'Test Hall',
											},
										],
									};
									setLectures([testLecture]);
									console.log(
										'🧪 Test data added to timetable'
									);
								}}
							>
								Add Test Data
							</Button>
						</>
					)}

					{selectedHall &&
						lectures.length === 0 &&
						totalLecturesCount === 0 && (
							<div className='ml-4 text-red-600 text-xs'>
								⚠️ No lectures found in the database. You may
								need to:
								<ul className='mt-1 ml-4 list-disc'>
									<li>
										Add sample data to the general_lecture
										table
									</li>
									<li>Check foreign key relationships</li>
									<li>
										Verify course_id and hall_id references
									</li>
								</ul>
							</div>
						)}

					{selectedHall &&
						lectures.length === 0 &&
						totalLecturesCount > 0 && (
							<div className='ml-4 text-orange-600 text-xs'>
								💡 No lectures for this hall, but{' '}
								{totalLecturesCount} lectures exist in database.
								This hall might not have any scheduled lectures.
							</div>
						)}
				</div>
			</div>
		</div>
	);
}

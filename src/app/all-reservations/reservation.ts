export interface UnifiedReservationRow {
	id: string;
	name: string; // Event name or Course code (e.g., "MGMT 22012")
	type: 'event' | 'extra_lecture';
	bookedBy: string; // Profile full_name
	date: string;
	startTime: string;
	endTime: string;
	status: string;
}

import { ColumnDef } from '@tanstack/react-table';
import { UnifiedReservationRow } from './reservation';

export const reservationColumns: ColumnDef<UnifiedReservationRow>[] = [
	{ accessorKey: 'name', header: 'Name / Course' },
	{ accessorKey: 'date', header: 'Date' },
	{ accessorKey: 'startTime', header: 'Start Time' },
	{ accessorKey: 'endTime', header: 'End Time' },
	{ accessorKey: 'type', header: 'Type' },
	{ accessorKey: 'status', header: 'Status' },
];

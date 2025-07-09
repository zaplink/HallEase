'use client';

import React from 'react';
import { Row, ColumnDef } from '@tanstack/react-table';
import { UnifiedReservationRow } from './reservation';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal } from 'lucide-react';
import { useRouter } from 'next/navigation';

type ActionsCellProps = {
	row: Row<UnifiedReservationRow>;
};

export const ActionsCell: React.FC<ActionsCellProps> = ({ row }) => {
	const reservation = row.original;
	const router = useRouter();

	const handleReview = () => {
		// Navigate to a review page or open a review modal
		// For now, we'll navigate to a review page with the reservation ID
		router.push(`/all-reservations/review/${reservation.id}`);
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant='ghost' className='h-8 w-8 p-0'>
					<span className='sr-only'>Open menu</span>
					<MoreHorizontal className='h-4 w-4' />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align='end'>
				<DropdownMenuLabel>Actions</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuItem onClick={handleReview}>
					Review
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export const reservationColumns: ColumnDef<UnifiedReservationRow>[] = [
	{
		accessorKey: 'name',
		header: 'Name',
		cell: ({ row }) => (
			<div className='font-medium'>{row.getValue('name')}</div>
		),
	},
	{
		accessorKey: 'type',
		header: 'Type',
		cell: ({ row }) => {
			const type = row.getValue('type') as string;
			return (
				<Badge variant={type === 'event' ? 'default' : 'secondary'}>
					{type === 'event' ? 'Event' : 'Extra Lecture'}
				</Badge>
			);
		},
	},
	{
		accessorKey: 'bookedBy',
		header: 'Booked By',
		cell: ({ row }) => <div>{row.getValue('bookedBy')}</div>,
	},
	{
		accessorKey: 'date',
		header: 'Date',
		cell: ({ row }) => {
			const date = row.getValue('date') as string;
			if (date) {
				return new Date(date).toLocaleDateString();
			}
			return 'N/A';
		},
	},
	{
		accessorKey: 'startTime',
		header: 'Start Time',
		cell: ({ row }) => <div>{row.getValue('startTime')}</div>,
	},
	{
		accessorKey: 'endTime',
		header: 'End Time',
		cell: ({ row }) => <div>{row.getValue('endTime')}</div>,
	},
	{
		accessorKey: 'status',
		header: 'Status',
		cell: ({ row }) => {
			const status = row.getValue('status') as string;
			const getVariant = (status: string) => {
				switch (status.toLowerCase()) {
					case 'approved':
						return 'default';
					case 'pending':
						return 'secondary';
					case 'rejected':
						return 'destructive';
					case 'waiting':
						return 'outline';
					default:
						return 'secondary';
				}
			};

			return (
				<Badge variant={getVariant(status)}>
					{status.charAt(0).toUpperCase() + status.slice(1)}
				</Badge>
			);
		},
	},
	{
		id: 'actions',
		enableHiding: false,
		cell: ({ row }) => <ActionsCell row={row} />,
	},
];

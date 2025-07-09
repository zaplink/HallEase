'use client';

import React, { useState } from 'react';
import { Row, ColumnDef } from '@tanstack/react-table';
import { UnifiedReservationRow } from './reservation';
import { createClient } from '@/lib/supabaseClient';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

type ActionsCellProps = {
	row: Row<UnifiedReservationRow>;
};

export const ActionsCell: React.FC<ActionsCellProps> = ({ row }) => {
	const reservation = row.original;
	const [actionType, setActionType] = useState<'accept' | 'reject' | null>(
		null
	);
	const [dialogOpen, setDialogOpen] = useState(false);
	const router = useRouter();

	const handleUpdateStatus = async (newStatus: 'approved' | 'rejected') => {
		const supabase = createClient();
		const { error } = await supabase
			.from('reserve')
			.update({ status: newStatus })
			.eq('id', reservation.id);

		if (error) {
			toast.error('Failed to update reservation status');
			console.error('Error updating reservation:', error);
		} else {
			toast.success(
				`Reservation ${newStatus === 'approved' ? 'approved' : 'rejected'} successfully`
			);
			router.refresh();
		}
		setDialogOpen(false);
	};

	return (
		<>
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
					<DropdownMenuItem
						onClick={() => {
							setActionType('accept');
							setDialogOpen(true);
						}}
						disabled={reservation.status === 'approved'}
					>
						Approve
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={() => {
							setActionType('reject');
							setDialogOpen(true);
						}}
						disabled={reservation.status === 'rejected'}
					>
						Reject
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			<AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>
							{actionType === 'accept' ? 'Approve' : 'Reject'}{' '}
							Reservation
						</AlertDialogTitle>
						<AlertDialogDescription>
							Are you sure you want to{' '}
							{actionType === 'accept' ? 'approve' : 'reject'}{' '}
							this reservation for "{reservation.name}"? This
							action cannot be undone.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={() =>
								handleUpdateStatus(
									actionType === 'accept'
										? 'approved'
										: 'rejected'
								)
							}
						>
							{actionType === 'accept' ? 'Approve' : 'Reject'}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
};

export const reservationColumns: ColumnDef<UnifiedReservationRow>[] = [
	{
		accessorKey: 'name',
		header: 'Name/Course Code',
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

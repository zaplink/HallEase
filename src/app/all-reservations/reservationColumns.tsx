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
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
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
			toast.error(`Failed to update: ${error.message}`);
		} else {
			toast.success(`Reservation ${newStatus}`);
			router.refresh();
		}
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
						onClick={() =>
							router.push(`/reservation/${reservation.id}`)
						}
					>
						View Reservation
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem asChild>
						<AlertDialog>
							<AlertDialogTrigger asChild>
								<Button
									variant='ghost'
									className='w-full justify-start'
									onClick={() => {
										setActionType('accept');
									}}
								>
									Accept
								</Button>
							</AlertDialogTrigger>
							<AlertDialogContent>
								<AlertDialogHeader>
									<AlertDialogTitle>
										Accept this reservation?
									</AlertDialogTitle>
									<AlertDialogDescription>
										This will change the status to{' '}
										<strong>accepted</strong>.
									</AlertDialogDescription>
								</AlertDialogHeader>
								<AlertDialogFooter>
									<AlertDialogCancel>
										Cancel
									</AlertDialogCancel>
									<AlertDialogAction
										onClick={() => {
											handleUpdateStatus('approved');
										}}
									>
										Confirm
									</AlertDialogAction>
								</AlertDialogFooter>
							</AlertDialogContent>
						</AlertDialog>
					</DropdownMenuItem>

					<DropdownMenuItem asChild>
						<AlertDialog>
							<AlertDialogTrigger asChild>
								<Button
									variant='ghost'
									className='w-full justify-start'
									onClick={() => {
										setActionType('reject');
									}}
								>
									Reject
								</Button>
							</AlertDialogTrigger>
							<AlertDialogContent>
								<AlertDialogHeader>
									<AlertDialogTitle>
										Reject this reservation?
									</AlertDialogTitle>
									<AlertDialogDescription>
										This will change the status to{' '}
										<strong>rejected</strong>.
									</AlertDialogDescription>
								</AlertDialogHeader>
								<AlertDialogFooter>
									<AlertDialogCancel>
										Cancel
									</AlertDialogCancel>
									<AlertDialogAction
										onClick={() => {
											handleUpdateStatus('rejected');
										}}
									>
										Confirm
									</AlertDialogAction>
								</AlertDialogFooter>
							</AlertDialogContent>
						</AlertDialog>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			<AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>
							{actionType === 'accept'
								? 'Accept this reservation?'
								: 'Reject this reservation?'}
						</AlertDialogTitle>
						<AlertDialogDescription>
							This action will change the status to{' '}
							<strong>
								{actionType === 'accept'
									? 'accepted'
									: 'rejected'}
							</strong>
							. It can be reversed by editing the reservation.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel
							onClick={() => {
								setActionType(null);
							}}
						>
							Cancel
						</AlertDialogCancel>
						<AlertDialogAction
							onClick={() => {
								if (actionType) {
									handleUpdateStatus(
										actionType === 'accept'
											? 'approved'
											: 'rejected'
									);
									setActionType(null);
									setDialogOpen(false);
								}
							}}
						>
							Confirm
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
};

export const reservationColumns: ColumnDef<UnifiedReservationRow>[] = [
	{ accessorKey: 'name', header: 'Name / Course' },
	{ accessorKey: 'date', header: 'Date' },
	{ accessorKey: 'startTime', header: 'Start Time' },
	{ accessorKey: 'endTime', header: 'End Time' },
	{ accessorKey: 'type', header: 'Type' },
	{ accessorKey: 'status', header: 'Status' },
	{
		id: 'actions',
		cell: ActionsCell, // Use typed component here
	},
];

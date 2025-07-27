import { ColumnDef, Row } from '@tanstack/react-table';
import { UnifiedReservationRow } from './reservation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowUpDown, MoreHorizontal, Eye } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
} from '@/components/ui/dropdown-menu';

// Actions cell for my-reservations: three-dot icon dropdown, like all-reservations
const ActionsCell = ({ row }: { row: Row<UnifiedReservationRow> }) => {
	const reservation = row.original;
	const router = useRouter();

	const handleReview = () => {
		router.push(`/my-reservations/review/${reservation.id}`);
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant='ghost' size='icon' className='h-8 w-8 p-0'>
					<MoreHorizontal className='h-4 w-4' />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align='end'>
				<DropdownMenuItem onClick={handleReview}>
					<Eye className='mr-2 h-4 w-4' /> Review
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
		accessorKey: 'createdDate',
		header: ({ column }) => (
			<Button
				variant='ghost'
				onClick={() =>
					column.toggleSorting(column.getIsSorted() === 'asc')
				}
				className='h-auto p-0 font-medium'
			>
				Requested On
				<ArrowUpDown className='ml-2 h-4 w-4' />
			</Button>
		),
		cell: ({ row }) => {
			const date = row.getValue('createdDate') as string;
			if (date) {
				const dateObj = new Date(date);
				const weekday = dateObj.toLocaleDateString('en-US', {
					weekday: 'short',
				});
				const day = dateObj.getDate();
				const month = dateObj.toLocaleDateString('en-US', {
					month: 'short',
				});
				const year = dateObj.getFullYear();
				return (
					<div>
						{weekday}, {day} {month} {year}
					</div>
				);
			}
			return 'N/A';
		},
		sortingFn: (rowA, rowB) => {
			const dateA = new Date(rowA.getValue('createdDate') as string);
			const dateB = new Date(rowB.getValue('createdDate') as string);
			return dateA.getTime() - dateB.getTime();
		},
	},
	{
		accessorKey: 'date',
		header: ({ column }) => (
			<Button
				variant='ghost'
				onClick={() =>
					column.toggleSorting(column.getIsSorted() === 'asc')
				}
				className='h-auto p-0 font-medium'
			>
				Occurs On
				<ArrowUpDown className='ml-2 h-4 w-4' />
			</Button>
		),
		cell: ({ row }) => {
			const date = row.getValue('date') as string;
			if (date) {
				const dateObj = new Date(date);
				const weekday = dateObj.toLocaleDateString('en-US', {
					weekday: 'short',
				});
				const day = dateObj.getDate();
				const month = dateObj.toLocaleDateString('en-US', {
					month: 'short',
				});
				const year = dateObj.getFullYear();
				return (
					<div>
						{weekday}, {day} {month} {year}
					</div>
				);
			}
			return 'N/A';
		},
		sortingFn: (rowA, rowB) => {
			const dateA = new Date(rowA.getValue('date') as string);
			const dateB = new Date(rowB.getValue('date') as string);
			return dateA.getTime() - dateB.getTime();
		},
	},
	{
		accessorKey: 'startTime',
		header: 'Start Time',
		cell: ({ row }) => {
			const time = row.getValue('startTime') as string;
			if (time) {
				return <div>{time.substring(0, 5)}</div>;
			}
			return <div>N/A</div>;
		},
	},
	{
		accessorKey: 'endTime',
		header: 'End Time',
		cell: ({ row }) => {
			const time = row.getValue('endTime') as string;
			if (time) {
				return <div>{time.substring(0, 5)}</div>;
			}
			return <div>N/A</div>;
		},
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
		header: 'Actions',
		enableHiding: false,
		cell: (props) => <ActionsCell {...props} />, // Three-dot icon dropdown
	},
];

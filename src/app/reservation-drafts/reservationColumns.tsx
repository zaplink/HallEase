import { ColumnDef, Row } from '@tanstack/react-table';
import { UnifiedReservationRow } from '../my-reservations/reservation';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, MoreHorizontal, Eye } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
} from '@/components/ui/dropdown-menu';

// Actions cell for drafts: three-dot icon dropdown
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

export const draftReservationColumns: ColumnDef<UnifiedReservationRow>[] = [
	{
		accessorKey: 'name',
		header: 'Name',
		cell: ({ row }) => (
			<div className='font-medium'>{row.getValue('name')}</div>
		),
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
				Created On
				<ArrowUpDown className='ml-2 h-4 w-4' />
			</Button>
		),
		cell: ({ row }) => {
			const date = row.getValue('createdDate') as string;
			const time = row.original.createdTime;
			if (date && time) {
				const dateObj = new Date(`${date}T${time}`);
				return (
					<div>
						{dateObj.toLocaleString('en-US', {
							weekday: 'short',
							day: 'numeric',
							month: 'short',
							year: 'numeric',
							hour: '2-digit',
							minute: '2-digit',
							hour12: true,
						})}
					</div>
				);
			}
			return 'N/A';
		},
		sortingFn: (rowA, rowB) => {
			const dateA = new Date(
				`${rowA.getValue('createdDate')}T${rowA.original.createdTime}`
			);
			const dateB = new Date(
				`${rowB.getValue('createdDate')}T${rowB.original.createdTime}`
			);
			return dateA.getTime() - dateB.getTime();
		},
	},
	{
		accessorKey: 'modifiedDate',
		header: ({ column }) => (
			<Button
				variant='ghost'
				onClick={() =>
					column.toggleSorting(column.getIsSorted() === 'asc')
				}
				className='h-auto p-0 font-medium'
			>
				Modified On
				<ArrowUpDown className='ml-2 h-4 w-4' />
			</Button>
		),
		cell: ({ row }) => {
			const date = row.getValue('modifiedDate') as string;
			const time = row.original.modifiedTime;
			if (date && time) {
				const dateObj = new Date(`${date}T${time}`);
				return (
					<div>
						{dateObj.toLocaleString('en-US', {
							weekday: 'short',
							day: 'numeric',
							month: 'short',
							year: 'numeric',
							hour: '2-digit',
							minute: '2-digit',
							hour12: true,
						})}
					</div>
				);
			}
			return 'N/A';
		},
		sortingFn: (rowA, rowB) => {
			const dateA = new Date(
				`${rowA.getValue('modifiedDate')}T${rowA.original.modifiedTime}`
			);
			const dateB = new Date(
				`${rowB.getValue('modifiedDate')}T${rowB.original.modifiedTime}`
			);
			return dateA.getTime() - dateB.getTime();
		},
	},
	{
		accessorKey: 'progress',
		header: 'Progress',
		cell: () => (
			<div className='w-24 text-xs text-gray-600 text-center'>N/A</div>
		),
	},
	{
		id: 'actions',
		header: 'Actions',
		enableHiding: false,
		cell: (props) => <ActionsCell {...props} />, // Three-dot icon dropdown
	},
];

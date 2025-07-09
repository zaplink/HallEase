import { Row, ColumnDef } from '@tanstack/react-table'; // Import Row type
import { Hall as HallType } from './hall';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { MoreHorizontal, Calendar, Eye } from 'lucide-react';
import { toast } from 'sonner';

type ActionsCellProps = {
	row: Row<HallType>; // Use Row type from @tanstack/react-table
};

const ActionsCell: React.FC<ActionsCellProps> = ({ row }) => {
	const hall = row.original;
	const router = useRouter();

	return (
		<div className='flex items-center gap-2'>
			<Button
				variant='ghost'
				size='sm'
				onClick={() => router.push(`/reserve/${hall.code}`)}
				className='h-8 w-8 p-0'
				disabled={!hall.is_available}
				title='Reserve Hall'
			>
				<Calendar className='h-4 w-4' />
			</Button>
			<Button
				variant='ghost'
				size='sm'
				onClick={() => router.push(`/hall/${hall.code}`)}
				className='h-8 w-8 p-0'
				title='View Details'
			>
				<Eye className='h-4 w-4' />
			</Button>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant='ghost' className='h-8 w-8 p-0'>
						<span className='sr-only'>Open menu</span>
						<MoreHorizontal className='h-4 w-4' />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align='end'>
					<DropdownMenuLabel>Actions</DropdownMenuLabel>
					<DropdownMenuItem
						onClick={() => {
							navigator.clipboard.writeText(hall.code);
							toast('Hall Code Copied!', {
								description: hall.code,
							});
						}}
					>
						Copy Hall Code
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem
						onClick={() => router.push(`/hall/${hall.code}/edit`)}
					>
						Edit Hall
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
};

const hallTypeMap: Record<string, string> = {
	EW: 'Engineering Workshop',
	LCH: 'Lecture Hall',
	CMP: 'Computer Lab',
	'CMP-VR': 'Computer Lab - VR',
	'CMP-MAIN': 'Computer Lab - Main',
	'CMP-MAT': 'Computer Lab - Material',
	'CMP-DAT': 'Computer Lab - Data Science',
	ELP: 'Chemistry Lab',
	ML: 'Mechanical Lab',
};

export const columns: ColumnDef<HallType>[] = [
	{
		accessorKey: 'code',
		header: 'Code',
		cell: ({ row }) => row.original.code,
		enableGlobalFilter: true,
		filterFn: (row, columnId, filterValue) => {
			// Remove hyphens and spaces from both the search value and the cell value
			const searchValue = filterValue.toLowerCase().replace(/[-\s]/g, '');
			const cellValue = (row.getValue(columnId) as string)
				.toLowerCase()
				.replace(/[-\s]/g, '');
			return cellValue.includes(searchValue);
		},
	},
	{
		accessorKey: 'type',
		header: 'Type',
		cell: ({ row }) => hallTypeMap[row.original.type] || row.original.type,
	},
	{
		accessorKey: 'capacity',
		header: 'Capacity',
		cell: ({ row }) => row.original.capacity,
	},
	{
		accessorKey: 'is_available',
		header: 'Status',
		cell: ({ row }) => (
			<div
				className={`font-medium ${!row.original.is_available ? 'text-red-600' : ''}`}
			>
				{row.original.is_available ? 'Available' : 'Not Available'}
			</div>
		),
	},
	{
		id: 'actions',
		header: 'Actions',
		cell: ActionsCell,
	},
];

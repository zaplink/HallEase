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

import { MoreHorizontal } from 'lucide-react';
import { toast } from 'sonner';

type ActionsCellProps = {
	row: Row<HallType>; // Use Row type from @tanstack/react-table
};

const ActionsCell: React.FC<ActionsCellProps> = ({ row }) => {
	const hall = row.original;
	const router = useRouter();

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
				<DropdownMenuItem
					onClick={() => {
						navigator.clipboard.writeText(hall.id);
						toast('Hall ID Copied!', {
							description: `${hall.id}`,
							action: {
								label: 'View Hall',
								onClick: () => router.push(`/hall/${hall.id}`),
							},
						});
					}}
				>
					Copy Hall ID
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem
					onClick={() => router.push(`/reserve/${hall.id}`)}
				>
					Book Hall
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => router.push(`/hall/${hall.id}`)}
				>
					View Hall
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => router.push(`/hall/${hall.id}/edit`)}
				>
					Edit Hall
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

const buildingNameMap: Record<string, string> = {
	ACD: 'Academic',
	LAB: 'Lab',
	ADM: 'Admin',
	ACC: 'Accommodation',
	AUD: 'Auditorium',
};

const hallTypeMap: Record<string, string> = {
	CMP: 'Computer Lab',
	'CMP-VR': 'Computer Lab - VR',
	'CMP-MAIN': 'Computer Lab - Main',
	'CMP-MAT': 'Computer Lab - Material',
	'CMP-DAT': 'Computer Lab - Data science',
	EW: 'Engineering Workshop',
	LCH: 'Lecture Hall',
	ELP: 'Chemistry Lab',
	ML: 'Mechanical Lab',
};

export const columns: ColumnDef<HallType>[] = [
	{
		accessorKey: 'id', // This is the column name you want
		header: 'ID',
		cell: ({ row }) => row.original.id, // Use the real property name here
	},
	{
		accessorKey: 'location',
		header: 'Location',
		cell: ({ row }) => {
			const hall = row.original;
			const buildingFull =
				buildingNameMap[hall.building] || hall.building;
			return `${buildingFull} -  ${hall.floor == 0 ? 'G' : hall.floor}`;
		},
	},
	{ accessorKey: 'capacity', header: 'Capacity' },
	{
		accessorKey: 'type',
		header: 'Type',
		cell: ({ row }) => {
			const hall = row.original;
			return hallTypeMap[hall.type] || hall.type;
		},
	},
	{ accessorKey: 'status', header: 'Status' },
	{
		id: 'actions',
		cell: ActionsCell, // Use typed component here
	},
];

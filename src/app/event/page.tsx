import SidebarLayout from '@/layouts/SidebarLayout';
import {
	Table,
	TableBody,
	// TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';

import { FaInfoCircle } from 'react-icons/fa';

import clsx from 'clsx';

export default function Event() {
	return (
		<SidebarLayout>
			<div
				style={{
					display: 'centre',
					justifyContent: 'center',
					alignItems: 'center',
					height: '100vh',
				}}
			>
				<Table
					className={clsx(
						'table-auto',
						'border-separate border border-Blue-400',
						'bg-black-100'
					)}
				>
					<TableHeader>
						<TableRow>
							<TableHead className='w-[100px]'>Event</TableHead>
							<TableHead>Duration</TableHead>
							<TableHead>Date</TableHead>
							<TableHead>Status</TableHead>
							<TableHead className='text-left'>Actions</TableHead>
						</TableRow>
					</TableHeader>

					<TableBody>
						<TableRow>
							<TableCell className='font-medium'>
								Exhibition
							</TableCell>
							<TableCell>2</TableCell>
							<TableCell>2025-02-05</TableCell>
							<TableCell>pending</TableCell>
							<TableCell className='text-right'>
								<FaInfoCircle size={24} />
							</TableCell>
						</TableRow>

						<TableRow>
							<TableCell className='font-medium'>
								Exhibition
							</TableCell>
							<TableCell>2</TableCell>
							<TableCell>2025-02-05</TableCell>
							<TableCell>pending</TableCell>
							<TableCell className='text-right'>
								<FaInfoCircle size={24} />
							</TableCell>
						</TableRow>

						<TableRow>
							<TableCell className='font-medium'>
								Exhibition
							</TableCell>
							<TableCell>2</TableCell>
							<TableCell>2025-02-05</TableCell>
							<TableCell>pending</TableCell>
							<TableCell className='text-right'>
								<FaInfoCircle size={24} />
							</TableCell>
						</TableRow>

						<TableRow>
							<TableCell className='font-medium'>
								Exhibition
							</TableCell>
							<TableCell>2</TableCell>
							<TableCell>2025-02-05</TableCell>
							<TableCell>pending</TableCell>
							<TableCell className='text-right'>
								<FaInfoCircle size={24} />
							</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			</div>
		</SidebarLayout>
	);
}

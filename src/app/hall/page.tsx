'use client';

import SidebarLayout from '@/layouts/Sidebar/Layout';
import { Input } from '@/components/ui/input';
import {
	Table,
	TableHeader,
	TableHead,
	TableBody,
	TableRow,
	TableCell,
} from '@/components/ui/table';
import useHalls from '@/hooks/useHalls';

export default function Hall() {
	const { halls, loading, error } = useHalls();

	if (loading)
		return (
			<SidebarLayout>
				<p className='text-center text-gray-500 mt-[120px]'>
					Loading Halls...
				</p>
			</SidebarLayout>
		);
	if (error)
		return (
			<SidebarLayout>
				<p className='text-center text-red-500 mt-[120px]'>
					Error: {error}
				</p>
			</SidebarLayout>
		);
	return (
		// Sidebar layout
		<SidebarLayout>
			<div className='mb-6 flex flex-row'>
				{/* Search halls */}
				<Input placeholder='Search Halls' />
			</div>

			{/* Table */}
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Hall ID</TableHead>
						<TableHead>Type</TableHead>
						<TableHead>Capacity</TableHead>
						<TableHead>Availability</TableHead>
						<TableHead>Recent Activity</TableHead>
						<TableHead>Recent Activity Type</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{halls.map((hall) => (
						<TableRow key={hall.id}>
							<TableCell>{hall.room}</TableCell>
							<TableCell>{hall.type}</TableCell>
							<TableCell>{hall.capacity}</TableCell>
							<TableCell>Testing</TableCell>
							<TableCell>Testing</TableCell>
							<TableCell>Testing</TableCell>
						</TableRow>
					))}

					{/* <TableRow>
						<TableCell>LAB-03</TableCell>
						<TableCell>Lab</TableCell>
						<TableCell>75</TableCell>
						<TableCell>Available</TableCell>
						<TableCell>In 7 days</TableCell>
						<TableCell>Session</TableCell>
					</TableRow> */}
				</TableBody>
			</Table>
		</SidebarLayout>
	);
}

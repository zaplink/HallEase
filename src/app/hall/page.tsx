import SidebarLayout from '@/layouts/SidebarLayout';
import { Input } from '@/components/ui/input';
import {
	Table,
	TableHeader,
	TableHead,
	TableBody,
	TableRow,
	TableCell,
} from '@/components/ui/table';

export default function Hall() {
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
					<TableRow>
						<TableCell>AB-LCH-01</TableCell>
						<TableCell>Lecture Hall</TableCell>
						<TableCell>100</TableCell>
						<TableCell>Unvailable</TableCell>
						<TableCell>Tomorrow</TableCell>
						<TableCell>Lecture</TableCell>
					</TableRow>
					<TableRow>
						<TableCell>AB-LCH-02</TableCell>
						<TableCell>Lecture Hall</TableCell>
						<TableCell>50</TableCell>
						<TableCell>Available</TableCell>
						<TableCell>Jan 31, 2025</TableCell>
						<TableCell>Event</TableCell>
					</TableRow>
					<TableRow>
						<TableCell>LAB-03</TableCell>
						<TableCell>Lab</TableCell>
						<TableCell>75</TableCell>
						<TableCell>Available</TableCell>
						<TableCell>In 7 days</TableCell>
						<TableCell>Session</TableCell>
					</TableRow>
				</TableBody>
			</Table>
		</SidebarLayout>
	);
}

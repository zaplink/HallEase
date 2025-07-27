'use client';

import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import PageHeader from '@/components/custom/PageHeader';
import { Separator } from '@/components/ui/separator';

function Requestpage() {
	return (
		<div>
			<PageHeader
				title='Request ID: 1002'
				descriptions={['2025-01-01', '08.00 AM', 'John Doe']}
			/>

			<Table>
				<TableBody>
					<TableRow>
						<TableCell className='flex flex-col'>
							<span className='font-semibold'>Event Name</span>
							<span className='font-medium text-gray-600'>
								Dream Big 2025 Conference
							</span>
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell className='flex flex-col'>
							<span className='font-semibold'>Event Type</span>
							<span className='font-medium text-gray-600'>
								Seminar
							</span>
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell className='flex flex-col'>
							<span className='font-semibold'>Organized By</span>
							<span className='font-medium text-gray-600'>
								Innovative Society
							</span>
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell className='flex flex-col'>
							<span className='font-semibold'>
								Event Description
							</span>
							<span className='font-medium text-gray-600'>
								An inspiring event that brings creative minds
								together.
							</span>
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell className='flex flex-col'>
							<span className='font-semibold'>
								Number of Attendees
							</span>
							<span className='font-medium text-gray-600'>
								100
							</span>
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell className='flex flex-col'>
							<span className='font-semibold'>Hall/Location</span>
							<span className='font-medium text-gray-600'>
								AB-LCH-01
							</span>
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell className='flex flex-col'>
							<span className='font-semibold'>Contact Email</span>
							<span className='font-medium text-gray-600'>
								example@domain.com
							</span>
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell className='flex flex-col'>
							<span className='font-semibold'>Contact Phone</span>
							<span className='font-medium text-gray-600'>
								(123) 456-7890
							</span>
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell className='flex flex-col'>
							<span className='font-semibold'>
								Special Requests
							</span>
							<span className='font-medium text-gray-600'>
								Please arrange extra chairs.
							</span>
						</TableCell>
					</TableRow>
				</TableBody>
			</Table>

			<Separator />
			<div className='mt-6 flex flex-row gap-4'>
				<Button>Approve</Button>
				<Button>Reject</Button>
			</div>
		</div>
	);
}

export default Requestpage;

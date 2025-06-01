'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import SidebarLayout from '@/layouts/Sidebar/Layout';
import { Hall as HallType } from '@/app/halls/hall';
import { getHall } from '@/lib/getHall';

import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';

import { Button } from '@/components/ui/button';

import PageHeader from '@/components/custom/PageHeader';
import Loading from '@/components/custom/Loading';

export default function Hall() {
	const { id } = useParams<{ id: string }>();

	const [hall, setHall] = useState<HallType | null>(null);
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		if (!id) return;

		setLoading(true);
		getHall(id).then((data) => {
			setHall(data);
			setLoading(false);
		});
	}, [id]);

	if (loading) {
		return (
			<SidebarLayout>
				<Loading className='mt-10 mx-auto' />
			</SidebarLayout>
		);
	}

	if (!hall) {
		return (
			<SidebarLayout>
				<p>Hall not found</p>
			</SidebarLayout>
		);
	}

	return (
		<SidebarLayout>
			<PageHeader
				title={hall.id}
				descriptions={[hall.type]}
				extra={<Button>Book Hall</Button>}
			></PageHeader>

			<div className='flex flex-row justify-between gap-x-10'>
				<div className='w-7/12 flex flex-row gap-x-10'>
					<div className='w-1/2'>
						<Table>
							<TableBody>
								<TableRow>
									<TableCell className='font-medium'>
										Capacity
									</TableCell>
									<TableCell>{hall.capacity}</TableCell>
								</TableRow>
								<TableRow>
									<TableCell className='font-medium'>
										Status
									</TableCell>
									<TableCell>{hall.status}</TableCell>
								</TableRow>
							</TableBody>
						</Table>
					</div>
					<div className='w-1/2'>
						<Table>
							<TableBody>
								<TableRow>
									<TableCell className='font-medium'>
										Energy Consumption
									</TableCell>
									<TableCell>5.5</TableCell>
								</TableRow>
								<TableRow>
									<TableCell className='font-medium'>
										Usage
									</TableCell>
									<TableCell>80%</TableCell>
								</TableRow>
							</TableBody>
						</Table>
					</div>
				</div>

				<div className='w-5/12 h-[300px] bg-gray-100 rounded-sm'></div>
			</div>
		</SidebarLayout>
	);
}

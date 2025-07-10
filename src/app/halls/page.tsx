'use client';

import SidebarLayout from '@/layouts/Sidebar/Layout';
import { Hall as HallType } from './hall';
import { columns } from './columns';
import { DataTable } from './data-table';
import { getHalls } from './getHalls';
import { useEffect, useState } from 'react';
import Loading from '@/components/custom/Loading';
import PageHeader from '@/components/custom/PageHeader';

export default function Hall() {
	const [halls, setHalls] = useState<HallType[] | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function fetchHalls() {
			try {
				const data = await getHalls();
				setHalls(data);
			} catch (error) {
				console.error('Failed to fetch halls:', error);
			} finally {
				setLoading(false);
			}
		}

		fetchHalls();
	}, []);

	return (
		<SidebarLayout>
			<PageHeader
				title='Halls'
				descriptions={['View and manage lecture halls']}
			/>
			<div className='container mx-auto'>
				{loading ? (
					<Loading text='Loading halls' pageView />
				) : (
					<DataTable columns={columns} data={halls || []} />
				)}
			</div>
		</SidebarLayout>
	);
}

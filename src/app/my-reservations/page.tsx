'use client';

import SidebarLayout from '@/layouts/Sidebar/Layout';
import PageHeader from '@/components/custom/PageHeader';
import Loading from '@/components/custom/Loading';
import { useState, useEffect } from 'react';
import { UnifiedReservationRow } from './reservation';
import { reservationColumns } from './reservationColumns';
import { DataTable } from './data-table';
import { getUnifiedReservations } from './getUnifiedReservations';

function Page() {
	const [data, setData] = useState<UnifiedReservationRow[] | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function fetchData() {
			try {
				const unifiedData = await getUnifiedReservations();
				setData(unifiedData);
			} catch (err) {
				console.error('Failed to fetch reservations', err);
			} finally {
				setLoading(false);
			}
		}

		fetchData();
	}, []);

	return (
		<SidebarLayout>
			<PageHeader title='Reservation History' />
			<div className='container mx-auto'>
				{loading || data === null ? (
					<Loading text='Loading reservations' pageView />
				) : (
					<DataTable columns={reservationColumns} data={data} />
				)}
			</div>
		</SidebarLayout>
	);
}

export default Page;

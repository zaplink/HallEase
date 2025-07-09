'use client';

import SidebarLayout from '@/layouts/Sidebar/Layout';
import PageHeader from '@/components/custom/PageHeader';
import Loading from '@/components/custom/Loading';
import { useState, useEffect } from 'react';
import { UnifiedReservationRow } from '../my-reservations/reservation';
import { draftReservationColumns } from './reservationColumns';
import { DataTable } from '../my-reservations/data-table';
import { getDraftReservations } from '../reservation-drafts/getDraftReservations';

function Page() {
	const [data, setData] = useState<UnifiedReservationRow[] | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function fetchData() {
			try {
				const draftData = await getDraftReservations();
				setData(draftData);
			} catch (err) {
				console.error('Failed to fetch draft reservations', err);
			} finally {
				setLoading(false);
			}
		}
		fetchData();
	}, []);

	return (
		<SidebarLayout>
			<PageHeader title='Saved Drafts' />
			<div className='container mx-auto'>
				{loading || data === null ? (
					<Loading text='Loading drafts' pageView />
				) : (
					<DataTable columns={draftReservationColumns} data={data} />
				)}
			</div>
		</SidebarLayout>
	);
}

export default Page;

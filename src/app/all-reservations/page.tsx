'use client';

import SidebarLayout from '@/layouts/Sidebar/Layout';
import PageHeader from '@/components/custom/PageHeader';
import Loading from '@/components/custom/Loading';
import { useState, useEffect } from 'react';
import { UnifiedReservationRow } from './reservation';
import { reservationColumns } from './reservationColumns';
import { DataTable } from './data-table';
import { getUnifiedReservations } from './getUnifiedReservations';
import ProtectedPage from '@/layouts/ProtectedPage';

function Page() {
	const [data, setData] = useState<UnifiedReservationRow[] | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		async function fetchData() {
			try {
				setError(null);
				const unifiedData = await getUnifiedReservations();
				setData(unifiedData);
			} catch (err) {
				console.error('Failed to fetch reservations', err);
				setError(
					'Failed to load reservations. Please try again later.'
				);
			} finally {
				setLoading(false);
			}
		}

		fetchData();
	}, []);

	return (
		
		<ProtectedPage>
			<SidebarLayout>
				<PageHeader title='All Reservations' />
				<div className='container mx-auto'>
					{loading ? (
						<Loading text='Loading reservations' pageView />
					) : error ? (
						<div className='flex items-center justify-center min-h-[200px]'>
							<div className='text-center'>
								<p className='text-red-600 mb-4'>{error}</p>
								<button
									onClick={() => window.location.reload()}
									className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'
								>
									Retry
								</button>
							</div>
						</div>
					) : (
						<DataTable
							columns={reservationColumns}
							data={data || []}
						/>
					)}
				</div>
			</SidebarLayout>
		</ProtectedPage>
	);
}

export default Page;

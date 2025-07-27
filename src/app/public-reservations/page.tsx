import React from 'react';
import ReservationTable from './reservation-table';
import SidebarLayout from '@/layouts/Sidebar/Layout';
import ProtectedPage from '@/layouts/ProtectedPage';

function page() {
	return (
		<ProtectedPage>
		<SidebarLayout>
			<ReservationTable />
		</SidebarLayout>
		</ProtectedPage>

	);
}

export default page;

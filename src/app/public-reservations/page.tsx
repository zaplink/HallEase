import React from 'react';
import ReservationTable from './reservation-table';
import SidebarLayout from '@/layouts/Sidebar/Layout';

function page() {
	return (
		<SidebarLayout>
			<ReservationTable />
		</SidebarLayout>
	);
}

export default page;

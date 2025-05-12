import React from 'react';
import SidebarLayout from '@/layouts/Sidebar/Layout';
import ReserveLectureForm from '@/app/reserve/lecture/comps/ReserveLectureForm';
import PageHeader from '@/components/custom/PageHeader';

async function page() {
	return (
		<SidebarLayout>
			<PageHeader
				title='Reserve a Lecture Hall'
				descriptions={[
					'Provide the required details to proceed with your booking',
				]}
			/>
			<ReserveLectureForm />
		</SidebarLayout>
	);
}

export default page;

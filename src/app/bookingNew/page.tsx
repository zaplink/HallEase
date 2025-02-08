import React from 'react';
import Bookingformnew from '@/components/ui/bookingformnew';
import SidebarLayout from '@/layouts/SidebarLayout';
function page() {
	return (
		<>
			<SidebarLayout>
				<Bookingformnew />
			</SidebarLayout>
		</>
	);
}

export default page;

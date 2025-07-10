'use client';

import SidebarLayout from '@/layouts/Sidebar/Layout';
import PageHeader from '@/components/custom/PageHeader';
import { useRouter } from 'next/navigation';

// Import the original stepper ReserveEventForm
import EventForm from '../forms/event/ReserveEventForm';

export default function EventReservePage() {
	const router = useRouter();

	const handleBackToSelection = () => {
		router.push('/reserve');
	};

	return (
		<SidebarLayout>
			<PageHeader
				title='Reserve Event'
				descriptions={['Create a reservation for your event']}
			/>
			<EventForm onBackToSelection={handleBackToSelection} />
		</SidebarLayout>
	);
}

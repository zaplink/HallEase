'use client';

import ReserveLectureForm from '../forms/lecture/ReserveLectureStepperForm';
import SidebarLayout from '@/layouts/Sidebar/Layout';
import PageHeader from '@/components/custom/PageHeader';
import { useRouter } from 'next/navigation';

export default function ExtraLectureReservePage() {
	const router = useRouter();

	const handleBackToSelection = () => {
		router.push('/reserve');
	};

	return (
		<SidebarLayout>
			<PageHeader
				title='Reserve Extra Lecture'
				descriptions={[
					'Fill in the details to reserve a hall for your extra lecture.',
				]}
			/>
			<div className='w-full'>
				<ReserveLectureForm onBackToSelection={handleBackToSelection} />
			</div>
		</SidebarLayout>
	);
}

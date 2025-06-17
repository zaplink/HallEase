'use client';

import SidebarLayout from '@/layouts/Sidebar/Layout';
import PageHeader from '@/components/custom/PageHeader';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { useState } from 'react';
import ReserveEventForm from '../forms/event/ReserveEventForm';
import ReserveLectureForm from '../forms/lecture/ReserveLectureForm';
import { useParams } from 'next/navigation';

export default function ReservePage() {
	const [purpose, setPurpose] = useState<string | undefined>(undefined);
	const params = useParams();
	const hallId = params['hall-id'];

	return (
		<SidebarLayout>
			<PageHeader
				title={`Reserve ${hallId}`}
				descriptions={['Let’s get everything set up for you.']}
				extra={
					<Select onValueChange={setPurpose}>
						<SelectTrigger className='w-[180px]'>
							<SelectValue placeholder='Purpose' />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value='event'>Event</SelectItem>
							<SelectItem value='lecture'>Lecture</SelectItem>
						</SelectContent>
					</Select>
				}
			/>

			{!purpose && (
				<div className='mt-[140px] text-sm text-muted-foreground text-center'>
					Please select a purpose to continue!
				</div>
			)}
			{purpose === 'event' && <ReserveEventForm />}
			{purpose === 'lecture' && <ReserveLectureForm />}
		</SidebarLayout>
	);
}

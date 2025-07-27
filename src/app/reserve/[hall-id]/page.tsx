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
// import ReserveLectureForm from '../forms/lecture/ReserveLectureForm';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useRouter } from 'next/navigation';

export default function ReservePage() {
	const [purpose, setPurpose] = useState<string | undefined>(undefined);
	const params = useParams();
	const hallId = params['hall-id'];
	const router = useRouter();

	return (
		<SidebarLayout>
			<PageHeader
				title={`Reserve ${hallId}`}
				descriptions={['Let’s get everything set up for you.']}
				extra={
					<div className='flex flex-row gap-2 items-center'>
						<Button
							variant={'link'}
							onClick={() => router.push(`/reserve`)}
						>
							Reserve Another Hall
						</Button>
						<Separator
							orientation='vertical'
							className='h-6 mx-4'
						/>
						<Select onValueChange={setPurpose}>
							<SelectTrigger className='w-[180px]'>
								<SelectValue placeholder='Purpose' />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value='event'>Event</SelectItem>
								<SelectItem value='lecture'>Lecture</SelectItem>
							</SelectContent>
						</Select>
					</div>
				}
			/>

			{!purpose && (
				<div className='mt-[140px] text-sm text-muted-foreground text-center'>
					Please select a purpose to continue!
				</div>
			)}
			{purpose === 'event' && <ReserveEventForm />}
			{/* {purpose === 'lecture' && <ReserveLectureForm />} */}
		</SidebarLayout>
	);
}

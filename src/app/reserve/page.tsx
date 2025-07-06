'use client';

import SidebarLayout from '@/layouts/Sidebar/Layout';
import PageHeader from '@/components/custom/PageHeader';
import { Button } from '@/components/ui/button';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { useState } from 'react';
import ReserveEventForm from './forms/event/ReserveEventForm';
import ReserveLectureForm from './forms/lecture/ReserveLectureForm';
import StepperForm from './components/TemplateStepperForm';

export default function ReservePage() {
	const [purpose, setPurpose] = useState<string | undefined>(undefined);

	const purposes = [
		{
			id: 'lecture',
			label: 'Lecture',
			description: 'Academic lectures and classes',
		},
		{
			id: 'event',
			label: 'Event',
			description: 'Conferences and presentations',
		},
		{
			id: 'meeting',
			label: 'Meeting',
			description: 'Team meetings and discussions',
		},
		{
			id: 'workshop',
			label: 'Workshop',
			description: 'Training and workshops',
		},
		{
			id: 'seminar',
			label: 'Seminar',
			description: 'Educational seminars',
		},
	];

	return (
		<SidebarLayout>
			<PageHeader
				title='Reserve a Space'
				descriptions={['Let’s get everything set up for you.']}
				extra={
					purpose ? (
						<Select value={purpose} onValueChange={setPurpose}>
							<SelectTrigger className='w-[180px]'>
								<SelectValue placeholder='Purpose' />
							</SelectTrigger>
							<SelectContent>
								{purposes.map((purposeOption) => (
									<SelectItem
										key={purposeOption.id}
										value={purposeOption.id}
									>
										{purposeOption.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					) : undefined
				}
			/>

			{!purpose && (
				<div className='space-y-6'>
					<div className='text-center'>
						<h3 className='text-lg font-medium mb-2'>
							What's the purpose of your reservation?
						</h3>
						<p className='text-sm text-muted-foreground'>
							Select the type of activity you're planning
						</p>
					</div>

					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto'>
						{purposes.map((purposeOption) => (
							<Button
								key={purposeOption.id}
								variant='outline'
								className='h-auto p-6 flex flex-col items-center text-center space-y-2 hover:bg-accent'
								onClick={() => setPurpose(purposeOption.id)}
							>
								<div className='font-medium text-base'>
									{purposeOption.label}
								</div>
								<div className='text-sm text-muted-foreground'>
									{purposeOption.description}
								</div>
							</Button>
						))}
					</div>
				</div>
			)}

			{purpose === 'lecture' && <StepperForm />}
			{purpose === 'event' && <ReserveEventForm />}
			{purpose === 'meeting' && <ReserveLectureForm />}
			{purpose === 'workshop' && <StepperForm />}
			{purpose === 'seminar' && <ReserveLectureForm />}
		</SidebarLayout>
	);
}

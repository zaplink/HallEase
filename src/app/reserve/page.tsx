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

export default function ReservePage() {
	const [purpose, setPurpose] = useState<string | undefined>(undefined);

	return (
		<SidebarLayout>
			<PageHeader
				title='Reserve a Space'
				descriptions={['Let’s get everything set up for you.']}
				extra={
					<Select onValueChange={setPurpose}>
						<SelectTrigger className='w-[180px]'>
							<SelectValue placeholder='Purpose' />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value='event'>Event</SelectItem>
							<SelectItem value='lecture'>Lecture</SelectItem>
							<SelectItem value='meeting'>Meeting</SelectItem>
						</SelectContent>
					</Select>
				}
			/>

			<div>
				{!purpose && (
					<div className='mt-[140px] text-sm text-muted-foreground text-center'>
						Please select a purpose to continue!
					</div>
				)}
				{purpose === 'event' && <span>Event selected</span>}
				{purpose === 'lecture' && <span>Lecture selected</span>}
			</div>
		</SidebarLayout>
	);
}

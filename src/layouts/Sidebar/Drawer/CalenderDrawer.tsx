import {
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from '@/components/ui/drawer';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import React from 'react';
import { format } from 'date-fns';

export default function CalenderDrawer() {
	// Calender state
	const [date, setDate] = React.useState<Date | undefined>(new Date());

	const formattedDate = date ? format(date, 'dd MMMM yyyy') : '';
	return (
		<Drawer>
			<DrawerTrigger asChild>
				<Button
					// onClick={toggleCalendar}
					variant='ghost'
					className='p-2'
				>
					<CalendarIcon size={20} />
				</Button>
			</DrawerTrigger>
			<DrawerContent>
				<div className='mx-auto w-full max-w-sm'>
					<DrawerHeader>
						<DrawerTitle>{formattedDate}</DrawerTitle>
						<DrawerDescription>Have a Good Day</DrawerDescription>
					</DrawerHeader>
					<div className='flex'>
						<Calendar
							mode='single'
							selected={date}
							onSelect={setDate}
							className='rounded-md border bg-white'
						/>
					</div>
				</div>
			</DrawerContent>
		</Drawer>
	);
}

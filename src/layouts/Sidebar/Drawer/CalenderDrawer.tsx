import {
	Dialog,
	DialogContent,
	DialogTrigger,
	DialogTitle,
} from '@/components/ui/dialog';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import React from 'react';
import { format } from 'date-fns';

export default function CalenderDialog() {
	const [date, setDate] = React.useState<Date | undefined>(new Date());
	const [isOpen, setIsOpen] = React.useState(false);
	const formattedDate = date ? format(date, 'dd MMMM yyyy') : '';

	// Reset date to today whenever dialog opens
	React.useEffect(() => {
		if (isOpen) {
			setDate(new Date());
		}
	}, [isOpen]);

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button variant='ghost' className='p-2'>
					<CalendarIcon size={20} />
				</Button>
			</DialogTrigger>
			<DialogContent className='w-[280px] pt-2 pb-0 px-1'>
				<DialogTitle className='sr-only'>Calendar</DialogTitle>
				<div className='flex flex-col items-center gap-1 mb-2'>
					<span className='text-base font-semibold'>
						{formattedDate}
					</span>
					<span className='text-sm text-muted-foreground'>
						Have a Good Day !
					</span>
				</div>
				<div className='flex justify-center'>
					<Calendar
						mode='single'
						selected={date}
						onSelect={setDate}
						className='border-0 min-h-[350px]'
					/>
				</div>
			</DialogContent>
		</Dialog>
	);
}

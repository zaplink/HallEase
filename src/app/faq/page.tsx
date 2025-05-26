import React from 'react';
import SidebarLayout from '@/layouts/Sidebar/Layout';
import * as Accordion from '@radix-ui/react-accordion';
import { ChevronDown } from 'lucide-react';

const faqs = [
	{
		question: 'How do I book a hall for my event?',
		answer: "Log in to your dashboard, go to 'Reserve a Hall', Then click the purpose(event,lecture).Then proceed the process. That’s it—you’re good to go!",
	},
	{
		question: 'Can I edit or cancel a booking after submission?',
		answer: "Yep! If your event is more than 24 hours away, just head to 'My Bookings' and hit edit or cancel—super easy.",
	},
	{
		question: 'What types of events are allowed?',
		answer: 'We’re cool with most things—workshops, club meetings, study groups, parties, you name it. Just check each hall’s rules first.',
	},
	{
		question: 'How can I check hall availability?',
		answer: "Click on 'Check Availability' to see a calendar that shows when each hall is booked or free. No guessing!",
	},
	{
		question: 'Is there a fee for booking?',
		answer: 'No fees included in booking halls.',
	},
	{
		question: 'What happens if I face a technical issue?',
		answer: "Ran into a bug? Go to 'Report an Issue' under Help, write a quick note (screenshots help!), and we’ll sort it out ASAP.",
	},
	{
		question: 'Can I upload documents or images with my booking?',
		answer: "Absolutely! You can add things like PDFs, Word docs, or images in the 'Attachments' section during booking.",
	},
	{
		question: 'Who should I contact for emergency changes?',
		answer: "If it’s urgent, use the contact info under 'Support Contacts'. We’ll jump in quickly.",
	},
];

export default function FAQPage() {
	return (
		<SidebarLayout>
			<div className='flex flex-col items-center justify-center py-10 px-4'>
				<h1 className='text-2xl font-bold mb-6'>
					FAQ - Frequently Asked Questions
				</h1>
				<div className='w-full max-w-4xl'>
					<Accordion.Root
						type='single'
						collapsible
						className='space-y-4'
					>
						{faqs.map((faq, index) => (
							<Accordion.Item
								key={index}
								value={`faq-${index}`}
								className='border border-gray-200 rounded-xl px-6 py-4 shadow-md'
							>
								<Accordion.Header>
									<Accordion.Trigger className='flex justify-between items-center w-full text-left cursor-pointer'>
										<span className='text-lg font-medium'>
											{faq.question}
										</span>
										<ChevronDown className='w-5 h-5' />
									</Accordion.Trigger>
								</Accordion.Header>
								<Accordion.Content className='mt-2 text-gray-600'>
									{faq.answer}
								</Accordion.Content>
							</Accordion.Item>
						))}
					</Accordion.Root>
				</div>
			</div>
		</SidebarLayout>
	);
}

'use client';

import React, { useState } from 'react';
import SidebarLayout from '@/layouts/Sidebar/Layout';
import {
	Accordion,
	AccordionItem,
	AccordionTrigger,
	AccordionContent,
} from '@/components/ui/accordion';

const faqs = [
	{
		question: 'How do I book a hall for my event?',
		answer: "It's pretty simple! Just log in to your dashboard, click on 'Reserve a Hall', choose the purpose (like event or lecture), follow the steps, and you're all set!",
	},
	{
		question: 'Can I edit or cancel a booking after submission?',
		answer: "No worries! If your event is more than 24 hours away, just go to 'My Bookings' and you can easily edit or cancel your booking.",
	},
	{
		question: 'What types of events are allowed?',
		answer: "We’re pretty flexible! Workshops, club meetings, study groups, parties—you name it. Just make sure to check each hall's specific rules before you book.",
	},
	{
		question: 'How can I check hall availability?',
		answer: "Just click on 'Check Availability' to see a handy calendar showing when halls are free or booked. No more guessing games!",
	},
	{
		question: 'Is there a fee for booking?',
		answer: 'Good news—booking halls doesn’t cost you anything. It’s totally free!',
	},
	{
		question: 'What happens if I face a technical issue?',
		answer: "Uh-oh! If something’s not working right, head over to 'Report an Issue' under Help, jot down what happened (screenshots really help!), and we’ll get it sorted out as soon as possible.",
	},
	{
		question: 'Can I upload documents or images with my booking?',
		answer: "Yep! Feel free to add PDFs, Word documents, images, or anything else in the 'Attachments' section when you’re booking.",
	},
	{
		question: 'Who should I contact for emergency changes?',
		answer: "If it’s urgent, check out the contact info under 'Support Contacts'—we’re ready to jump in and help quickly!",
	},
];

export default function FAQPage() {
	const [searchTerm, setSearchTerm] = useState('');

	// Filter FAQs based on the search term
	const filteredFaqs = faqs.filter(
		(faq) =>
			faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
			faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
	);

	return (
		<SidebarLayout>
			<div className='flex flex-col items-center justify-center py-10 px-4'>
				<h1 className='text-xl font-bold mb-4'>
					FAQ - Frequently Asked Questions
				</h1>
				{/* Search Bar */}
				<div className='w-full max-w-4xl mb-4'>
					<input
						type='text'
						placeholder='Search FAQs...'
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className='w-full p-2 border border-gray-300 rounded-md text-sm'
					/>
				</div>
				<div className='w-full max-w-4xl'>
					<Accordion type='single' collapsible className='space-y-2'>
						{filteredFaqs.map((faq, index) => (
							<AccordionItem key={index} value={`faq-${index}`}>
								<AccordionTrigger className='text-base font-medium'>
									{faq.question}
								</AccordionTrigger>
								<AccordionContent className='text-sm text-muted-foreground'>
									{faq.answer}
								</AccordionContent>
							</AccordionItem>
						))}
					</Accordion>
				</div>
			</div>
		</SidebarLayout>
	);
}

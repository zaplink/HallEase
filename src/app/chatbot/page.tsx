'use client';

import SidebarLayout from '@/layouts/Sidebar/Layout';
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

// Define the shape of a chat message
interface Message {
	text: string;
	sender: 'user' | 'bot'; // To differentiate who sent the message
}

export default function ChatbotPage() {
	// State to store all the messages in the chat
	const [messages, setMessages] = useState<Message[]>([]);
	// State to store the current input from the user
	const [input, setInput] = useState('');
	// State to show a loading indicator when the bot is thinking
	const [loading, setLoading] = useState(false);

	// Ref to automatically scroll to the bottom of the chat
	const messagesEndRef = useRef<HTMLDivElement>(null);

	// Effect to scroll to the bottom whenever messages change
	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, [messages]);

	// Function to send the user's message to the API
	const sendMessage = async () => {
		if (input.trim() === '') return;

		const newUserMessage: Message = { text: input, sender: 'user' };
		setMessages((prevMessages) => [...prevMessages, newUserMessage]);
		setInput('');
		setLoading(true);

		try {
			const response = await fetch('/api/chatbot', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ message: input }),
			});

			const data = await response.json();

			let botResponseText =
				"Sorry, I couldn't get a response. Please try again.";

			if (response.ok) {
				if (data.message) {
					botResponseText = data.message;
				}
			} else {
				botResponseText =
					data.message || 'An error occurred with the chatbot.';
				console.error('API Error:', data);
			}

			const newBotMessage: Message = {
				text: botResponseText,
				sender: 'bot',
			};
			setMessages((prevMessages) => [...prevMessages, newBotMessage]);
		} catch (error) {
			console.error('Frontend error sending message:', error);
			setMessages((prevMessages) => [
				...prevMessages,
				{
					text: 'An unexpected error occurred. Please try again later.',
					sender: 'bot',
				},
			]);
		} finally {
			setLoading(false);
		}
	};

	// Handle Enter key press in the input field
	const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter' && !loading) {
			sendMessage();
		}
	};

	return (
		<SidebarLayout>
			<div className='flex flex-col h-screen w-2/3 mx-auto p-4'>
				<Card className='w-full'>
					<CardHeader>
						<CardTitle className='text-3xl font-bold text-center text-blue-700'>
							HallEase Chat Assistant
						</CardTitle>
					</CardHeader>
					<CardContent className='p-4'>
						<ScrollArea className='h-[60vh] pr-4'>
							<div className='space-y-4'>
								{messages.length === 0 && (
									<p className='text-center text-gray-500 italic'>
										How can I assist you today?
									</p>
								)}
								{messages.map((msg, index) => (
									<div
										key={index}
										className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
									>
										<div
											className={`max-w-[70%] p-3 rounded-lg shadow-md ${
												msg.sender === 'user'
													? 'bg-blue-500 text-white rounded-br-none'
													: 'bg-gray-200 text-gray-800 rounded-bl-none'
											}`}
										>
											{msg.text}
										</div>
									</div>
								))}
								{loading && (
									<div className='flex justify-start'>
										<div className='p-3 rounded-lg bg-gray-200 text-gray-600 animate-pulse'>
											Bot is typing...
										</div>
									</div>
								)}
								<div ref={messagesEndRef} />
							</div>
						</ScrollArea>
						<div className='mt-4 flex gap-2'>
							<Input
								type='text'
								value={input}
								onChange={(e) => setInput(e.target.value)}
								onKeyPress={handleKeyPress}
								placeholder="e.g., 'What halls are available?' or 'Find events upcoming events'"
								disabled={loading}
								className='flex-1'
							/>
							<Button
								onClick={sendMessage}
								disabled={loading}
								className='ml-2 bg-blue-700 hover:bg-blue-950 text-white'
							>
								Send
							</Button>
						</div>
					</CardContent>
				</Card>
			</div>
		</SidebarLayout>
	);
}

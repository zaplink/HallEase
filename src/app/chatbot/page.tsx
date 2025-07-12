// app/chatbot/page.tsx
'use client'; // <-- THIS IS CRUCIAL! It tells Next.js this is a client component.

import SidebarLayout from '@/layouts/Sidebar/Layout';
import React, { useState, useRef, useEffect } from 'react';

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
		// Don't send empty messages
		if (input.trim() === '') return;

		// 1. Add the user's message to the chat display
		const newUserMessage: Message = { text: input, sender: 'user' };
		setMessages((prevMessages) => [...prevMessages, newUserMessage]);
		setInput(''); // Clear the input field
		setLoading(true); // Show loading indicator

		try {
			// 2. Send the message to your Next.js API route (/api/chatbot)
			const response = await fetch('/api/chatbot', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ message: input }), // Send the user's message as JSON
			});

			// 3. Parse the JSON response from your API
			const data = await response.json();

			let botResponseText =
				"Sorry, I couldn't get a response. Please try again.";

			if (response.ok) {
				// If the API call was successful (status 200)
				if (data.message) {
					// Our API route now always returns a 'message' field with the formatted text
					botResponseText = data.message;
				}
			} else {
				// If the API call returned an error status (e.g., 400, 500)
				botResponseText =
					data.message || 'An error occurred with the chatbot.';
				console.error('API Error:', data);
			}

			// 4. Add the bot's response to the chat display
			const newBotMessage: Message = {
				text: botResponseText,
				sender: 'bot',
			};
			setMessages((prevMessages) => [...prevMessages, newBotMessage]);
		} catch (error) {
			// Catch any network errors or other unexpected issues
			console.error('Frontend error sending message:', error);
			setMessages((prevMessages) => [
				...prevMessages,
				{
					text: 'An unexpected error occurred. Please try again later.',
					sender: 'bot',
				},
			]);
		} finally {
			setLoading(false); // Hide loading indicator
		}
	};

	// Handle Enter key press in the input field
	const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter' && !loading) {
			// Only send if not already loading
			sendMessage();
		}
	};

	return (
		<SidebarLayout>
			<div className='flex flex-col h-screen max-w-2xl mx-auto p-4 bg-gray-50 font-sans'>
				<h1 className='text-3xl font-extrabold text-center text-blue-700 mb-6'>
					Hall Chat Assistant
				</h1>

				{/* Chat messages display area */}
				<div className='flex-1 overflow-y-auto border border-gray-300 bg-white p-4 rounded-lg shadow-inner mb-4 flex flex-col space-y-3'>
					{messages.length === 0 && (
						<p className='text-center text-gray-500 italic'>
							Type a message to start the conversation!
						</p>
					)}
					{messages.map((msg, index) => (
						<div
							key={index}
							className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
						>
							<span
								className={`inline-block max-w-[70%] p-3 rounded-xl shadow-md ${
									msg.sender === 'user'
										? 'bg-blue-500 text-white rounded-br-none'
										: 'bg-gray-200 text-gray-800 rounded-bl-none'
								}`}
							>
								{msg.text}
							</span>
						</div>
					))}
					{loading && (
						<div className='flex justify-start'>
							<span className='inline-block p-3 rounded-xl bg-gray-200 text-gray-600 animate-pulse'>
								Bot is typing...
							</span>
						</div>
					)}
					{/* Empty div for auto-scrolling */}
					<div ref={messagesEndRef} />
				</div>

				{/* Input field and send button */}
				<div className='flex bg-white border border-gray-300 rounded-lg shadow-md p-2'>
					<input
						type='text'
						value={input}
						onChange={(e) => setInput(e.target.value)}
						onKeyPress={handleKeyPress}
						className='flex-1 p-3 text-lg border-none focus:ring-0 focus:outline-none placeholder-gray-400'
						placeholder="e.g., 'What halls are available?' or 'Find events on 2025-07-12'"
						disabled={loading} // Disable input while loading
					/>
					<button
						onClick={sendMessage}
						className='ml-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed'
						disabled={loading} // Disable button while loading
					>
						Send
					</button>
				</div>
			</div>
		</SidebarLayout>
	);
}

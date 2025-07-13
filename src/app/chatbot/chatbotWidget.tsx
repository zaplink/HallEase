// components/ChatbotWidget.tsx

'use client';

import { useRouter } from 'next/navigation';
import { Library } from 'lucide-react'; // or use your own icon

export default function ChatbotWidget() {
	const router = useRouter();

	const handleClick = () => {
		router.push('/chatbot');
	};

	return (
		<button
			onClick={handleClick}
			aria-label='Open Chatbot'
			className='fixed bottom-6 right-6 z-50 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 ease-in-out'
		>
			<Library className='w-6 h-6' />
		</button>
	);
}

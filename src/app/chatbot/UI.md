```typescript
// pages/chatbot.tsx (or app/chatbot/page.tsx with 'use client')
'use client'; // Required for client-side interactivity in App Router

import React, { useState } from 'react';

interface Message {
  text: string;
  sender: 'user' | 'bot';
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

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

      let botResponseText = "Sorry, I couldn't process that. Please try again.";
      if (response.ok) {
        if (data.data) {
          // This is where you'd format the database data into a readable string
          // For now, just stringify it. In a real app, you'd process `data.data`
          // and generate a friendly response.
          botResponseText = `Here's what I found: ${JSON.stringify(data.data, null, 2)}`;
        } else if (data.message) {
          botResponseText = data.message;
        }
      } else {
        botResponseText = data.message || 'An error occurred with the chatbot.';
      }

      const newBotMessage: Message = { text: botResponseText, sender: 'bot' };
      setMessages((prevMessages) => [...prevMessages, newBotMessage]);

    } catch (error) {
      console.error('Frontend error sending message:', error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: 'An unexpected error occurred. Please try again later.', sender: 'bot' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Hall Management Chatbot</h1>
      <div className="flex-1 overflow-y-auto border p-4 rounded-md mb-4">
        {messages.map((msg, index) => (
          <div key={index} className={`mb-2 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
            <span className={`inline-block p-2 rounded-lg ${msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
              {msg.text}
            </span>
          </div>
        ))}
        {loading && <div className="text-center text-gray-500">Bot is typing...</div>}
      </div>
      <div className="flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1 border rounded-l-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Ask me about halls, bookings, courses..."
          disabled={loading}
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-r-md disabled:opacity-50"
          disabled={loading}
        >
          Send
        </button>
      </div>
    </div>
  );
}
```

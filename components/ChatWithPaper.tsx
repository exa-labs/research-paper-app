// components/ChatWithPaper.tsx
'use client';

import { useChat } from 'ai/react';
import { Button } from './ui/button';
import { Home, Send } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ChatWithPaperProps {
  paperContext: {
    summary: string;
    title: string;
  };
}

export default function ChatWithPaper({ paperContext }: ChatWithPaperProps) {
  const router = useRouter();
  
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    initialMessages: [
      {
        id: '1',
        role: 'system',
        content: `You are an AI assistant helping with the research paper titled: "${paperContext.title}". 
                 Paper summary: ${paperContext.summary}
                 Please provide accurate and helpful responses based on this paper's content.`
      }
    ],
  });

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm p-4 flex items-center">
        <Button 
          variant="ghost" 
          onClick={() => router.push('/')}
          className="mr-4"
        >
          <Home className="w-5 h-5" />
        </Button>
        <h1 className="text-xl font-semibold">Chat</h1>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${
              m.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-4 ${
                m.role === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white shadow-md'
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}
      </div>

      {/* Input Form */}
      <form
        onSubmit={handleSubmit}
        className="border-t bg-white p-4"
      >
        <div className="flex gap-4">
          <input
            value={input}
            onChange={handleInputChange}
            placeholder="Ask something about the paper..."
            className="flex-1 rounded-lg border border-gray-200 p-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Button type="submit">
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </form>
    </div>
  );
}
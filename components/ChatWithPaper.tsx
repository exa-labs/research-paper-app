// components/ChatWithPaper.tsx
'use client';
import { useChat } from 'ai/react';
import { Button } from './ui/button';
import { Home, Send } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

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
                  Please provide accurate and helpful responses based on this paper's content.
                  Use simple English. Give short answers.`
      }
    ],
  });

  return (
    <div className="relative min-h-screen bg-[var(--secondary-default)]">
      {/* Header */}
      <div className="border-b border-[var(--secondary-darker)] bg-[var(--secondary-faint)] pr-4 py-6 sm:px-6">
        <div className="mx-auto max-w-5xl flex flex-col">
          <div className="flex items-start">
            <Button 
              variant="ghost" 
              onClick={() => router.push('/')}
              className="mr-1 md:mr-3 hover:bg-[var(--secondary-darker)] transition-colors"
            >
              <Home className="h-10 w-10" />
            </Button>
            <div>
                <h1 className="text-lg font-semibold mb-2">Chat with Paper</h1>
                <h2 className="text-md text-gray-600 font-medium">
                {paperContext.title}
                </h2>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Messages Container */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6 pb-32">
        <div className="space-y-6 py-8">
          {messages.slice(1).map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-3xl px-6 py-4 rounded-none ${
                  message.role === 'user'
                    ? 'bg-[var(--brand-default)] text-white'
                    : 'bg-[var(--secondary-darker)]'
                }`}
              >
                {message.content}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Fixed Input Form */}
      <div className="fixed bottom-0 left-0 right-0 bg-[var(--secondary-faint)] border-t border-[var(--secondary-darker)]">
        <form 
          onSubmit={handleSubmit}
          className="mx-auto max-w-5xl px-4 sm:px-6 py-4"
        >
          <div className="flex space-x-4">
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              placeholder="Ask something about the paper..."
              className="flex-1 h-12 px-4 bg-white border border-[var(--secondary-darker)] focus:outline-none focus:border-[var(--brand-default)] transition-colors"
            />
            <Button 
              type="submit"
              className="h-12 px-6 bg-[var(--brand-default)] hover:bg-[var(--brand-dark)] text-white rounded-none transition-colors"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
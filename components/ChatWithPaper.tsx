// components/ChatWithPaper.tsx
'use client';
import { useChat } from 'ai/react';
import { Button } from './ui/button';
import { Home, Send } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface PaperContext {
  summary: string;
  title: string;
}

interface ChatWithPaperProps {
  paperContexts: PaperContext[];
}

export default function ChatWithPaper({ paperContexts }: ChatWithPaperProps) {
  const router = useRouter();
  const suggestedQuestions = [
    "Explain this paper simply",
    "What are the main findings?",
    "What problem does this paper solve?",
    "What are the key contributions?",
  ];

  const createSystemMessage = (papers: PaperContext[]) => {
    if (papers.length === 1) {
      return `You are an AI assistant helping with the research paper titled: "${papers[0].title}". Paper summary: ${papers[0].summary} Please provide accurate and helpful responses based on this paper's content. Use simple English. Give short answers.`;
    }

    const papersContext = papers.map((paper, index) => 
      `Paper ${index + 1}: "${paper.title}"\nSummary: ${paper.summary}`
    ).join('\n\n');

    return `You are an AI assistant helping with multiple research papers:\n\n${papersContext}\n\nPlease provide accurate and helpful responses based on these papers' content. You can compare and contrast between papers when relevant. Use simple English. Give short answers.`;
  };

  const { messages, input, handleInputChange, handleSubmit, append } = useChat({
    initialMessages: [
      {
        id: '1',
        role: 'system',
        content: createSystemMessage(paperContexts)
      }
    ],
  });

  const handleQuestionClick = (question: string) => {
    append({
      content: question,
      role: 'user',
    });
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="border-b p-4">
        <div className="max-w-4xl mx-auto w-full flex flex-col gap-2">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push('/')}
              className="mr-1 md:mr-3 hover:bg-[var(--secondary-darker)] transition-colors"
            >
              <Home className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-semibold">Chat with Papers</h1>
              <p className="text-sm text-gray-500">
                {paperContexts.map(p => p.title).join('  •  ')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Messages Container */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto w-full">
          {messages.length <= 1 && (
            <div className="mb-8 mt-6">
              <h2 className="text-lg font-medium mb-4 text-center">
                Suggested Questions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {suggestedQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuestionClick(question)}
                    className="p-4 text-left rounded-lg border border-gray-200 hover:border-secondary-accent2x hover:bg-secondary-darker transition-colors duration-200 hover:shadow-sm"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          <div className="space-y-6">
            {messages.slice(1).map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`rounded-lg px-4 py-3 max-w-[85%] ${
                    message.role === 'user'
                      ? 'bg-secondary-darker text-black'
                      : 'bg-secondary-fainter text-gray-900'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Fixed Input Form */}
      <div className="border-t p-4">
        <form
          onSubmit={handleSubmit}
          className="max-w-4xl mx-auto w-full flex gap-2"
        >
          <input
            value={input}
            onChange={handleInputChange}
            placeholder="Ask something about the paper..."
            className="flex-1 rounded-lg border border-gray-200 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Button type="submit" className="h-auto">
            <Send className="h-5 w-5" />
          </Button>
        </form>
      </div>
      
    </div>
  );
}
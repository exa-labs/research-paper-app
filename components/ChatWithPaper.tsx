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



// 'use client';
// import { useChat } from 'ai/react';
// import { Button } from './ui/button';
// import { Home, Send } from 'lucide-react';
// import { useRouter } from 'next/navigation';
// import { motion } from 'framer-motion';

// interface ChatWithPaperProps {
//   paperContext: {
//     summary: string;
//     title: string;
//   };
// }

// export default function ChatWithPaper({ paperContext }: ChatWithPaperProps) {
//   const router = useRouter();

//   const { messages, input, handleInputChange, handleSubmit } = useChat({
//     initialMessages: [
//       {
//         id: '1',
//         role: 'system',
//         content: `You are an AI assistant helping with the research paper titled: "${paperContext.title}". 
//                  Paper summary: ${paperContext.summary}
//                  Please provide accurate and helpful responses based on this paper's content.`
//       }
//     ],
//   });

//   return (
//     <div className="flex flex-col h-screen bg-[var(--secondary-default)]">
//       {/* Header - Reduced height */}
//       <div className="border-b border-[var(--secondary-darker)] bg-[var(--secondary-fainter)] py-3 px-4 sm:px-6">
//         <div className="max-w-4xl mx-auto flex flex-col">
//           <div className="flex items-center mb-1">
//             <Button
//               variant="ghost"
//               size="icon"
//               onClick={() => router.push('/')}
//               className="mr-4 hover:bg-[var(--secondary-darker)] transition-colors"
//             >
//               <Home className="h-6 w-6" />
//             </Button>
//             <h1 className="text-xl font-medium">Chat with Paper</h1>
//           </div>
//           <p className="text-sm text-[var(--secondary-accent)] ml-14">
//             {paperContext.title}
//           </p>
//         </div>
//       </div>

//       {/* Chat Messages Container */}
//       <div className="flex-1 overflow-y-auto">
//         <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-32">
//           {messages.slice(1).map((message) => (
//             <motion.div
//               key={message.id}
//               initial={{ opacity: 0, y: 10 }}
//               animate={{ opacity: 1, y: 0 }}
//               className={`py-4 ${
//                 message.role === 'user'
//                   ? 'bg-[var(--secondary-darker)] rounded-none'
//                   : ''
//               }`}
//             >
//               <div className="max-w-4xl mx-auto">
//                 {message.content}
//               </div>
//             </motion.div>
//           ))}
//         </div>
//       </div>

//       {/* Fixed Input Form */}
//       <div className="fixed bottom-0 left-0 right-0 bg-[var(--secondary-fainter)] border-t border-[var(--secondary-darker)]">
//         <div className="max-w-4xl mx-auto p-4">
//           <form onSubmit={handleSubmit} className="flex gap-2">
//             <input
//               value={input}
//               onChange={handleInputChange}
//               placeholder="Ask something about the paper..."
//               className="flex-1 h-12 px-4 bg-white border border-[var(--secondary-darker)] focus:outline-none focus:border-[var(--secondary-accent)] transition-colors"
//             />
//             <Button 
//               type="submit"
//               className="h-12 px-6 bg-[var(--secondary-accent)] hover:bg-[var(--secondary-accent2x)] text-white rounded-none transition-colors"
//             >
//               <Send className="h-5 w-5" />
//             </Button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }

// *   make it so that the inital message which is set for the llm, isnt visible to the user
    
// *   the brand-default which is used for the messsages of the user, it is kinda too bright, either use a less bold color (from the exisitng colors given)
    
// *   the top where the "chat with paper" and the title is written is too big, make it a little less in hieght (but make sure it still looks good)
    
// *   dont use any blue type color for the title of the paper, use normal color (can be muted too)
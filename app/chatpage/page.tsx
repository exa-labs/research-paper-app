// app/chatpage/page.tsx
'use client';

import { useState, useEffect } from "react";
import ChatWithPaper from '@/components/ChatWithPaper';

export default function ChatWithPaperPage() {
    const [paperContext, setPaperContext] = useState(null);

    useEffect(() => {
      try {
        const params = new URLSearchParams(window.location.search);
        const paperParam = params.get("paper");
  
        if (paperParam) {
          // Decode the base64 string back to JSON
          const decodedData = atob(paperParam);
          const parsedData = JSON.parse(decodedData);
          setPaperContext(parsedData);
        }
      } catch (error) {
        console.error("Error parsing paper context:", error);
      }
    }, []);

  if (!paperContext) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600">No paper context provided or invalid data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screens">
      <ChatWithPaper paperContext={paperContext} />
    </div>
  );
}
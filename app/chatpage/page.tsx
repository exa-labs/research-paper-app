// app/chatpage/page.tsx
'use client';
import { useState, useEffect } from "react";
import ChatWithPaper from '@/components/ChatWithPaper';

interface PaperContext {
  title: string;
  summary: string;
}

export default function ChatWithPaperPage() {
  const [paperContexts, setPaperContexts] = useState<PaperContext[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      // Check for both single paper and multiple papers
      const singlePaper = params.get("paper");
      const multiplePapers = params.get("papers");

      if (singlePaper) {
        const decodedData = atob(singlePaper);
        const parsedData = JSON.parse(decodedData);
        setPaperContexts([parsedData]);
      } else if (multiplePapers) {
        const decodedData = atob(multiplePapers);
        const parsedData = JSON.parse(decodedData);
        setPaperContexts(parsedData);
      }
    } catch (error) {
      console.error("Error parsing paper context:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (!paperContexts.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-xl font-bold mb-2">Error</h1>
        <p>No paper context provided or invalid data</p>
      </div>
    );
  }

  return <ChatWithPaper paperContexts={paperContexts} />;
}
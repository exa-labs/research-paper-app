// components/PaperDialog.tsx
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogOverlay,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar, MessageSquare, BookOpen, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface ResearchPaper {
    title: string;
    text: string;
    author: string;
    publishedDate: string;
    summary: string;
    url: string;
}

interface PaperDialogProps {
  paper: ResearchPaper;
  isOpen: boolean;
  onClose: () => void;
}

export function PaperDialog({ paper, isOpen, onClose }: PaperDialogProps) {
    
    const router = useRouter();

    useEffect(() => {
        router.prefetch(`/similar`);
        router.prefetch(`/chatpage`);
    }, [router]);

    const handleSeeSimilar = () => {
        const queryParam = encodeURIComponent(paper.url);
        const url = `/similar?query=${queryParam}`;
        router.push(url);
    };

    const handleChatWithPaper = () => {
        const paperData = {
            summary: paper.summary || '',
            title: paper.title || ''
        };
        
        const encodedData = btoa(JSON.stringify(paperData));
        router.push(`/chatpage?paper=${encodedData}`);
    };

    const formattedDate = paper.publishedDate 
        ? new Date(paper.publishedDate).getFullYear() 
        : null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogOverlay />
    
      <DialogContent className="w-[90%] md:w-[80%] max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-none p-7">
        <DialogHeader className="space-y-6">
          {/* Title */}
          <DialogTitle className="text-2xl md:text-3xl font-bold leading-tight text-left">
            {paper.title}
          </DialogTitle>

          {/* Authors & Date */}
          <div className="space-y-3">
            {paper.author && (
              <div className="text-md text-gray-700 dark:text-gray-300 text-left">
                {paper.author}
              </div>
            )}
            {formattedDate && (
              <div className="flex items-center justify-start gap-2 text-gray-600 dark:text-gray-400">
                <Calendar className="h-4 w-4" />
                <span>{formattedDate}</span>
              </div>
            )}
          </div>
        </DialogHeader>

        {/* Main Content */}
        <div className="mt-4 space-y-8">
          {/* Action Buttons */}
          <div className="flex flex-col md:flex-row gap-4 pb-2">
            <Button
              className="flex items-center gap-2 hover:bg-secondary-accent2x md:px-6"
              onClick={() => window.open(paper.url, '_blank')}
            >
              <BookOpen className="h-4 w-4" />
              Read Paper
            </Button>
            <Button
              variant="outline"
              className="flex items-center border-gray-300 gap-2 hover:bg-secondary-darkest md:px-6"
              onClick={handleChatWithPaper}
            >
              <MessageSquare className="h-4 w-4" />
              Chat with Paper
            </Button>
            <Button
              variant="outline"
              className="flex items-center border-gray-300 gap-2 hover:bg-secondary-darkest md:px-6"
              onClick={handleSeeSimilar}
            >
              <Search className="h-4 w-4" />
              See Similar Papers
            </Button>
          </div>

          {/* Summary Section */}
          {paper.summary && (
            <div className="space-y-3">
              <h3 className="text-xl font-semibold">Summary</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {paper.summary}
              </p>
            </div>
          )}

          {/* Abstract Section */}
          {paper.text && (
            <div className="space-y-3">
              <h3 className="text-xl font-semibold">Abstract</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {paper.text}
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
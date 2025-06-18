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
import { getAssetPath } from "@/app/utils";

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

// Function to clean and extract meaningful content from the text
const cleanAbstractText = (text: string): string => {
  if (!text) return "";
  
  // Remove navigation elements and common webpage content
  let cleaned = text
    .replace(/\[Skip to main content\][^)]*\)/gi, '')
    .replace(/Official websites use \.gov[^)]*\)/gi, '')
    .replace(/Secure \.gov websites use HTTPS[^)]*\)/gi, '')
    .replace(/Search PMC[^)]*\)/gi, '')
    .replace(/Advanced Search[^)]*\)/gi, '')
    .replace(/Journal List[^)]*\)/gi, '')
    .replace(/User Guide[^)]*\)/gi, '')
    .replace(/PERMALINK[^)]*\)/gi, '')
    .replace(/PMC Disclaimer[^)]*\)/gi, '')
    .replace(/PMC Copyright Notice[^)]*\)/gi, '')
    .replace(/Find articles by[^)]*\)/gi, '')
    .replace(/Author information[^)]*\)/gi, '')
    .replace(/Article notes[^)]*\)/gi, '')
    .replace(/Copyright and License information[^)]*\)/gi, '')
    .replace(/PMCID:[^)]*\)/gi, '')
    .replace(/https?:\/\/[^\s)]+/gi, '') // Remove URLs
    .replace(/\([^)]*\)/gi, '') // Remove content in parentheses
    .replace(/\[[^\]]*\]/gi, '') // Remove content in brackets
    .replace(/!\[[^\]]*\]/gi, '') // Remove image markdown
    .replace(/#{1,6}\s*/gi, '') // Remove markdown headers
    .replace(/\*{1,2}([^*]+)\*{1,2}/gi, '$1') // Remove bold/italic markdown
    .replace(/_{1,2}([^_]+)_{1,2}/gi, '$1') // Remove underscore formatting
    .replace(/\n{3,}/gi, '\n\n') // Replace multiple newlines with double newlines
    .replace(/\s{2,}/gi, ' ') // Replace multiple spaces with single space
    .trim();

  // Try to find the abstract section specifically
  const abstractMatch = cleaned.match(/abstract\s*:?\s*([\s\S]*?)(?:keywords|highlights|introduction|methods|results|conclusion|references|$)/i);
  if (abstractMatch && abstractMatch[1]) {
    cleaned = abstractMatch[1].trim();
  }

  // If still too long or contains navigation elements, try to find the most relevant paragraph
  if (cleaned.length > 2000 || cleaned.includes('NLM provides access')) {
    const sentences = cleaned.split(/[.!?]+/).filter(s => s.trim().length > 50);
    const relevantSentences = sentences.filter(s => 
      !s.includes('website') && 
      !s.includes('database') && 
      !s.includes('PMC') &&
      !s.includes('search') &&
      !s.includes('navigation') &&
      s.length > 50
    );
    
    if (relevantSentences.length > 0) {
      cleaned = relevantSentences.slice(0, 5).join('. ') + '.';
    }
  }

  return cleaned;
};

// Function to format text as markdown
const formatAsMarkdown = (text: string): string => {
  if (!text) return "";
  
  // Split into paragraphs and format
  const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);
  
  return paragraphs.map(paragraph => {
    const trimmed = paragraph.trim();
    
    // If it looks like a title or heading, make it bold
    if (trimmed.length < 100 && !trimmed.includes('.')) {
      return `**${trimmed}**`;
    }
    
    return trimmed;
  }).join('\n\n');
};

export function PaperDialog({ paper, isOpen, onClose }: PaperDialogProps) {

    const handleSeeSimilar = () => {
        const queryParam = encodeURIComponent(paper.url);
        const url = getAssetPath(`/similar?query=${queryParam}`);
        window.open(url, "_blank");
    };

    const handleChatWithPaper = () => {
        const paperData = {
            summary: paper.summary || '',
            title: paper.title || ''
        };
        
        const encodedData = btoa(JSON.stringify(paperData));
        const url = getAssetPath(`/chatpage?paper=${encodedData}`);
        window.open(url, "_blank");
    };

    const formattedDate = paper.publishedDate 
        ? new Date(paper.publishedDate).getFullYear() 
        : null;

    // Clean and format the abstract text
    const cleanedAbstract = cleanAbstractText(paper.text);
    const markdownAbstract = formatAsMarkdown(cleanedAbstract);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogOverlay />
    
      <DialogContent className="w-[98%] sm:w-[95%] md:w-[90%] lg:w-[85%] max-w-5xl max-h-[95vh] overflow-hidden bg-white rounded-lg p-0">
        <div className="flex flex-col h-full max-h-[95vh]">
          <DialogHeader className="flex-shrink-0 p-6 pb-4 space-y-4">
            {/* Title */}
            <DialogTitle className="text-xl sm:text-2xl md:text-3xl font-bold leading-tight text-left break-words hyphens-auto">
              {paper.title}
            </DialogTitle>

            {/* Authors & Date */}
            <div className="space-y-3">
              {paper.author && (
                <div className="text-sm md:text-base text-gray-700 dark:text-gray-300 text-left break-words">
                  {paper.author}
                </div>
              )}
              {formattedDate && (
                <div className="flex items-center justify-start gap-2 text-gray-600 dark:text-gray-400">
                  <Calendar className="h-4 w-4 flex-shrink-0" />
                  <span>{formattedDate}</span>
                </div>
              )}
            </div>
          </DialogHeader>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-6 pb-6">
            <div className="space-y-6">
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button
                  className="flex items-center justify-center gap-2 hover:bg-secondary-accent2x text-sm px-4 py-2"
                  onClick={() => window.open(paper.url, '_blank')}
                >
                  <BookOpen className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">Read Paper</span>
                </Button>
                <Button
                  variant="outline"
                  className="flex items-center justify-center border-gray-300 gap-2 hover:bg-secondary-darkest text-sm px-4 py-2"
                  onClick={handleChatWithPaper}
                >
                  <MessageSquare className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">Chat with Paper</span>
                </Button>
                <Button
                  variant="outline"
                  className="flex items-center justify-center border-gray-300 gap-2 hover:bg-secondary-darkest text-sm px-4 py-2"
                  onClick={handleSeeSimilar}
                >
                  <Search className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">See Similar Papers</span>
                </Button>
              </div>

              {/* Summary Section */}
              {paper.summary && (
                <div className="space-y-3">
                  <h3 className="text-lg md:text-xl font-semibold">Summary</h3>
                  <div className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm md:text-base break-words whitespace-pre-wrap">
                    {paper.summary}
                  </div>
                </div>
              )}

              {/* Abstract Section */}
              {markdownAbstract && (
                <div className="space-y-3">
                  <h3 className="text-lg md:text-xl font-semibold">Abstract</h3>
                  <div className="prose prose-sm md:prose-base max-w-none text-gray-700 dark:text-gray-300 leading-relaxed break-words">
                    <div className="whitespace-pre-wrap" dangerouslySetInnerHTML={{
                      __html: markdownAbstract
                        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                        .replace(/\*(.*?)\*/g, '<em>$1</em>')
                        .replace(/\n\n/g, '</p><p>')
                        .replace(/^(.*)$/, '<p>$1</p>')
                    }} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
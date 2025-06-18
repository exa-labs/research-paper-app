"use client";
import { useState, useEffect } from "react";
import { MessageSquare } from "lucide-react";

interface AnswerBoxProps {
  answer: string;
  isLoading: boolean;
  citations: any[];
  error?: string | null;
}

export default function AnswerBox({ answer, isLoading, citations, error }: AnswerBoxProps) {
  const [displayedAnswer, setDisplayedAnswer] = useState("");
  const [answerType, setAnswerType] = useState<'yes' | 'no' | 'neutral'>('neutral');

  useEffect(() => {
    if (answer) {
      setDisplayedAnswer(answer);
      
      // More robust detection - check if answer starts with YES or NO (case insensitive)
      const cleanAnswer = answer.trim().toLowerCase();
      console.log('Checking answer:', cleanAnswer.substring(0, 50));
      
      if (cleanAnswer.startsWith('yes')) {
        console.log('Setting answer type to YES');
        setAnswerType('yes');
      } else if (cleanAnswer.startsWith('no')) {
        console.log('Setting answer type to NO');
        setAnswerType('no');
      } else {
        console.log('Setting answer type to neutral, answer starts with:', cleanAnswer.substring(0, 10));
        setAnswerType('neutral');
      }
    }
  }, [answer]);

  // Simple markdown renderer for basic formatting
  const renderMarkdown = (text: string) => {
    const lines = text.split('\n');
    const elements: JSX.Element[] = [];
    
    lines.forEach((line, lineIndex) => {
      if (line.trim() === '') {
        elements.push(<br key={`br-${lineIndex}`} />);
        return;
      }

      // Handle bullet points
      if (line.trim().startsWith('*   ') || line.trim().startsWith('* ')) {
        const bulletContent = line.replace(/^\s*\*\s+/, '');
        elements.push(
          <div key={lineIndex} className="flex items-start gap-2 mb-2">
            <span className="text-gray-400 mt-1">•</span>
            <span>{renderInlineMarkdown(bulletContent)}</span>
          </div>
        );
        return;
      }

      // Handle headers (if any)
      if (line.startsWith('**') && line.endsWith('**') && line.indexOf('**', 2) === line.length - 2) {
        const headerText = line.replace(/\*\*/g, '');
        elements.push(
          <h4 key={lineIndex} className="font-semibold text-gray-800 mt-4 mb-2">
            {headerText}
          </h4>
        );
        return;
      }

      // Regular paragraphs
      elements.push(
        <p key={lineIndex} className="mb-3 leading-relaxed">
          {renderInlineMarkdown(line)}
        </p>
      );
    });

    return elements;
  };

  // Render inline markdown (bold text, links)
  const renderInlineMarkdown = (text: string) => {
    const parts: (string | JSX.Element)[] = [];
    let currentIndex = 0;

    // First handle links [text](url)
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    let linkMatch;
    
    while ((linkMatch = linkRegex.exec(text)) !== null) {
      // Add text before link
      if (linkMatch.index > currentIndex) {
        const beforeText = text.slice(currentIndex, linkMatch.index);
        parts.push(...processBoldText(beforeText));
      }
      
      // Add link
      parts.push(
        <a
          key={`link-${linkMatch.index}`}
          href={linkMatch[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
        >
          {linkMatch[1]}
        </a>
      );
      
      currentIndex = linkRegex.lastIndex;
    }
    
    // Add remaining text
    if (currentIndex < text.length) {
      const remainingText = text.slice(currentIndex);
      parts.push(...processBoldText(remainingText));
    }
    
    return parts.length > 0 ? parts : processBoldText(text);
  };

  // Process bold text **text**
  const processBoldText = (text: string): (string | JSX.Element)[] => {
    const parts: (string | JSX.Element)[] = [];
    const boldRegex = /\*\*([^*]+)\*\*/g;
    let lastIndex = 0;
    let match;

    while ((match = boldRegex.exec(text)) !== null) {
      // Add text before bold
      if (match.index > lastIndex) {
        parts.push(text.slice(lastIndex, match.index));
      }
      
      // Add bold text
      parts.push(
        <strong key={`bold-${match.index}`} className="font-semibold text-gray-800">
          {match[1]}
        </strong>
      );
      
      lastIndex = boldRegex.lastIndex;
    }
    
    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }
    
    return parts.length > 0 ? parts : [text];
  };

  const getStatusIndicator = () => {
    console.log('Current answerType:', answerType, 'isLoading:', isLoading);
    
    if (isLoading) {
      return <div className="w-3 h-3 bg-gray-400 rounded-full flex-shrink-0 mt-1"></div>;
    }
    
    switch (answerType) {
      case 'yes':
        return <div className="w-3 h-3 bg-green-500 rounded-full flex-shrink-0 mt-1"></div>;
      case 'no':
        return <div className="w-3 h-3 bg-red-500 rounded-full flex-shrink-0 mt-1"></div>;
      default:
        return <div className="w-3 h-3 bg-gray-400 rounded-full flex-shrink-0 mt-1"></div>;
    }
  };

  if (error) {
    return (
      <div className="w-full mb-6 p-6 bg-red-50 border border-red-200 rounded-sm">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-red-500 rounded-full flex-shrink-0"></div>
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (!isLoading && !answer) {
    return null;
  }

  return (
    <div className="w-full mb-6 p-6 bg-secondary-faint hover:bg-secondary-fainter border rounded-sm shadow-none transition-all duration-300 opacity-0 animate-fade-up [animation-delay:500ms]">
      <div className="flex items-start gap-4">
        {getStatusIndicator()}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Answer
          </h3>
          
          {isLoading && !displayedAnswer && (
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3"></div>
            </div>
          )}
          
          {displayedAnswer && (
            <div className="text-gray-700 text-base">
              {renderMarkdown(displayedAnswer)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 
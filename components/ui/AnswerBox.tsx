"use client";
import { useState, useEffect } from "react";
import { CheckCircle, XCircle, Loader2, MessageSquare } from "lucide-react";

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
      
      // Determine answer type based on first word
      const firstWord = answer.trim().split(' ')[0].toLowerCase();
      if (firstWord === 'yes') {
        setAnswerType('yes');
      } else if (firstWord === 'no') {
        setAnswerType('no');
      } else {
        setAnswerType('neutral');
      }
    }
  }, [answer]);

  // Function to render text with clickable links
  const renderTextWithLinks = (text: string) => {
    // Regex to match markdown-style links [text](url)
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = linkRegex.exec(text)) !== null) {
      // Add text before the link
      if (match.index > lastIndex) {
        parts.push(text.slice(lastIndex, match.index));
      }
      
      // Add the link
      parts.push(
        <a
          key={`link-${match.index}`}
          href={match[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
        >
          {match[1]}
        </a>
      );
      
      lastIndex = linkRegex.lastIndex;
    }
    
    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }
    
    return parts.length > 0 ? parts : text;
  };

  if (error) {
    return (
      <div className="w-full mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex items-center gap-3">
          <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (!isLoading && !answer) {
    return null;
  }

  const getStatusIcon = () => {
    if (isLoading) {
      return <Loader2 className="w-5 h-5 text-blue-500 animate-spin flex-shrink-0" />;
    }
    
    switch (answerType) {
      case 'yes':
        return <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />;
      case 'no':
        return <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />;
      default:
        return <MessageSquare className="w-5 h-5 text-blue-500 flex-shrink-0" />;
    }
  };

  const getBorderColor = () => {
    if (isLoading) return 'border-blue-200';
    
    switch (answerType) {
      case 'yes':
        return 'border-green-200';
      case 'no':
        return 'border-red-200';
      default:
        return 'border-gray-200';
    }
  };

  const getBackgroundColor = () => {
    if (isLoading) return 'bg-blue-50';
    
    switch (answerType) {
      case 'yes':
        return 'bg-green-50';
      case 'no':
        return 'bg-red-50';
      default:
        return 'bg-gray-50';
    }
  };

  return (
    <div className={`w-full mb-6 p-6 ${getBackgroundColor()} border ${getBorderColor()} rounded-lg shadow-sm opacity-0 animate-fade-up [animation-delay:500ms]`}>
      <div className="flex items-start gap-4">
        {getStatusIcon()}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            {isLoading ? 'Generating answer...' : 'AI Answer'}
          </h3>
          
          {isLoading && !displayedAnswer && (
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3"></div>
            </div>
          )}
          
          {displayedAnswer && (
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-800 leading-relaxed text-base">
                {renderTextWithLinks(displayedAnswer)}
              </p>
            </div>
          )}
          
          {citations && citations.length > 0 && !isLoading && (
            <div className="mt-6 pt-4 border-t border-gray-300">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Sources:</h4>
              <div className="grid gap-2">
                {citations.slice(0, 4).map((citation, index) => (
                  <a
                    key={index}
                    href={citation.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-2 bg-white rounded border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
                  >
                    <div className="text-sm font-medium text-blue-700 hover:text-blue-900 line-clamp-1">
                      {citation.title}
                    </div>
                    {citation.snippet && (
                      <div className="text-xs text-gray-600 mt-1 line-clamp-2">
                        {citation.snippet}
                      </div>
                    )}
                  </a>
                ))}
                {citations.length > 4 && (
                  <p className="text-sm text-gray-500 mt-2">
                    +{citations.length - 4} more sources
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 
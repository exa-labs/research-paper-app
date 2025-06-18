// ResearchPaperFinder.tsx
"use client";
import { useState, FormEvent, useEffect } from "react";
import { CardResearchPaper } from "./CardResearchPaper";
import ResultsLoadingSkeleton from "./ui/ResultsLoadingSkeleton";
import AnswerBox from "./ui/AnswerBox";
import Link from "next/link";
import SearchSuggestions from "./ui/SearchSuggestion";
import AnimatedGradientText from "./ui/animated-gradient-text";
import { ChevronRight } from "lucide-react";
import { getAssetPath } from "@/app/utils";

export default function ResearchPaperFinder() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Answer state
  const [answer, setAnswer] = useState('');
  const [answerCitations, setAnswerCitations] = useState<any[]>([]);
  const [isAnswerLoading, setIsAnswerLoading] = useState(false);
  const [answerError, setAnswerError] = useState<string | null>(null);

  const [selectedPapers, setSelectedPapers] = useState<any[]>([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);

  // multi-paper chat
  const handleMultiPaperChat = () => {
    if (selectedPapers.length === 0) return;
    
    const papersData = selectedPapers.map(paper => ({
      summary: paper.summary || '',
      title: paper.title || ''
    }));
    
    const encodedData = btoa(JSON.stringify(papersData));
    window.open(getAssetPath(`/chatpage?papers=${encodedData}`), "_blank");
  };

  // Handle streaming answer from answer endpoint
  const handleAnswerStream = async (query: string) => {
    setIsAnswerLoading(true);
    setAnswer('');
    setAnswerCitations([]);
    setAnswerError(null);

    try {
      const response = await fetch(getAssetPath('/api/answer'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error('Failed to get answer');
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No reader available');
      }

      let accumulatedAnswer = '';
      let citations: any[] = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = new TextDecoder().decode(value);
        const lines = chunk.split('\n').filter(line => line.trim());

        for (const line of lines) {
          try {
            const data = JSON.parse(line);
            
            // Handle the correct streaming format: {"content": "..."}
            if (data.content) {
              accumulatedAnswer += data.content;
              setAnswer(accumulatedAnswer);
            } else if (data.citations) {
              citations = data.citations;
              setAnswerCitations(citations);
            }
          } catch (e) {
            // Skip invalid JSON lines
            console.log('Skipping invalid JSON:', line);
          }
        }
      }
    } catch (error) {
      console.error('Error in handleAnswerStream:', error);
      setAnswerError(error instanceof Error ? error.message : 'Failed to get answer');
    } finally {
      setIsAnswerLoading(false);
    }
  };

  // Handle search from search endpoint
  const handleSearchResults = async (query: string) => {
    try {
      const response = await fetch(getAssetPath('/api/exasearch'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch search results.');
      }

      const data = await response.json();
      setSearchResults(data.results || []);
    } catch (error) {
      console.error('Error in handleSearchResults:', error);
      setError(error instanceof Error ? error.message : 'An unexpected error occurred.');
      setSearchResults([]);
    }
  };

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery) {
      setError("Please enter a search topic to find research papers.");
      return;
    }
    
    setIsGenerating(true);
    setError(null);

    // Call both endpoints in parallel
    try {
      await Promise.all([
        handleSearchResults(searchQuery),
        handleAnswerStream(searchQuery)
      ]);
    } catch (error) {
      console.error('Error in parallel requests:', error);
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleSuggestionClick = async (query: string) => {
    setSearchQuery(query);
    setIsGenerating(true);
    setError(null);

    // Call both endpoints in parallel for the suggestion
    try {
      await Promise.all([
        handleSearchResults(query),
        handleAnswerStream(query)
      ]);
    } catch (error) {
      console.error('Error in parallel requests:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div>
    {/* Top Navigation Bar */}
    <div className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-b z-50">
      <div className="md:max-w-4xl mx-auto px-4 md:px-6 py-3 flex justify-between items-center">
        <a
          href="https://dashboard.exa.ai/playground/"
          target="_blank"
          className="flex items-center px-4 py-1.5 bg-white border-2 border-[var(--brand-default)] text-[var(--brand-default)] 
          rounded-none hover:bg-[var(--brand-default)] hover:text-white transition-all duration-200 
          font-medium shadow-sm hover:shadow-md hover:-translate-y-0.5"
        >
          <span className="text-sm">Try Exa API</span>
        </a>
        <div className="flex items-center gap-4 text-md text-gray-600">
          <a
            href="https://exa.ai/demos"
            target="_blank"
            className="hover:text-[var(--brand-default)] transition-colors"
          >
            <span className="underline">See More Demos</span>
          </a>
          <span className="text-gray-400">|</span>
          <a
            href="https://github.com/exa-labs/research-paper-app"
            target="_blank"
            className="flex items-center gap-1.5 hover:text-[var(--brand-default)] transition-colors"
          >
            <span className="underline">View Project Code</span>
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        </div>
      </div>
    </div>

    <div className="flex flex-col min-h-screen w-full md:max-w-5xl z-0">

    <main className={`flex flex-col flex-grow w-full md:max-w-5xl p-2 md:p-6 pt-20 md:pt-24 ${
      !searchQuery && !isGenerating && searchResults.length === 0 && !answer 
        ? 'justify-center' 
        : ''
    }`}>
      
      <h1 className={`md:text-4xl text-2xl mb-8 font-medium opacity-0 animate-fade-up [animation-delay:300ms] ${
        !searchQuery && !isGenerating && searchResults.length === 0 && !answer 
          ? 'mt-28 md:mt-56' 
          : 'mt-2 md:mt-2'
      }`}>
        Ask questions and get answers based on Research Papers
      </h1>

      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex gap-0">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Ask Questions"
            className="flex-1 p-3 rounded-none ring-2 ring-brand-default focus:outline-none opacity-0 animate-fade-up [animation-delay:400ms]"
          />
          <button
            type="submit"
            disabled={isGenerating}
            className="bg-brand-default text-white px-6 py-3 rounded-none ring-2 ring-brand-default hover:bg-brand-dark transition-colors disabled:opacity-50 opacity-0 animate-fade-up [animation-delay:400ms]"
          >
            {isGenerating ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>

      {/* Answer Box */}
      {(isAnswerLoading || answer || answerError) && (
        <AnswerBox
          answer={answer}
          isLoading={isAnswerLoading}
          citations={answerCitations}
          error={answerError}
        />
      )}
      
      {!isGenerating && searchResults.length === 0 && !answer && (
        <SearchSuggestions onSuggestionClick={handleSuggestionClick} />
      )}

      {error && (
        <div className="mt-2 p-2 bg-red-100 border border-red-400 text-red-700 rounded-none">
          {error}
        </div>
      )}

      {isGenerating && <ResultsLoadingSkeleton />}


      {!isGenerating && searchResults.length > 0 && (
        <>
          <h2 className="text-2xl font-normal mb-6 text-gray-800 mt-10">
            Related Research Papers
          </h2>
          <div className="space-y-4">
            
            {searchResults
              .filter(paper => paper.title && paper.title.trim() !== '')
              .map((paper, index) => (
              <CardResearchPaper
                key={index}
                paper={paper}
                animationDelay={100 + index * 100}
                isSelectionMode={isSelectionMode}
                isSelected={selectedPapers.includes(paper)}
                onSelect={(paper) => {
                  setSelectedPapers(prev => 
                    prev.includes(paper)
                      ? prev.filter(p => p !== paper)
                      : [...prev, paper]
                  );
                }}
              />
            ))}

          </div>

          {/* Show suggestions again after search results */}
          <div className="mt-12">
            <h2 className="text-xl font-normal mb-6 text-gray-800">
              Explore More Questions
            </h2>
            <SearchSuggestions onSuggestionClick={handleSuggestionClick} />
          </div>
        </>
      )}

      </main>
    </div>
    </div>
  );
}
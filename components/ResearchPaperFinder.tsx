// ResearchPaperFinder.tsx
"use client";
import { useState, FormEvent } from "react";
import { CardResearchPaper } from "./CardResearchPaper";
import ResultsLoadingSkeleton from "./ui/ResultsLoadingSkeleton";

export default function ResearchPaperFinder() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery) {
      setError("Please enter a search topic to find research papers.");
      return;
    }
    
    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch('/api/exasearch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: searchQuery }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch search results.');
      }

      const data = await response.json();
      setSearchResults(data.results || []);
    } catch (error) {
      console.error('Error in handleSearch:', error);
      setError(error instanceof Error ? error.message : 'An unexpected error occurred.');
      setSearchResults([]);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="w-full max-w-6xl md:max-w-4xl p-6 z-10">

      <h1 className="md:text-6xl text-4xl pt-6 pb-5 font-medium opacity-0 animate-fade-up [animation-delay:200ms]">
        Discover 
        <span className="text-brand-default"> Research Papers </span>
        Instantly
      </h1>

      <p className="text-black mb-12 opacity-0 animate-fade-up [animation-delay:400ms]">
        Find relevant research papers. Explore knowledge effortlessly.
      </p>

      <form onSubmit={handleSearch} className="mb-20">
        <div className="flex gap-3">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Type here to find research papers"
            className="flex-1 p-3 rounded-none ring-2 ring-brand-default focus:outline-none opacity-0 animate-fade-up [animation-delay:600ms]"
          />
          <button
            type="submit"
            disabled={isGenerating}
            className="bg-brand-default text-white px-6 py-3 rounded-none ring-2 ring-brand-default hover:bg-brand-dark transition-colors disabled:opacity-50 opacity-0 animate-fade-up [animation-delay:600ms]"
          >
            {isGenerating ? 'Searching...' : 'Search Now'}
          </button>
        </div>
      </form>

      {error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-none">
          {error}
        </div>
      )}

      {isGenerating && <ResultsLoadingSkeleton />}

      {!isGenerating && searchResults.length > 0 && (
        <div className="mt-8 space-y-8">
          {searchResults.map((paper, index) => (
            <CardResearchPaper
              key={index} 
              paper={paper} 
              animationDelay={200 + index * 200}
            />
          ))}
        </div>
      )}

    </div>
  );
}

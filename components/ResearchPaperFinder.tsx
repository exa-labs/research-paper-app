// ResearchPaperFinder.tsx
"use client";
import { useState, FormEvent } from "react";
import { CardResearchPaper } from "./CardResearchPaper";
import ResultsLoadingSkeleton from "./ui/ResultsLoadingSkeleton";
import Link from "next/link";
import AnimatedGradientText from "./ui/animated-gradient-text";
import { ChevronRight } from "lucide-react";

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
    <div className="flex flex-col min-h-screen w-full md:max-w-4xl z-0">

      {/* Badge positioned at the top */}
      <div className="w-full flex justify-center pt-6 opacity-0 animate-fade-up [animation-delay:200ms]">
        <Link href="/about" target="_blank">
          <AnimatedGradientText>
            <span className="px-2 inline animate-gradient bg-gradient-to-r from-[#254bf1] via-purple-600 to-[#254bf1] bg-[length:var(--bg-size)_100%] bg-clip-text text-transparent">
               Learn About Exa - The Search Engine for AI
            </span>
            <ChevronRight className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5 text-brand-default" />
          </AnimatedGradientText>
        </Link>
      </div>


    <main className="flex flex-col justify-center flex-grow w-full md:max-w-4xl p-2 md:p-6">

      <h1 className="md:text-4xl text-2xl pt-4 mb-8 font-medium opacity-0 animate-fade-up [animation-delay:400ms]">
        Discover
        <span className="text-brand-default"> NeurIPS </span>
        Papers 
      </h1>

      <form onSubmit={handleSearch} className="mb-14">
        <div className="flex gap-3">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Find research papers"
            className="flex-1 p-3 rounded-none ring-2 ring-brand-default focus:outline-none opacity-0 animate-fade-up [animation-delay:600ms]"
          />
          <button
            type="submit"
            disabled={isGenerating}
            className="bg-brand-default text-white px-6 py-3 rounded-none ring-2 ring-brand-default hover:bg-brand-dark transition-colors disabled:opacity-50 opacity-0 animate-fade-up [animation-delay:600ms]"
          >
            {isGenerating ? 'Searching...' : 'Search'}
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
              animationDelay={100 + index * 100}
            />
          ))}
        </div>
      )}

    </main>

      <footer className="w-full py-6 px-8 mb-6 mt-auto opacity-0 animate-fade-up [animation-delay:800ms]">
        <div className="max-w-md mx-auto">
          <p className="text-md text-center text-gray-600">
            <Link 
              href="/about"
              target="_blank"
              className="hover:underline cursor-pointer"
            >
              Exa.ai is hiring - join us now!
            </Link>
          </p>
        </div>
      </footer>

    </div>
  );
}
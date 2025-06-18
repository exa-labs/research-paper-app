// components/FindSimilarPaper.tsx
"use client";

import { useState, FormEvent, useEffect } from "react";

import { useSearchParams, useRouter } from 'next/navigation';
import { Home } from 'lucide-react';
import ResultsLoadingSkeleton from "../ui/ResultsLoadingSkeleton";
import { CardResearchPaper } from "../CardResearchPaper";
import { getAssetPath } from "@/app/utils";

export default function FindSimilarPaper() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState(null);
  
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const query = searchParams.get("query");
    if (query) {
      setSearchQuery(query);
      handleSearch(null, query);
    }
  }, [searchParams]);

  const handleSearch = async (e: FormEvent | null, initialQuery?: string) => {
    if (e) e.preventDefault();
    
    const queryToUse = initialQuery || searchQuery;

    if (!queryToUse) {
      
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch(getAssetPath('/api/similarpapers'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: queryToUse }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch similar papers.');
      }

      const data = await response.json();
      setSearchResults(data.results || []);
    } catch (error) {
      console.error('Error in handleSearch:', error);
   
      setSearchResults([]);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="w-full md:max-w-5xl p-2 md:p-6 z-10">
      
      <div className="top-8 left-8 mb-4 opacity-0 animate-fade-up [animation-delay:200ms]">
        <button 
          onClick={() => router.push('/')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <Home className="w-4 h-4" />
          <span className="text-sm">Go To Home</span>
        </button>
      </div>

      
        <h1 className="md:text-4xl text-2xl pt-6 pb-3 font-medium opacity-0 animate-fade-up [animation-delay:200ms]">
          Find Similar Papers
        </h1>
        <p className="text-black mb-5 opacity-0 animate-fade-up [animation-delay:200ms]">
          Put the link of any paper and get similar papers.
        </p>
    

      <form onSubmit={handleSearch} className="flex gap-0 mb-8 opacity-0 animate-fade-up [animation-delay:200ms]">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Enter paper url"
          className="flex-1 p-3 rounded-none ring-2 ring-brand-default focus:outline-none"
        />
        <button
          type="submit"
          className="bg-brand-default text-white px-6 py-3 rounded-none ring-2 ring-brand-default hover:bg-brand-dark transition-colors disabled:opacity-50"
          disabled={isGenerating}
        >
          {isGenerating ? 'Finding...' : 'Find Similar'}
        </button>
      </form>

      {error && (
        <div className="text-red-500 text-center mb-4">
          {error}
        </div>
      )}

     {isGenerating && <ResultsLoadingSkeleton />}

    
    {!isGenerating && searchResults.length > 0 && (
        <div className="space-y-4">
          {searchResults
            .filter((paper: any) => paper.title && paper.title.trim() !== '')
            .map((paper, index) => (
            <CardResearchPaper
              key={index} 
              paper={paper} 
              animationDelay={100 + index * 100}
            />
          ))}
        </div>
    )}

    </div>
  );
}
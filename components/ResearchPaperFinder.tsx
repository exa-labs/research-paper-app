// ResearchPaperFinder.tsx
"use client";
import { useState, FormEvent, useEffect } from "react";
import { CardResearchPaper } from "./CardResearchPaper";
import ResultsLoadingSkeleton from "./ui/ResultsLoadingSkeleton";
import Link from "next/link";
import SearchSuggestions from "./ui/SearchSuggestion";

export default function ResearchPaperFinder() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);

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
    window.open(`/chatpage?papers=${encodedData}`, "_blank");
  };


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
  
  useEffect(() => {
    if (searchQuery && isGenerating) {
      handleSearch(new Event("submit") as any);
    }
  }, [searchQuery]);
  
  const handleSuggestionClick = (query: string) => {
    setIsGenerating(true);
    setSearchQuery(query);
  };

  return (
    <div className="flex flex-col min-h-screen w-full md:max-w-4xl z-0">

    <main className="flex flex-col justify-center flex-grow w-full md:max-w-4xl p-2 md:p-6">

      <h1 className="md:text-4xl text-2xl pt-4 mb-8 font-medium opacity-0 animate-fade-up [animation-delay:300ms]">
        Discover NeurIPS Papers 
      </h1>

      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex gap-0">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Find research papers"
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

      
      {!isGenerating && searchResults.length === 0 && (
        
        <SearchSuggestions onSuggestionClick={handleSuggestionClick} />
      )}

      {error && (
        <div className="mt-2 p-2 bg-red-100 border border-red-400 text-red-700 rounded-none">
          {error}
        </div>
      )}

      {isGenerating && <ResultsLoadingSkeleton />}

      {!isGenerating && searchResults.length > 0 && (
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setIsSelectionMode(!isSelectionMode)}
            className="text-brand-default hover:text-brand-darker text-sm font-medium"
          >
            {isSelectionMode ? 'Cancel' : 'Chat with Papers'}
          </button>
          
          {isSelectionMode && (
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">
                {selectedPapers.length} selected
              </span>
              <button
                onClick={handleMultiPaperChat}
                disabled={selectedPapers.length === 0}
                className={`px-4 py-2 rounded-none text-sm font-medium
                  ${selectedPapers.length === 0 
                    ? 'bg-gray-100 text-gray-400' 
                    : 'bg-brand-default text-white hover:bg-brand-darker'}`}
              >
                Chat with Selected Papers
              </button>
            </div>
          )}
        </div>
      )}

      {!isGenerating && searchResults.length > 0 && (
        <div className="space-y-4">
          
          {searchResults.map((paper, index) => (
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
      )}

    </main>

      <footer className="w-full py-6 px-8 mb-6 mt-auto opacity-0 animate-fade-up [animation-delay:600ms]">
        <div className="max-w-md mx-auto">
          <p className="text-md text-center text-gray-600">
            <Link 
              href="/about"
              target="_blank"
              className="hover:underline cursor-pointer"
            >
              Exa is hiring - join us now!
            </Link>
          </p>
        </div>
      </footer>

    </div>
  );
}
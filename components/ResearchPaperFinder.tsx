"use client";

import { useState, FormEvent } from "react";

export default function ResearchPaperFinder() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [searchResult, setSearchResult] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault(); // Prevent form submission refresh
    console.log("Search initiated for research papers.");

    if (!searchQuery) {
      setError("Please enter a search topic to find research papers.");
      return;
    }
    
    setIsGenerating(true);
    setError(null);

    try {
      console.log("Making API request to /api/research");
      const response = await fetch('/api/research', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: searchQuery }),
      });

      console.log("API response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch search results.');
      }

      const data = await response.json();
      console.log("Received data:", data);

      if (data.searchResult) {
        setSearchResult(data.searchResult);
      } else {
        setError("No research papers found.");
      }
    } catch (error) {
      console.error('Error in handleSearch:', error);
      setError(error instanceof Error ? error.message : 'An unexpected error occurred.');
      setSearchResult('');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="w-full border-6 max-w-4xl p-6">
      <h1 className="md:text-6xl text-4xl pb-5 font-medium opacity-0 animate-fade-up [animation-delay:200ms]">
        Discover 
        <span className="text-brand-default"> Research Papers </span>
        Instantly
      </h1>

      <p className="text-black mb-12 opacity-0 animate-fade-up [animation-delay:400ms]">
        Find relevant research papers. Explore knowledge effortlessly.
      </p>

      <form onSubmit={handleSearch} className="space-y-6">
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Type here to find research papers"
          className="w-full bg-white p-3 border box-border outline-none rounded-sm ring-2 ring-brand-default resize-none opacity-0 animate-fade-up [animation-delay:600ms]"
        />
        <button
          type="submit"
          className={`w-full bg-brand-default text-white font-semibold px-2 py-2 rounded-sm transition-opacity opacity-0 animate-fade-up [animation-delay:800ms] min-h-[50px] ring-2 ring-brand-default ${
            isGenerating ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={isGenerating}
        >
          {isGenerating ? 'Searching...' : 'Search Now'}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {searchResult && (
        <div className="mt-20 w-full bg-white p-4 border outline-none resize-none min-h-[200px] overflow-auto rounded opacity-0 animate-fade-up [animation-delay:200ms]">
          {searchResult}
        </div>
      )}
    </div>
  );
}
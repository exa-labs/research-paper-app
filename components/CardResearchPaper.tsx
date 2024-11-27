// components/CardResearchPaper.tsx

"use client";

import { useState } from 'react';
import { PaperDialog } from './PaperDialog';

  interface ResearchPaper {
    title: string;
    text: string;
    author: string;
    publishedDate: string;
    summary: string;
    url: string;
  }
  
  export function CardResearchPaper({ paper, animationDelay, }: { paper: ResearchPaper, animationDelay: number; }) {

    
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Extract year from date, return null if invalid
    const getYear = (dateString: string) => {
      const date = new Date(dateString);
      return !isNaN(date.getTime()) ? date.getFullYear() : null;
    };
  
    const year = getYear(paper.publishedDate);
    const hasValidAuthor = paper.author && paper.author !== "[Submitted on" && paper.author !== "";
  
    // Function to format the display string
    const formatMetaInfo = (year: number | null, author: string | null) => {
      if (year && hasValidAuthor) {
        return `${year} | ${author}`;
      }
      if (year) {
        return `${year}`;
      }
      if (hasValidAuthor) {
        return `${author}`;
      }
      return null;
    };
  
    const metaInfo = formatMetaInfo(year, paper.author);
  
    return (

      <>
        <div 
          onClick={() => setIsDialogOpen(true)}
          className="cursor-pointer hover:shadow-lg transition-shadow duration-200"
        >
           
              <div className="mb-6 p-6 hover:translate-y-[-2px] md:p-8 bg-white rounded-none shadow-sm hover:shadow-md border border-white transition-all duration-300  opacity-0 animate-fade-up"
              style={{ animationDelay: `${animationDelay}ms` }}>
                <h3 className="text-xl font-semibold text-gray-800 mb-3 line-clamp-2">
                  {paper.title}
                </h3>
        
                <p className="text-gray-700 mb-4 line-clamp-3">
                  {paper.summary}
                </p>

                {metaInfo && (
                  <p className="text-sm text-gray-400 line-clamp-1">
                    {metaInfo}
                  </p>
                )}

              </div>
            
        </div>

        <PaperDialog 
          paper={paper}
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
        />
      </>

     
    );
  }  
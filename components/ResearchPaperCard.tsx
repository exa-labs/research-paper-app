// components/ResearchPaperCard.tsx
interface ResearchPaper {
    title: string;
    author: string;
    publishedDate: string;
    summary: string;
    url: string;
  }
  
  export function ResearchPaperCard({ paper }: { paper: ResearchPaper }) {
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
      <a
        href={paper.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block mb-6 transition-all duration-300 hover:translate-y-[-2px]"
      >
        <div className="p-6 md:p-8 bg-white rounded-none shadow-sm hover:shadow-lg border border-white transition-all duration-300">
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
      </a>
    );
  }  
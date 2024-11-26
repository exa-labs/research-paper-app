import React from "react";

export default function ResultsLoadingSkeleton() {
  const skeletons = Array.from({ length: 7 }); // Default 7 skeletons

  return (
    <div className="mt-8 space-y-8">
      {skeletons.map((_, index) => (
        <div
          key={index}
          className={`p-6 md:p-8 bg-white rounded-none shadow-sm border border-white opacity-0 animate-fade-up`}
          style={{ animationDelay: `${200 + index * 200}ms` }}
        >
          <div className="h-6 bg-secondary-accent rounded w-3/4 mb-4 animate-pulse"></div>
          <div className="h-4 bg-secondary-accent rounded w-full mb-3 animate-pulse"></div>
          <div className="h-4 bg-secondary-accent rounded w-full mb-3 animate-pulse"></div>
          <div className="h-3 bg-secondary-accent rounded w-2/3 animate-pulse"></div>
        </div>
      ))}
    </div>
  );
}
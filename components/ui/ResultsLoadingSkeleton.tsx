import React from "react";

export default function ResultsLoadingSkeleton() {
  const skeletons = Array.from({ length: 7 });

  return (
    <div className="space-y-5">
      {skeletons.map((_, index) => (
        <div
          key={index}
          className={`py-6 rounded-none opacity-0 animate-fade-up`}
          style={{ animationDelay: `${100 + index * 100}ms` }}
        >
          <div className="h-6 bg-secondary-accent rounded-none w-3/4 mb-4 animate-pulse"></div>
          <div className="h-4 bg-secondary-accent rounded-none w-full animate-pulse"></div>
        </div>
      ))}
    </div>
  );
}
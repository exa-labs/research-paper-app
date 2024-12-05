// components/ui/SearchSuggestions.tsx
interface SearchSuggestion {
  icon: string;
  query: string;
}

const RESEARCH_SUGGESTIONS: SearchSuggestion[] = [
  { icon: "🧠", query: "Deep Learning architecture" },
  { icon: "🤖", query: "Reinforcement Learning advances" },
  { icon: "📊", query: "Large Language Models" },
  { icon: "📈", query: "Machine Learning optimization" },
];

interface SearchSuggestionsProps {
  onSuggestionClick: (query: string) => void;
}

export default function SearchSuggestions({ onSuggestionClick }: SearchSuggestionsProps) {
  return (
    <div className="grid grid-cols-2 gap-3 opacity-0 animate-fade-up [animation-delay:500ms]">
      {RESEARCH_SUGGESTIONS.map((suggestion, index) => (
        <button
          key={index}
          onClick={() => onSuggestionClick(suggestion.query)}
          className="flex items-center space-x-3 px-4 py-3 bg-secondary-faint border-2 border-gray-200 
                     hover:border-gray-500 transition-colors rounded-none text-left"
        >
          <span className="text-lg">{suggestion.icon}</span>
          <span className="text-gray-700">{suggestion.query}</span>
        </button>
      ))}
    </div>
  )
}
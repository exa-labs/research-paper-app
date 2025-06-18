// components/ui/SearchSuggestions.tsx
import { useState, useEffect } from 'react';

interface SearchSuggestion {
  emoji: string;
  question: string;
}

interface Category {
  name: string;
  suggestions: SearchSuggestion[];
}

const ALL_CATEGORIES: Category[] = [
  {
    name: "Medicine and Healthcare",
    suggestions: [
      { emoji: "💊", question: "Are antidepressants just expensive placebos?" },
      { emoji: "💉", question: "Do vaccines actually cause more harm than good?" },
      { emoji: "🏥", question: "Is modern medicine making us weaker as a species?" },
      { emoji: "🔬", question: "Are doctors overprescribing antibiotics to make money?" },
      { emoji: "💊", question: "Is the opioid crisis entirely Big Pharma's fault?" },
      { emoji: "🌿", question: "Do homeopathic remedies work better than we think?" },
      { emoji: "📋", question: "Are annual checkups a waste of time and money?" }
    ]
  },
  {
    name: "Fitness and Exercise",
    suggestions: [
      { emoji: "🏃", question: "Is cardio completely useless for weight loss?" },
      { emoji: "🏋️", question: "Do CrossFit workouts cause more injuries than results?" },
      { emoji: "💪", question: "Is lifting heavy weights bad for women?" },
      { emoji: "🏃‍♀️", question: "Are marathon runners actually damaging their hearts?" },
      { emoji: "🔥", question: "Is the fitness industry selling us lies about abs?" },
      { emoji: "💊", question: "Do gym supplements actually do nothing?" },
      { emoji: "⚡", question: "Is working out every day harmful to your body?" }
    ]
  },
  {
    name: "Mental Health",
    suggestions: [
      { emoji: "🧠", question: "Is therapy just expensive friendship?" },
      { emoji: "💊", question: "Are antidepressants making depression worse?" },
      { emoji: "📱", question: "Is social media the main cause of teen suicide?" },
      { emoji: "⚠️", question: "Do trigger warnings make trauma worse?" },
      { emoji: "🎯", question: "Is ADHD just bad parenting in disguise?" },
      { emoji: "📲", question: "Are mental health apps replacing real treatment dangerously?" },
      { emoji: "😰", question: "Is anxiety just a fancy word for being weak?" }
    ]
  },
  {
    name: "Nutrition and Diet",
    suggestions: [
      { emoji: "🥬", question: "Is veganism slowly killing people?" },
      { emoji: "🍞", question: "Are carbs the real enemy, not fat?" },
      { emoji: "⏰", question: "Is intermittent fasting just glorified starvation?" },
      { emoji: "🥤", question: "Do artificial sweeteners cause more weight gain than sugar?" },
      { emoji: "🫒", question: "Is the Mediterranean diet overhyped nonsense?" },
      { emoji: "🥛", question: "Are protein shakes destroying your kidneys?" },
      { emoji: "🌱", question: "Is organic food a expensive marketing scam?" }
    ]
  },
  {
    name: "Parenting and Child Development",
    suggestions: [
      { emoji: "🚁", question: "Is helicopter parenting ruining an entire generation?" },
      { emoji: "🏆", question: "Do participation trophies create weak adults?" },
      { emoji: "🏠", question: "Is homeschooling better than public education?" },
      { emoji: "📱", question: "Are smartphones making kids dumber?" },
      { emoji: "✋", question: "Is spanking children actually necessary discipline?" },
      { emoji: "👶", question: "Do daycare centers spread more than just germs?" },
      { emoji: "🍼", question: "Is breast milk really that much better than formula?" }
    ]
  },
  {
    name: "Sleep",
    suggestions: [
      { emoji: "😴", question: "Is sleeping 8 hours a night completely unnecessary?" },
      { emoji: "💊", question: "Do sleep medications cause more problems than insomnia?" },
      { emoji: "🌙", question: "Is melatonin supplement addiction real?" },
      { emoji: "🦉", question: "Are late sleepers more intelligent than early risers?" },
      { emoji: "⚠️", question: "Is sleep deprivation worse than smoking for your health?" },
      { emoji: "🛏️", question: "Do weighted blankets actually work or is it placebo?" },
      { emoji: "👶", question: "Is co-sleeping with babies more dangerous than helpful?" }
    ]
  },
  {
    name: "Skin Care",
    suggestions: [
      { emoji: "☀️", question: "Is sunscreen causing more cancer than it prevents?" },
      { emoji: "💰", question: "Are expensive skincare products just water and marketing?" },
      { emoji: "🧼", question: "Is washing your face daily actually bad for your skin?" },
      { emoji: "⏰", question: "Do anti-aging creams do absolutely nothing?" },
      { emoji: "💊", question: "Is acne medication making skin problems worse?" },
      { emoji: "👨‍⚕️", question: "Are dermatologists pushing unnecessary treatments for profit?" },
      { emoji: "🌿", question: "Is natural skincare better than chemical products?" }
    ]
  },
  {
    name: "Psychology",
    suggestions: [
      { emoji: "🧭", question: "Is free will just an illusion we tell ourselves?" },
      { emoji: "🤐", question: "Are introverts just socially damaged extroverts?" },
      { emoji: "😊", question: "Is positive thinking making people more depressed?" },
      { emoji: "📊", question: "Do personality tests predict anything meaningful?" },
      { emoji: "💭", question: "Is emotional intelligence fake science?" },
      { emoji: "🔪", question: "Are psychopaths born or created by society?" },
      { emoji: "🧠", question: "Is multitasking making us collectively stupider?" }
    ]
  },
  {
    name: "Supplements",
    suggestions: [
      { emoji: "💊", question: "Are vitamin supplements just expensive urine?" },
      { emoji: "💪", question: "Is protein powder necessary or marketing hype?" },
      { emoji: "🦠", question: "Do probiotics actually improve gut health?" },
      { emoji: "🐟", question: "Are omega-3 supplements completely useless?" },
      { emoji: "⚡", question: "Is creatine safe for long-term use?" },
      { emoji: "🧠", question: "Do nootropics actually make you smarter?" },
      { emoji: "🌈", question: "Are multivitamins doing more harm than good?" }
    ]
  },
];

// Function to randomly select 3 suggestions from a category
const getRandomSuggestions = (suggestions: SearchSuggestion[], count: number = 3): SearchSuggestion[] => {
  const shuffled = [...suggestions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

interface SearchSuggestionsProps {
  onSuggestionClick: (query: string) => void;
}

export default function SearchSuggestions({ onSuggestionClick }: SearchSuggestionsProps) {
  const [randomizedCategories, setRandomizedCategories] = useState<Array<{name: string, suggestions: SearchSuggestion[]}>>([]);

  useEffect(() => {
    // Only randomize on client side to avoid hydration mismatch
    const categoriesWithRandomSuggestions = ALL_CATEGORIES.map(category => ({
      name: category.name,
      suggestions: getRandomSuggestions(category.suggestions)
    }));
    setRandomizedCategories(categoriesWithRandomSuggestions);
  }, []);

  // Show first 3 suggestions from each category during SSR/initial render
  const initialCategories = ALL_CATEGORIES.map(category => ({
    name: category.name,
    suggestions: category.suggestions.slice(0, 3)
  }));

  const categoriesToRender = randomizedCategories.length > 0 ? randomizedCategories : initialCategories;

  return (
    <div className="space-y-6 opacity-0 animate-fade-up [animation-delay:500ms]">
      {categoriesToRender.map((category, categoryIndex) => (
        <div key={categoryIndex} className="space-y-2">
          <h3 className="text-base font-medium text-gray-800 mb-3">
            {category.name}
          </h3>
          
          <div className="space-y-1">
            {category.suggestions.map((suggestion, suggestionIndex) => (
              <button
                key={suggestionIndex}
                onClick={() => onSuggestionClick(suggestion.question)}
                className="w-full flex items-center space-x-2 px-3 py-2 bg-transparent border border-gray-200 
                           hover:border-[var(--brand-default)] hover:bg-white transition-all duration-200 
                           text-left group"
              >
                <span className="text-sm flex-shrink-0">{suggestion.emoji}</span>
                <span className="text-gray-700 group-hover:text-gray-900 text-sm leading-tight">
                  {suggestion.question}
                </span>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
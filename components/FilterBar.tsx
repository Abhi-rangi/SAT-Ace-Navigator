import React from 'react';
import { CourseFormat, SearchCriteria, CourseCategory } from '../types';
import { Search, Calculator, BookOpen, Trophy } from 'lucide-react';

interface FilterBarProps {
  criteria: SearchCriteria;
  setCriteria: React.Dispatch<React.SetStateAction<SearchCriteria>>;
  onSearch: () => void;
  isSearching: boolean;
}

export const FilterBar: React.FC<FilterBarProps> = ({ criteria, setCriteria, onSearch, isSearching }) => {
  
  const handleChange = (field: keyof SearchCriteria, value: any) => {
    setCriteria(prev => ({ ...prev, [field]: value }));
  };

  // Trigger search immediately when category changes (simulating a tab switch)
  const handleCategoryChange = (cat: CourseCategory) => {
      setCriteria(prev => ({ ...prev, category: cat }));
      // We defer the actual search trigger to the parent useEffect or user click if preferred, 
      // but standard tab UX usually loads immediately. For now, we just update state and let user click Search or we could auto-trigger.
      // To keep it simple, we will let the user click search or add a visual cue.
      // Actually, looking at App.tsx, we might want to auto-trigger. Let's keep it manual for specific param tweaking, 
      // but high-level tabs usually feel instant. Let's make the tabs visual and update criteria.
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 mb-8 overflow-hidden">
      {/* Category Tabs */}
      <div className="flex border-b border-gray-200 bg-gray-50 overflow-x-auto">
        {Object.values(CourseCategory).map((cat) => {
            const icons = {
                [CourseCategory.OVERALL]: Trophy,
                [CourseCategory.MATH]: Calculator,
                [CourseCategory.VERBAL]: BookOpen
            };
            const Icon = icons[cat];
            const isActive = criteria.category === cat;
            
            return (
                <button
                    key={cat}
                    onClick={() => handleCategoryChange(cat)}
                    className={`flex-1 py-4 px-6 flex items-center justify-center gap-2 text-sm font-semibold whitespace-nowrap transition-colors ${
                        isActive 
                            ? 'bg-white text-indigo-600 border-b-2 border-indigo-600' 
                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                    }`}
                >
                    <Icon size={18} />
                    {cat}
                </button>
            );
        })}
      </div>

      {/* Filters */}
      <div className="p-6">
        <div className="flex flex-col lg:flex-row gap-6 items-end">
            
            <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Max Budget</label>
                <div className="flex items-center gap-4">
                    <input
                        type="range"
                        min="0"
                        max="3000"
                        step="100"
                        value={criteria.budgetMax}
                        onChange={(e) => handleChange('budgetMax', Number(e.target.value))}
                        className="flex-grow h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    />
                    <span className="font-mono font-bold text-gray-700 w-16 text-right">${criteria.budgetMax}</span>
                </div>
                </div>

                <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Format</label>
                <select
                    value={criteria.preferredFormat}
                    onChange={(e) => handleChange('preferredFormat', e.target.value)}
                    className="w-full p-2 bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                >
                    <option value="ANY">Any Format</option>
                    {Object.values(CourseFormat).map(format => (
                    <option key={format} value={format}>{format}</option>
                    ))}
                </select>
                </div>

                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Target Increase</label>
                    <div className="relative">
                        <input 
                            type="number"
                            value={criteria.targetScoreIncrease}
                            onChange={(e) => handleChange('targetScoreIncrease', Number(e.target.value))}
                            className="w-full p-2 bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="e.g. 150"
                        />
                        <span className="absolute right-3 top-2 text-gray-400 text-xs font-medium">PTS</span>
                    </div>
                </div>
            </div>

            <div className="w-full lg:w-auto">
            <button
                onClick={onSearch}
                disabled={isSearching}
                className={`flex items-center justify-center gap-2 w-full lg:w-auto px-8 py-2.5 rounded-lg text-white font-bold shadow-lg transition-all transform hover:-translate-y-0.5 ${
                isSearching 
                    ? 'bg-indigo-400 cursor-not-allowed' 
                    : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200'
                }`}
            >
                {isSearching ? (
                <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Analyzing...</span>
                </>
                ) : (
                <>
                    <Search size={18} />
                    Update Results
                </>
                )}
            </button>
            </div>

        </div>
      </div>
    </div>
  );
};

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

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
      {/* Scrollable Category Tabs on Mobile */}
      <div className="flex border-b border-gray-200 bg-gray-50 overflow-x-auto no-scrollbar">
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
                    onClick={() => handleChange('category', cat)}
                    className={`flex-1 py-4 px-4 sm:px-6 flex items-center justify-center gap-2 text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                        isActive 
                            ? 'bg-white text-indigo-600 border-b-2 border-indigo-600' 
                            : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                    }`}
                >
                    <Icon size={16} className={isActive ? 'text-indigo-600' : 'text-gray-300'} />
                    {cat}
                </button>
            );
        })}
      </div>

      <div className="p-4 sm:p-6">
        <div className="flex flex-col gap-6">
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Max Budget</label>
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
                        <span className="font-mono font-bold text-gray-700 text-sm whitespace-nowrap">${criteria.budgetMax}</span>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Preferred Format</label>
                    <select
                        value={criteria.preferredFormat}
                        onChange={(e) => handleChange('preferredFormat', e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    >
                        <option value="ANY">Any Format</option>
                        {Object.values(CourseFormat).map(format => (
                            <option key={format} value={format}>{format}</option>
                        ))}
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Score Target</label>
                    <div className="relative">
                        <input 
                            type="number"
                            value={criteria.targetScoreIncrease}
                            onChange={(e) => handleChange('targetScoreIncrease', Number(e.target.value))}
                            className="w-full p-2.5 bg-slate-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            placeholder="e.g. 150"
                        />
                        <span className="absolute right-3 top-2.5 text-gray-400 text-[10px] font-black uppercase">pts</span>
                    </div>
                </div>
            </div>

            <button
                onClick={onSearch}
                disabled={isSearching}
                className={`flex items-center justify-center gap-2 w-full py-3.5 rounded-xl text-white font-black shadow-lg transition-all active:scale-95 ${
                    isSearching 
                        ? 'bg-indigo-400 cursor-not-allowed' 
                        : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100'
                }`}
            >
                {isSearching ? (
                    <>
                        <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                        <span>Scanning Database...</span>
                    </>
                ) : (
                    <>
                        <Search size={18} />
                        Update Insights
                    </>
                )}
            </button>
        </div>
      </div>
    </div>
  );
};

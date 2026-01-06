
import React, { useState } from 'react';
import { MapPin, Search, Navigation, Star, ExternalLink, BookOpen, Filter, ChevronDown } from 'lucide-react';
import { fetchLocalTutors, LocalTutorResponse, TutorFilters } from '../services/geminiService';

interface LocalTutorFinderProps {
    onLocationChange?: (location: string) => void;
}

export const LocalTutorFinder: React.FC<LocalTutorFinderProps> = ({ onLocationChange }) => {
  const [location, setLocation] = useState('New Jersey');
  const [subject, setSubject] = useState('');
  const [rating, setRating] = useState('');
  const [price, setPrice] = useState('');
  const [availability, setAvailability] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<LocalTutorResponse | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!location.trim()) return;

    if (onLocationChange) onLocationChange(location);
    const searchSubject = subject.trim() || "Academic Tutoring (Grade 8-12)";
    const filters: TutorFilters = { rating, price, availability };

    setLoading(true);
    setResult(null);
    try {
      const data = await fetchLocalTutors(location, searchSubject, filters);
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden h-full flex flex-col">
      <div className="bg-indigo-900 p-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <MapPin className="text-yellow-400" size={24} />
          <h2 className="text-xl font-bold">Local Experts</h2>
        </div>
        <p className="text-indigo-200 text-sm mb-6">
          Find high school tutors for Vocab, Essay Writing, and Math.
        </p>
        
        <form onSubmit={handleSearch} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-3">
            <div className="relative">
                <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Subject (e.g. Essay Writing)"
                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
                <BookOpen className="absolute left-3 top-3.5 text-indigo-300" size={18} />
            </div>

            <div className="relative">
                <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="City or State"
                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
                <Search className="absolute left-3 top-3.5 text-indigo-300" size={18} />
            </div>
          </div>

          <button 
            type="button" 
            onClick={() => setShowFilters(!showFilters)}
            className="text-xs text-indigo-300 flex items-center justify-between hover:text-white transition-colors py-1"
          >
            <span className="flex items-center gap-1 font-bold">
                <Filter size={14} /> {showFilters ? 'Hide Filters' : 'Advanced Filters'}
            </span>
            <ChevronDown size={14} className={`transform transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>

          {showFilters && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 animate-fade-in">
                <select value={rating} onChange={(e) => setRating(e.target.value)} className="bg-white/10 border border-white/20 text-white text-xs rounded-lg p-2.5 outline-none">
                    <option value="" className="text-gray-900">Any Rating</option>
                    <option value="4.0" className="text-gray-900">4.0+ Stars</option>
                    <option value="4.5" className="text-gray-900">4.5+ Stars</option>
                </select>
                <select value={price} onChange={(e) => setPrice(e.target.value)} className="bg-white/10 border border-white/20 text-white text-xs rounded-lg p-2.5 outline-none">
                    <option value="" className="text-gray-900">Any Price</option>
                    <option value="Budget" className="text-gray-900">$ Budget</option>
                    <option value="Moderate" className="text-gray-900">$$ Moderate</option>
                </select>
                <select value={availability} onChange={(e) => setAvailability(e.target.value)} className="bg-white/10 border border-white/20 text-white text-xs rounded-lg p-2.5 outline-none">
                    <option value="" className="text-gray-900">Any Time</option>
                    <option value="Weekends" className="text-gray-900">Weekends</option>
                    <option value="Weekdays" className="text-gray-900">Weekdays</option>
                </select>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="bg-yellow-400 hover:bg-yellow-500 text-indigo-900 font-bold px-6 py-3 rounded-lg transition-all shadow-lg text-sm mt-2"
          >
            {loading ? 'Searching Maps...' : 'Find Local Experts'}
          </button>
        </form>
      </div>

      <div className="p-6 flex-grow overflow-y-auto max-h-[400px]">
        {!result && !loading && (
            <div className="text-center py-10 text-gray-400 text-sm">
                Enter your location and subject to find certified tutors.
            </div>
        )}
        
        {result && (
            <div className="animate-fade-in">
                <div className="mb-6 text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
                    {result.text}
                </div>
                {result.groundingChunks && result.groundingChunks.length > 0 && (
                    <div className="space-y-3">
                        <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Verified Map Listings</h4>
                        {result.groundingChunks.map((chunk, idx) => {
                            const data = chunk.web || chunk.maps;
                            if (!data) return null;
                            return (
                                <a key={idx} href={data.uri} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 bg-slate-50 border border-gray-100 rounded-lg hover:border-indigo-300 transition-colors group">
                                    <div className="flex-grow">
                                        <h5 className="font-bold text-gray-900 text-sm group-hover:text-indigo-700">{data.title}</h5>
                                        <p className="text-[10px] text-gray-500 uppercase tracking-tighter">Verified Location</p>
                                    </div>
                                    <ExternalLink size={14} className="text-gray-300 group-hover:text-indigo-500" />
                                </a>
                            );
                        })}
                    </div>
                )}
            </div>
        )}
      </div>
    </div>
  );
};

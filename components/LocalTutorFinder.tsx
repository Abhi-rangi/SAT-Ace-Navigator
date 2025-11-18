import React, { useState } from 'react';
import { MapPin, Search, Navigation, Star, ExternalLink, BookOpen, Filter } from 'lucide-react';
import { fetchLocalTutors, LocalTutorResponse, TutorFilters } from '../services/geminiService';

export const LocalTutorFinder: React.FC = () => {
  const [location, setLocation] = useState('');
  const [subject, setSubject] = useState('');
  
  // New Filter States
  const [rating, setRating] = useState('');
  const [price, setPrice] = useState('');
  const [availability, setAvailability] = useState('');

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<LocalTutorResponse | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!location.trim()) return;

    const searchSubject = subject.trim() || "General Academic Tutoring";
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
    <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
      <div className="bg-indigo-900 p-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <MapPin className="text-yellow-400" size={24} />
          <h2 className="text-xl font-bold">Find Local Tutors (Grades 8-12)</h2>
        </div>
        <p className="text-indigo-200 text-sm mb-6">
          Discover experts for Essay Writing, Vocab, Math, and more near you.
        </p>
        
        <form onSubmit={handleSearch} className="flex flex-col gap-4">
          {/* Primary Inputs */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative md:w-1/3">
                <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Subject (e.g. Essay Writing)"
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:bg-white/20 backdrop-blur-sm transition-all"
                />
                <BookOpen className="absolute left-3 top-3.5 text-indigo-300" size={18} />
            </div>

            <div className="relative flex-grow">
                <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="City, Zip, or Neighborhood"
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:bg-white/20 backdrop-blur-sm transition-all"
                />
                <Search className="absolute left-3 top-3.5 text-indigo-300" size={18} />
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 items-center">
             <div className="flex items-center gap-2 text-indigo-300 text-sm font-medium md:w-auto w-full">
                <Filter size={16} />
                <span>Filters:</span>
             </div>
             
             <div className="grid grid-cols-3 gap-4 flex-grow w-full md:w-auto">
                <select 
                    value={rating} 
                    onChange={(e) => setRating(e.target.value)}
                    className="bg-white/10 border border-white/20 text-white text-sm rounded-lg block w-full p-2.5 focus:ring-yellow-400 focus:border-yellow-400"
                >
                    <option value="" className="text-gray-900">Any Rating</option>
                    <option value="4.0" className="text-gray-900">4.0+ Stars</option>
                    <option value="4.5" className="text-gray-900">4.5+ Stars</option>
                    <option value="5.0" className="text-gray-900">5.0 Stars</option>
                </select>

                <select 
                    value={price} 
                    onChange={(e) => setPrice(e.target.value)}
                    className="bg-white/10 border border-white/20 text-white text-sm rounded-lg block w-full p-2.5 focus:ring-yellow-400 focus:border-yellow-400"
                >
                    <option value="" className="text-gray-900">Any Price</option>
                    <option value="Budget" className="text-gray-900">$ Budget</option>
                    <option value="Moderate" className="text-gray-900">$$ Moderate</option>
                    <option value="Premium" className="text-gray-900">$$$ Premium</option>
                </select>

                <select 
                    value={availability} 
                    onChange={(e) => setAvailability(e.target.value)}
                    className="bg-white/10 border border-white/20 text-white text-sm rounded-lg block w-full p-2.5 focus:ring-yellow-400 focus:border-yellow-400"
                >
                    <option value="" className="text-gray-900">Any Time</option>
                    <option value="Weekdays" className="text-gray-900">Weekdays</option>
                    <option value="Weekends" className="text-gray-900">Weekends</option>
                    <option value="Evenings" className="text-gray-900">Evenings</option>
                </select>
             </div>

            <button
                type="submit"
                disabled={loading}
                className="bg-yellow-400 hover:bg-yellow-500 text-indigo-900 font-bold px-6 py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 md:w-auto w-full whitespace-nowrap shadow-lg"
            >
                {loading ? 'Searching...' : 'Find Tutors'}
            </button>
          </div>
        </form>
      </div>

      {result && (
        <div className="p-6">
          <div className="mb-6 prose prose-sm prose-indigo text-gray-600 max-w-none">
            <div className="whitespace-pre-wrap leading-relaxed">{result.text}</div>
          </div>

          {result.groundingChunks && result.groundingChunks.length > 0 && (
            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Navigation size={14} />
                Locations Found
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {result.groundingChunks.map((chunk, idx) => {
                  // Safely access properties from the chunk
                  const mapData = chunk.web || chunk.maps;
                  if (!mapData) return null;

                  return (
                    <a
                      key={idx}
                      href={mapData.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group block bg-slate-50 hover:bg-white border border-gray-200 hover:border-indigo-300 rounded-lg p-4 transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-gray-900 group-hover:text-indigo-700 mb-1">
                            {mapData.title}
                          </h4>
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                             <span className="flex items-center gap-1 text-yellow-500">
                                <Star size={12} fill="currentColor" />
                                Map Result
                             </span>
                          </div>
                        </div>
                        <ExternalLink size={16} className="text-gray-400 group-hover:text-indigo-500" />
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
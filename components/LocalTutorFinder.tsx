import React, { useState } from 'react';
import { MapPin, Search, Navigation, Star, ExternalLink } from 'lucide-react';
import { fetchLocalTutors, LocalTutorResponse } from '../services/geminiService';

export const LocalTutorFinder: React.FC = () => {
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<LocalTutorResponse | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!location.trim()) return;

    setLoading(true);
    setResult(null);
    try {
      const data = await fetchLocalTutors(location);
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
          <h2 className="text-xl font-bold">Find Local SAT Tutors</h2>
        </div>
        <p className="text-indigo-200 text-sm mb-6">
          Discover top-rated in-person tutors and prep centers near you.
        </p>
        
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-grow">
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter City, Zip, or Neighborhood (e.g. Austin, TX)"
              className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:bg-white/20 backdrop-blur-sm transition-all"
            />
            <Search className="absolute left-3 top-3.5 text-indigo-300" size={18} />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-yellow-400 hover:bg-yellow-500 text-indigo-900 font-bold px-6 py-3 rounded-lg transition-colors flex items-center gap-2"
          >
            {loading ? 'Searching...' : 'Find'}
          </button>
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

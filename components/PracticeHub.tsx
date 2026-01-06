
import React, { useState, useEffect } from 'react';
import { BookMarked, Download, Link2, FileText, LayoutGrid } from 'lucide-react';
import { fetchStateResources, PracticeResource } from '../services/geminiService';

interface PracticeHubProps {
    location: string;
}

export const PracticeHub: React.FC<PracticeHubProps> = ({ location }) => {
  const [resources, setResources] = useState<PracticeResource[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (location) {
        setLoading(true);
        fetchStateResources(location).then(res => {
            setResources(res);
            setLoading(false);
        });
    }
  }, [location]);

  if (!location) return null;

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
      <div className="bg-slate-900 p-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <BookMarked className="text-orange-400" size={24} />
          <h2 className="text-xl font-bold">Practice Hub: {location}</h2>
        </div>
        <p className="text-slate-400 text-sm">
          Latest state-wide syllabus updates and free practice materials.
        </p>
      </div>

      <div className="p-6">
        {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-pulse">
                {[1,2,3,4].map(i => <div key={i} className="h-24 bg-gray-100 rounded-lg"></div>)}
            </div>
        ) : resources.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {resources.map((res, idx) => (
                    <div key={idx} className="border border-gray-100 bg-slate-50 p-4 rounded-xl flex flex-col justify-between hover:border-orange-300 transition-all group">
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                                    res.type === 'Test' ? 'bg-red-100 text-red-700' :
                                    res.type === 'Syllabus' ? 'bg-blue-100 text-blue-700' :
                                    'bg-green-100 text-green-700'
                                }`}>
                                    {res.type}
                                </span>
                                {res.type === 'Test' ? <FileText size={16} className="text-gray-400" /> : <LayoutGrid size={16} className="text-gray-400" />}
                            </div>
                            <h4 className="font-bold text-gray-900 text-sm mb-1 group-hover:text-orange-600">{res.title}</h4>
                            <p className="text-xs text-gray-500 mb-4 line-clamp-2">{res.description}</p>
                        </div>
                        <a 
                            href={res.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-xs font-bold text-indigo-600 flex items-center gap-1 hover:underline"
                        >
                            Access Resource <Link2 size={12} />
                        </a>
                    </div>
                ))}
            </div>
        ) : (
            <div className="text-center py-8 text-gray-400 text-sm">
                Enter a location to discover local practice materials.
            </div>
        )}
      </div>
    </div>
  );
};


import React from 'react';
import { Megaphone, ExternalLink } from 'lucide-react';

export const AdSection: React.FC = () => {
  return (
    <div className="w-full bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="bg-emerald-500 p-2 rounded-lg text-white">
          <Megaphone size={20} />
        </div>
        <div>
          <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Sponsored</span>
          <h3 className="text-sm font-bold text-slate-800">Need 1-on-1 Ivy League Mentorship?</h3>
          <p className="text-xs text-slate-600">Connect with Stanford & MIT alumni for personalized college essays.</p>
        </div>
      </div>
      <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors whitespace-nowrap">
        Learn More
        <ExternalLink size={14} />
      </button>
    </div>
  );
};

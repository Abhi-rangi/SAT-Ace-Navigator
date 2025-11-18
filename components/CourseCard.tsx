import React from 'react';
import { Course } from '../types';
import { CheckCircle, TrendingUp, Award, Star, Quote, Building2, ExternalLink } from 'lucide-react';

interface CourseCardProps {
  course: Course;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col h-full group">
      {/* Header */}
      <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-white to-slate-50">
        <div className="flex justify-between items-start mb-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
              {course.provider}
            </span>
            <div className="flex items-center text-yellow-400">
                {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill={i < 4 ? "currentColor" : "none"} className={i < 4 ? "text-yellow-400" : "text-gray-300"} />
                ))}
            </div>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">{course.name}</h3>
        <div className="flex justify-between items-baseline mt-2">
             <p className="text-lg font-bold text-slate-700">{course.priceDisplay}</p>
             <p className="text-sm font-medium text-emerald-600 flex items-center gap-1">
                <TrendingUp size={16} />
                Avg +{course.averageScoreIncrease} pts
             </p>
        </div>
      </div>

      <div className="p-6 flex-grow flex flex-col gap-6">
        
        {/* Acceptance Stats */}
        <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
            <div className="flex items-center gap-2 mb-2 text-blue-800 font-semibold text-sm">
                <Building2 size={16} />
                <span>College Acceptance Impact</span>
            </div>
            <p className="text-xs text-blue-700 mb-2 leading-relaxed">
                {course.acceptanceStats.description}
            </p>
            <div className="flex flex-wrap gap-1">
                {course.acceptanceStats.topColleges.slice(0, 3).map(college => (
                    <span key={college} className="text-[10px] font-bold bg-white text-blue-600 px-2 py-1 rounded border border-blue-100 shadow-sm">
                        {college}
                    </span>
                ))}
            </div>
        </div>

        {/* Testimonial */}
        {course.testimonials[0] && (
            <div className="relative pl-4 border-l-2 border-orange-200 italic">
                <Quote size={24} className="absolute -top-2 -left-3 text-orange-200 bg-white rounded-full" />
                <p className="text-sm text-gray-600 mb-2 line-clamp-3">"{course.testimonials[0].text}"</p>
                <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-gray-800">{course.testimonials[0].studentName}</span>
                    <span className="text-indigo-600 font-semibold">Accepted to {course.testimonials[0].acceptedCollege}</span>
                </div>
            </div>
        )}

        {/* Key Features */}
        <div>
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Why it works</h4>
            <ul className="space-y-2">
              {course.pros.slice(0, 2).map((pro, idx) => (
                <li key={idx} className="flex items-start text-sm text-gray-600">
                  <CheckCircle size={14} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  {pro}
                </li>
              ))}
            </ul>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-50 p-4 border-t border-gray-100 flex justify-between items-center">
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <Award size={14} className="text-gray-400" />
          <span>{course.scoreGuarantee}</span>
        </div>
        <a 
          href={course.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-indigo-600 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
        >
          View Course
          <ExternalLink size={14} />
        </a>
      </div>
    </div>
  );
};
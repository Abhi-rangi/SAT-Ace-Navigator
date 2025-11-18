import React, { useState, useEffect } from 'react';
import { Course, SearchCriteria, CourseCategory } from './types';
import { fetchTopSATCourses, fetchAdmissionInsight } from './services/geminiService';
import { CourseCard } from './components/CourseCard';
import { StatsChart } from './components/StatsChart';
import { FilterBar } from './components/FilterBar';
import { GraduationCap, Sparkles, BookOpen, AlertCircle } from 'lucide-react';

const App: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [insight, setInsight] = useState<string>("");
  
  const [criteria, setCriteria] = useState<SearchCriteria>({
    budgetMax: 1500,
    preferredFormat: 'ANY',
    targetScoreIncrease: 150,
    category: CourseCategory.OVERALL
  });

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    try {
      const results = await fetchTopSATCourses(criteria);
      setCourses(results);
    } catch (err) {
      setError("Failed to load courses. Please check your API key or try again.");
    } finally {
      setLoading(false);
    }
  };

  // Auto-search when category changes
  useEffect(() => {
    handleSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [criteria.category]);

  useEffect(() => {
    fetchAdmissionInsight().then(setInsight);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-gray-800 font-sans pb-12">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-indigo-900 via-blue-900 to-slate-900 text-white py-16 px-4 sm:px-6 lg:px-8 shadow-2xl">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="md:w-2/3">
              <div className="flex items-center gap-3 mb-4">
                <GraduationCap size={48} className="text-yellow-400" />
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
                  SAT Ace Navigator
                </h1>
              </div>
              <p className="text-xl text-indigo-100 max-w-2xl leading-relaxed mb-6">
                Find the perfect prep course to maximize your score and unlock admission to elite universities. 
                <span className="block mt-2 text-indigo-300 text-lg font-medium">
                    Verified student reviews & acceptance data included.
                </span>
              </p>
              {insight && (
                <div className="inline-flex items-start gap-3 p-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/10 max-w-xl">
                    <Sparkles className="text-yellow-300 flex-shrink-0 mt-1" size={20}/>
                    <p className="text-sm md:text-base font-medium text-indigo-50 italic">
                        "{insight}"
                    </p>
                </div>
              )}
            </div>
            <div className="hidden md:block md:w-1/3 flex justify-center">
                <div className="bg-white/5 p-8 rounded-full border border-white/10 shadow-inner">
                   <BookOpen size={140} className="text-indigo-200 opacity-90" />
                </div>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10">
        <FilterBar 
          criteria={criteria} 
          setCriteria={setCriteria} 
          onSearch={handleSearch} 
          isSearching={loading}
        />

        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-2 shadow-sm">
            <AlertCircle size={20} />
            {error}
          </div>
        )}

        {courses.length > 0 && !loading && (
          <div className="mb-12 animate-fade-in">
            <StatsChart data={courses} />
          </div>
        )}

        <div className="space-y-6">
          <div className="flex items-center justify-between">
             <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <span className="bg-indigo-600 w-2 h-8 rounded-full"></span>
                Top 5: {criteria.category}
             </h2>
             <span className="text-sm font-medium text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-200 shadow-sm">
                Sorted by Score Improvement
            </span>
          </div>
          
          {loading ? (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3].map((i) => (
                   <div key={i} className="h-[500px] bg-white rounded-xl shadow-sm border border-gray-200 animate-pulse p-6 flex flex-col gap-4">
                       <div className="flex justify-between">
                           <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                           <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                       </div>
                       <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                       <div className="h-32 bg-gray-100 rounded-lg"></div>
                       <div className="flex-grow space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-full"></div>
                          <div className="h-4 bg-gray-200 rounded w-full"></div>
                          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                       </div>
                       <div className="h-10 bg-gray-200 rounded w-full mt-4"></div>
                   </div>
                ))}
             </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          )}
          
          {!loading && courses.length === 0 && !error && (
            <div className="text-center py-24 bg-white rounded-xl border-2 border-gray-200 border-dashed">
                <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <BookOpen size={40} className="text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No courses found for this category</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                    Try adjusting your budget or score target to see more results for "{criteria.category}".
                </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
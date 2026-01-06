
import React, { useState, useEffect } from 'react';
import { Course, SearchCriteria, CourseCategory } from './types';
import { fetchTopSATCourses, fetchAdmissionInsight } from './services/geminiService';
import { CourseCard } from './components/CourseCard';
import { StatsChart } from './components/StatsChart';
import { FilterBar } from './components/FilterBar';
import { LocalTutorFinder } from './components/LocalTutorFinder';
import { PracticeHub } from './components/PracticeHub';
import { AdSection } from './components/AdSection';
import { GraduationCap, Sparkles, BookOpen, AlertCircle, Menu, X } from 'lucide-react';

const App: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [insight, setInsight] = useState<string>("");
  const [userLocation, setUserLocation] = useState<string>("New Jersey");
  
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
      setError("Analysis system is busy. Please try again in a moment.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSearch();
  }, [criteria.category]);

  useEffect(() => {
    fetchAdmissionInsight().then(setInsight);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-gray-800 font-sans pb-20">
      {/* Mobile-Friendly Hero */}
      <div className="bg-gradient-to-br from-indigo-950 via-blue-900 to-slate-900 text-white pt-10 pb-20 px-4 md:px-8 shadow-2xl relative overflow-hidden">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute top-0 left-0 w-64 h-64 bg-white/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col items-center md:items-start md:flex-row justify-between gap-8">
            <div className="md:w-3/4 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
                <GraduationCap size={40} className="text-yellow-400 md:w-16 md:h-16" />
                <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
                  SAT Ace Navigator
                </h1>
              </div>
              <p className="text-lg md:text-xl text-indigo-100 max-w-2xl leading-relaxed mb-6 px-4 md:px-0">
                The ultimate companion for students to find prep courses, local tutors, and state-specific practice tests.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
                  {insight && (
                    <div className="inline-flex items-start gap-3 p-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 max-w-lg">
                        <Sparkles className="text-yellow-300 flex-shrink-0 mt-1" size={18}/>
                        <p className="text-sm font-medium text-indigo-50 italic leading-snug">
                            "{insight}"
                        </p>
                    </div>
                  )}
              </div>
            </div>
            <div className="hidden lg:flex md:w-1/4 justify-center">
                <BookOpen size={120} className="text-indigo-300/40" />
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20 space-y-8">
        
        {/* Ad Placement Top */}
        <AdSection />

        <FilterBar 
          criteria={criteria} 
          setCriteria={setCriteria} 
          onSearch={handleSearch} 
          isSearching={loading}
        />

        {error && (
          <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-lg flex items-center gap-2 text-sm">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        {/* Visual Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
                {courses.length > 0 && !loading && (
                    <StatsChart data={courses} />
                )}
            </div>
            <div className="lg:col-span-1 space-y-6">
                 {/* Sidebar Content or Another Ad */}
                 <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100">
                    <h3 className="font-bold text-indigo-900 mb-2 flex items-center gap-2">
                        <Sparkles size={18} className="text-indigo-600"/>
                        Admission Tip
                    </h3>
                    <p className="text-sm text-indigo-700 leading-relaxed">
                        Colleges look for "score consistency" across sections. If your Math is 750+ but Verbal is sub-600, focusing on Reading drills can exponentially increase your acceptance odds at liberal arts colleges.
                    </p>
                 </div>
            </div>
        </div>

        {/* Course Results Section */}
        <section>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-2">
             <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <span className="bg-indigo-600 w-2 h-8 rounded-full"></span>
                Top Recommendations: {criteria.category}
             </h2>
             <span className="text-xs font-bold text-gray-500 bg-white px-3 py-1.5 rounded-full border border-gray-200 shadow-sm uppercase tracking-wide">
                Best Value Matches
            </span>
          </div>
          
          {loading ? (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                   <div key={i} className="h-96 bg-white rounded-xl shadow-sm border border-gray-200 animate-pulse p-6"></div>
                ))}
             </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          )}
        </section>

        {/* Practice Hub & Tutors Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <PracticeHub location={userLocation} />
            <LocalTutorFinder onLocationChange={(loc) => setUserLocation(loc)} />
        </div>

        <div className="pt-4">
             <AdSection />
        </div>
      </main>

      <footer className="mt-20 border-t border-gray-200 py-10 text-center px-4">
        <p className="text-sm text-gray-500 mb-2">© 2025 SAT Ace Navigator - Empowering Students Everywhere</p>
        <p className="text-[10px] text-gray-400 max-w-lg mx-auto uppercase tracking-tighter font-mono">
            College names and logos are trademarks of their respective owners. This tool provides AI-driven estimations based on available market data.
        </p>
      </footer>
    </div>
  );
};

export default App;

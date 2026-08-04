import React, { useState } from 'react';

export default function ResearchHubPage() {
  const [activeTab, setActiveTab] = useState('library'); // 'library' | 'search' | 'sources'
  const [query, setQuery] = useState('');
  const [selectedSource, setSelectedSource] = useState(null);
  const [savedLibrary, setSavedLibrary] = useState([
    {
      id: 1,
      title: 'Fundamental Theorem of Calculus & Analysis',
      author: 'MIT OpenCourseWare',
      date: '2026',
      snippet: 'Connects differentiation with integration. Evaluates definite integrals via antiderivative subtraction.',
      url: 'https://ocw.mit.edu/courses/mathematics/calculus',
      image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400&q=80'
    },
    {
      id: 2,
      title: 'Quantum Wave Interference & Double Slit Optics',
      author: 'Stanford Physics Journal',
      date: '2025',
      snippet: 'Demonstrates wave-particle duality. Photons create interference fringes even when emitted individually.',
      url: 'https://physics.stanford.edu/research/quantum-optics',
      image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&q=80'
    }
  ]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    const newEntry = {
      id: Date.now(),
      title: query,
      author: 'Academic Web Search',
      date: 'Just Now',
      snippet: `Comprehensive academic summary for ${query} with verified cross-references.`,
      url: `https://academic-search.edu/query?q=${encodeURIComponent(query)}`,
      image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&q=80'
    };
    setSavedLibrary([newEntry, ...savedLibrary]);
    setQuery('');
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans pb-10">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#dfe3e7] dark:border-slate-800">
        <div>
          <h1 className="font-display font-extrabold text-2xl text-[#091426] dark:text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-2xl text-[#835500] dark:text-[#feae2c]">travel_explore</span>
            AI Research Engine & Saved Library
          </h1>
          <p className="text-xs text-[#45474c] dark:text-slate-400">Search web sources, explore research diagrams, and inspect citation metadata</p>
        </div>

        <div className="flex bg-[#f0f4f8] dark:bg-slate-800 p-1 rounded-full text-xs font-semibold">
          <button
            onClick={() => setActiveTab('library')}
            className={`px-4 py-2 rounded-full transition-all flex items-center gap-1.5 ${
              activeTab === 'library'
                ? 'bg-[#091426] text-white dark:bg-[#feae2c] dark:text-[#091426] font-bold shadow-sm'
                : 'text-[#45474c] dark:text-slate-300'
            }`}
          >
            <span className="material-symbols-outlined text-base">collections_bookmark</span>
            Saved Library ({savedLibrary.length})
          </button>
          <button
            onClick={() => setActiveTab('search')}
            className={`px-4 py-2 rounded-full transition-all flex items-center gap-1.5 ${
              activeTab === 'search'
                ? 'bg-[#091426] text-white dark:bg-[#feae2c] dark:text-[#091426] font-bold shadow-sm'
                : 'text-[#45474c] dark:text-slate-300'
            }`}
          >
            <span className="material-symbols-outlined text-base">search</span>
            Academic Search
          </button>
        </div>
      </div>

      {/* Query Search Bar */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="flex-1 flex items-center bg-white dark:bg-[#1e293b] rounded-2xl px-4 border border-[#dfe3e7] dark:border-slate-700 shadow-sm">
          <span className="material-symbols-outlined text-slate-400 text-xl mr-2">travel_explore</span>
          <input
            type="text"
            placeholder="Search academic theorems, quantum physics, algorithms..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent py-3.5 text-xs text-[#091426] dark:text-white placeholder-[#75777d] focus:outline-none"
          />
        </div>
        <button
          type="submit"
          className="px-6 py-3.5 bg-[#091426] text-white dark:bg-[#feae2c] dark:text-[#091426] font-display font-bold text-xs rounded-2xl hover:opacity-90 transition-all shrink-0 shadow-sm"
        >
          Research Topic
        </button>
      </form>

      {/* Library Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {savedLibrary.map((item) => (
          <div
            key={item.id}
            className="bg-white dark:bg-[#1e293b] rounded-3xl border border-[#dfe3e7] dark:border-slate-700 shadow-sm overflow-hidden hover:border-[#feae2c] transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="h-40 bg-slate-200 dark:bg-slate-800 overflow-hidden relative">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#091426]/80 text-white backdrop-blur-sm">
                  {item.author}
                </span>
              </div>

              <div className="p-5">
                <h3 className="font-display font-bold text-base text-[#091426] dark:text-white group-hover:text-[#835500] dark:group-hover:text-[#feae2c] transition-colors leading-snug">
                  {item.title}
                </h3>
                <p className="text-xs text-[#45474c] dark:text-slate-300 mt-2 line-clamp-3 leading-relaxed">
                  {item.snippet}
                </p>
              </div>
            </div>

            <div className="px-5 pb-5 pt-3 border-t border-[#dfe3e7] dark:border-slate-700 flex items-center justify-between text-xs">
              <span className="text-[11px] text-[#75777d]">{item.date}</span>
              <button
                onClick={() => setSelectedSource(item)}
                className="px-3.5 py-1.5 bg-[#f0f4f8] dark:bg-slate-800 text-[#091426] dark:text-slate-200 font-bold text-xs rounded-full hover:bg-[#feae2c] hover:text-[#091426] transition-colors flex items-center gap-1"
              >
                Inspect Source <span className="material-symbols-outlined text-sm">open_in_new</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Source Details Modal */}
      {selectedSource && (
        <div className="fixed inset-0 z-50 bg-[#091426]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1e293b] rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-[#dfe3e7] dark:border-slate-700 animate-fade-in relative">
            <button
              onClick={() => setSelectedSource(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            <div className="w-12 h-12 rounded-2xl bg-[#feae2c]/20 text-[#835500] dark:text-[#feae2c] flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-2xl">description</span>
            </div>

            <h3 className="font-display font-bold text-xl text-[#091426] dark:text-white">{selectedSource.title}</h3>
            <p className="text-xs font-semibold text-[#835500] dark:text-[#feae2c] mt-1">{selectedSource.author} • Verified Citation</p>

            <div className="mt-4 p-4 rounded-2xl bg-[#f0f4f8] dark:bg-slate-800 text-xs text-[#45474c] dark:text-slate-300 leading-relaxed">
              {selectedSource.snippet}
            </div>

            <div className="mt-6 flex gap-3">
              <a
                href={selectedSource.url}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-3 bg-[#091426] text-white dark:bg-[#feae2c] dark:text-[#091426] font-display font-bold text-xs rounded-full hover:opacity-90 transition-all flex items-center justify-center gap-1"
              >
                Open External Article <span className="material-symbols-outlined text-base">open_in_new</span>
              </a>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

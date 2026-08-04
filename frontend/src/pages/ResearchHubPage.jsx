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
      image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400&q=80',
      cover: '#8EA8D8'
    },
    {
      id: 2,
      title: 'Quantum Wave Interference & Double Slit Optics',
      author: 'Stanford Physics Journal',
      date: '2025',
      snippet: 'Demonstrates wave-particle duality. Photons create interference fringes even when emitted individually.',
      url: 'https://physics.stanford.edu/research/quantum-optics',
      image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&q=80',
      cover: '#E7E1D8'
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
      image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&q=80',
      cover: '#C8CED8'
    };
    setSavedLibrary([newEntry, ...savedLibrary]);
    setQuery('');
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans pb-10">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#D7D4CF]">
        <div>
          <h1 className="font-display font-bold text-2xl text-[#2E2E2E] flex items-center gap-2">
            <span className="material-symbols-outlined text-2xl text-[#6B8FD8]">travel_explore</span>
            AI Research Engine & Saved Library
          </h1>
          <p className="text-xs text-[#767676]">Search web sources, explore research diagrams, and inspect citation metadata</p>
        </div>

        <div className="flex bg-[#F2F1EE] p-1 rounded-full text-xs font-semibold border border-[#D7D4CF]">
          <button
            onClick={() => setActiveTab('library')}
            className={`px-4 py-2 rounded-full transition-all flex items-center gap-1.5 ${
              activeTab === 'library'
                ? 'bg-[#6B8FD8] text-white font-bold shadow-sm'
                : 'text-[#767676]'
            }`}
          >
            <span className="material-symbols-outlined text-base">collections_bookmark</span>
            Saved Library ({savedLibrary.length})
          </button>
          <button
            onClick={() => setActiveTab('search')}
            className={`px-4 py-2 rounded-full transition-all flex items-center gap-1.5 ${
              activeTab === 'search'
                ? 'bg-[#6B8FD8] text-white font-bold shadow-sm'
                : 'text-[#767676]'
            }`}
          >
            <span className="material-symbols-outlined text-base">search</span>
            Academic Search
          </button>
        </div>
      </div>

      {/* Query Search Bar */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="flex-1 flex items-center glass-panel rounded-2xl px-4 border border-[#D7D4CF] shadow-sm">
          <span className="material-symbols-outlined text-[#767676] text-xl mr-2">travel_explore</span>
          <input
            type="text"
            placeholder="Search academic theorems, quantum physics, algorithms..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent py-3.5 text-xs text-[#2E2E2E] placeholder-[#B7B7B7] focus:outline-none"
          />
        </div>
        <button
          type="submit"
          className="px-6 py-3.5 bg-[#6B8FD8] text-white font-display font-semibold text-xs rounded-2xl hover:bg-[#8FB7F5] transition-all shrink-0 shadow-sm"
        >
          Research Topic
        </button>
      </form>

      {/* Library Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {savedLibrary.map((item) => (
          <div
            key={item.id}
            className="glass-panel rounded-3xl border border-[#D7D4CF] shadow-sm overflow-hidden hover:border-[#6B8FD8] transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="h-40 bg-[#F2F1EE] overflow-hidden relative">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#2E2E2E]/80 text-white backdrop-blur-sm">
                  {item.author}
                </span>
              </div>

              <div className="p-5">
                <h3 className="font-display font-bold text-base text-[#2E2E2E] group-hover:text-[#6B8FD8] transition-colors leading-snug">
                  {item.title}
                </h3>
                <p className="text-xs text-[#767676] mt-2 line-clamp-3 leading-relaxed">
                  {item.snippet}
                </p>
              </div>
            </div>

            <div className="px-5 pb-5 pt-3 border-t border-[#D7D4CF] flex items-center justify-between text-xs">
              <span className="text-[11px] text-[#B7B7B7]">{item.date}</span>
              <button
                onClick={() => setSelectedSource(item)}
                className="px-3.5 py-1.5 bg-[#F2F1EE] text-[#2E2E2E] font-semibold text-xs rounded-full hover:bg-[#6B8FD8] hover:text-white transition-colors flex items-center gap-1 border border-[#D7D4CF]"
              >
                Inspect Source <span className="material-symbols-outlined text-sm">open_in_new</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Source Details Modal */}
      {selectedSource && (
        <div className="fixed inset-0 z-50 bg-[#2E2E2E]/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-[#D7D4CF] animate-fade-in relative">
            <button
              onClick={() => setSelectedSource(null)}
              className="absolute top-4 right-4 text-[#767676] hover:text-[#2E2E2E]"
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            <div className="w-12 h-12 rounded-2xl bg-[#6B8FD8]/20 text-[#6B8FD8] flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-2xl">description</span>
            </div>

            <h3 className="font-display font-bold text-xl text-[#2E2E2E]">{selectedSource.title}</h3>
            <p className="text-xs font-semibold text-[#6B8FD8] mt-1">{selectedSource.author} • Verified Citation</p>

            <div className="mt-4 p-4 rounded-2xl bg-[#F2F1EE] border border-[#D7D4CF] text-xs text-[#767676] leading-relaxed">
              {selectedSource.snippet}
            </div>

            <div className="mt-6 flex gap-3">
              <a
                href={selectedSource.url}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-3 bg-[#6B8FD8] text-white font-display font-bold text-xs rounded-full hover:bg-[#8FB7F5] transition-all flex items-center justify-center gap-1"
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

import React, { useState } from 'react';

export default function WebSearchAssistDrawer({ isOpen, onClose, onInsertNote }) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  if (!isOpen) return null;

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);

    setTimeout(() => {
      setResults({
        topic: query,
        summary: `Key summary for "${query}": A foundational mathematical concept involving integration techniques, limit behavior, and real-world geometric volume calculations.`,
        keyPoints: [
          'Fundamental Theorem of Calculus links antiderivatives with area under curves.',
          'Integration by parts formula: ∫u dv = uv - ∫v du',
          'Definite integrals yield numeric scalar values representing net area.',
          'Improper integrals analyze convergence over infinite intervals.'
        ],
        citations: [
          { title: 'Khan Academy - Multivariable Calculus', url: 'https://khanacademy.org' },
          { title: 'MIT OpenCourseWare - 18.01 Single Variable Calculus', url: 'https://ocw.mit.edu' }
        ]
      });
      setLoading(false);
    }, 600);
  };

  const handleInsert = () => {
    if (results && onInsertNote) {
      onInsertNote(`## AI Research Notes: ${results.topic}\n\n${results.summary}\n\nKey Concepts:\n` + results.keyPoints.map(p => `- ${p}`).join('\n'));
      onClose();
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white dark:bg-[#1e293b] shadow-2xl border-l border-[#dfe3e7] dark:border-slate-700 flex flex-col font-sans animate-fade-in">
      {/* Drawer Header */}
      <div className="p-6 border-b border-[#dfe3e7] dark:border-slate-700 flex items-center justify-between bg-[#f6fafe] dark:bg-slate-800/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#feae2c]/20 text-[#835500] dark:text-[#feae2c] flex items-center justify-center">
            <span className="material-symbols-outlined">travel_explore</span>
          </div>
          <div>
            <h3 className="font-display font-bold text-lg text-[#091426] dark:text-white">AI Web Search Assist</h3>
            <p className="text-xs text-[#45474c] dark:text-slate-400">Academic research & note summarization</p>
          </div>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>

      {/* Query Bar */}
      <div className="p-6 border-b border-[#dfe3e7] dark:border-slate-700">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="flex-1 flex items-center bg-[#f0f4f8] dark:bg-slate-800 rounded-xl px-3 border border-[#dfe3e7] dark:border-slate-700">
            <span className="material-symbols-outlined text-slate-400 text-xl mr-2">search</span>
            <input
              type="text"
              placeholder="Search topic (e.g. Fundamental Theorem of Calculus)..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-transparent text-xs text-[#091426] dark:text-white placeholder-[#75777d] focus:outline-none py-2.5"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-4 bg-[#091426] text-white dark:bg-[#feae2c] dark:text-[#091426] font-semibold text-xs rounded-xl hover:opacity-90 transition-all shrink-0"
          >
            {loading ? 'Searching...' : 'Assist'}
          </button>
        </form>
      </div>

      {/* Results View */}
      <div className="flex-1 p-6 overflow-y-auto space-y-6">
        {loading && (
          <div className="py-12 text-center text-xs text-slate-500">
            <div className="w-8 h-8 rounded-full border-2 border-[#feae2c] border-t-transparent animate-spin mx-auto mb-3"></div>
            Analyzing academic references...
          </div>
        )}

        {!loading && !results && (
          <div className="py-12 text-center text-xs text-slate-400">
            <span className="material-symbols-outlined text-4xl mb-2 text-slate-300">find_in_page</span>
            <p>Enter any study topic or theorem above to fetch instant summaries & citations.</p>
          </div>
        )}

        {!loading && results && (
          <div className="space-y-5 animate-fade-in">
            {/* Overview Card */}
            <div className="p-4 rounded-2xl bg-[#f0f4f8] dark:bg-slate-800/60 border border-[#dfe3e7] dark:border-slate-700">
              <h4 className="font-display font-bold text-sm text-[#091426] dark:text-white mb-2">{results.topic}</h4>
              <p className="text-xs text-[#45474c] dark:text-slate-300 leading-relaxed">{results.summary}</p>
            </div>

            {/* Key Bullet Points */}
            <div>
              <h5 className="text-xs font-semibold uppercase tracking-wider text-[#75777d] dark:text-slate-400 mb-2">Key Takeaways</h5>
              <ul className="space-y-2">
                {results.keyPoints.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-[#171c1f] dark:text-slate-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#feae2c] mt-1.5 shrink-0"></span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Academic Citations */}
            <div>
              <h5 className="text-xs font-semibold uppercase tracking-wider text-[#75777d] dark:text-slate-400 mb-2">Verified Sources</h5>
              <div className="space-y-2">
                {results.citations.map((cite, idx) => (
                  <a
                    key={idx}
                    href={cite.url}
                    target="_blank"
                    rel="noreferrer"
                    className="block p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-[#dfe3e7] dark:border-slate-700 hover:border-[#feae2c] text-xs text-[#091426] dark:text-white flex items-center justify-between group transition-colors"
                  >
                    <span className="truncate">{cite.title}</span>
                    <span className="material-symbols-outlined text-base text-slate-400 group-hover:text-[#feae2c]">open_in_new</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Insert CTA */}
      {results && (
        <div className="p-4 border-t border-[#dfe3e7] dark:border-slate-700 bg-[#f8fafc] dark:bg-slate-800">
          <button
            onClick={handleInsert}
            className="w-full py-3 bg-[#feae2c] text-[#091426] font-display font-bold text-xs rounded-xl hover:bg-amber-400 transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            <span className="material-symbols-outlined text-base">add_to_photos</span>
            Insert Research into Notebook Canvas
          </button>
        </div>
      )}
    </div>
  );
}

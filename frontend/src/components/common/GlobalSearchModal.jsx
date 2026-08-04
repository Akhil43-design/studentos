import React, { useState, useEffect } from 'react';
import { Search, BookOpen, PenTool, GraduationCap, X, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { db } from '../../db/indexedDB';

export default function GlobalSearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ notes: [], drawings: [], assignments: [] });
  const [searching, setSearching] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!query.trim()) {
      setResults({ notes: [], drawings: [], assignments: [] });
      return;
    }

    const timer = setTimeout(async () => {
      setSearching(true);
      try {
        if (navigator.onLine) {
          const [nRes, dRes, aRes] = await Promise.all([
            api.get(`/notes?search=${encodeURIComponent(query)}`).catch(() => ({ data: { notes: [] } })),
            api.get(`/drawings?search=${encodeURIComponent(query)}`).catch(() => ({ data: { drawings: [] } })),
            api.get('/assignments').catch(() => ({ data: { assignments: [] } }))
          ]);
          
          setResults({
            notes: nRes.data.notes || [],
            drawings: dRes.data.drawings || [],
            assignments: (aRes.data.assignments || []).filter(a => a.title.toLowerCase().includes(query.toLowerCase()))
          });
        } else {
          // Local IndexedDB search
          const localNotes = await db.notes.filter(n => n.title.toLowerCase().includes(query.toLowerCase())).toArray();
          const localDrawings = await db.drawings.filter(d => d.title.toLowerCase().includes(query.toLowerCase())).toArray();
          setResults({ notes: localNotes, drawings: localDrawings, assignments: [] });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-2xl glass-panel rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-darkblue-900">
        
        {/* Search Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-primary-500" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search notes, canvas drawings, subjects, assignments..."
            className="flex-1 bg-transparent border-none text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none text-base"
          />
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Results Body */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {searching && (
            <p className="text-sm text-slate-500 text-center py-4">Searching SmartSlate repository...</p>
          )}

          {!searching && !query.trim() && (
            <p className="text-xs text-slate-400 text-center py-6">Type a title, subject, or keyword to search instantly.</p>
          )}

          {!searching && query.trim() && (results.notes.length === 0 && results.drawings.length === 0 && results.assignments.length === 0) && (
            <p className="text-sm text-slate-500 text-center py-6">No matching notes or drawings found for "{query}".</p>
          )}

          {/* Notes Results */}
          {results.notes.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                <BookOpen className="w-3.5 h-3.5" /> Notes ({results.notes.length})
              </h4>
              <div className="space-y-1">
                {results.notes.map(note => (
                  <div
                    key={note.id}
                    onClick={() => { navigate(`/notebooks?id=${note.id}`); onClose(); }}
                    className="p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 cursor-pointer flex items-center justify-between group transition-colors"
                  >
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 group-hover:text-primary-500">{note.title}</p>
                      <p className="text-xs text-slate-500 truncate max-w-md">{note.folder || 'General'} • {new Date(note.updated_at).toLocaleDateString()}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Drawings Results */}
          {results.drawings.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                <PenTool className="w-3.5 h-3.5" /> Canvas Drawings ({results.drawings.length})
              </h4>
              <div className="space-y-1">
                {results.drawings.map(drw => (
                  <div
                    key={drw.id}
                    onClick={() => { navigate(`/drawing?id=${drw.id}`); onClose(); }}
                    className="p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 cursor-pointer flex items-center justify-between group transition-colors"
                  >
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 group-hover:text-primary-500">{drw.title}</p>
                      <p className="text-xs text-slate-500">Handwritten Drawing • {new Date(drw.updated_at).toLocaleDateString()}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

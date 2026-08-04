import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import RichTextEditor from '../components/editor/RichTextEditor';
import ShareNotesModal from '../components/common/ShareNotesModal';
import WebSearchAssistDrawer from '../components/common/WebSearchAssistDrawer';
import api from '../services/api';
import { db, queueSyncItem } from '../db/indexedDB';

export default function NotebooksPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const noteIdParam = searchParams.get('id');

  const [notes, setNotes] = useState([]);
  const [activeNote, setActiveNote] = useState(null);
  const [search, setSearch] = useState('');
  const [selectedFolder, setSelectedFolder] = useState('All');
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [aiAssistOpen, setAiAssistOpen] = useState(false);
  const [targetShareTitle, setTargetShareTitle] = useState('');

  const fetchNotes = async () => {
    try {
      if (navigator.onLine) {
        const res = await api.get(`/notes?search=${encodeURIComponent(search)}`);
        const serverNotes = res.data.notes || [];
        setNotes(serverNotes);
        if (serverNotes.length > 0) {
          await db.notes.bulkPut(serverNotes);
        }
      } else {
        let local = await db.notes.toArray();
        if (search) {
          local = local.filter(n => n.title.toLowerCase().includes(search.toLowerCase()));
        }
        setNotes(local);
      }
    } catch (err) {
      console.error(err);
      const local = await db.notes.toArray();
      setNotes(local);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [search]);

  useEffect(() => {
    if (noteIdParam && notes.length > 0) {
      const found = notes.find(n => n.id === noteIdParam);
      if (found) setActiveNote(found);
    }
  }, [noteIdParam, notes]);

  const handleCreateNew = () => {
    const newNote = {
      id: 'nte_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      title: 'Untitled Academic Note',
      content: '<p>Start recording your lecture notes, equations, and references...</p>',
      folder: 'Mathematics',
      tags: ['lesson'],
      is_favorite: false,
      updated_at: new Date().toISOString(),
      syncStatus: 'synced'
    };
    setNotes([newNote, ...notes]);
    setActiveNote(newNote);
  };

  const handleSaveNote = async (updatedData) => {
    if (!activeNote) return;
    const noteId = activeNote.id;

    const fullNoteData = {
      ...activeNote,
      ...updatedData,
      updated_at: new Date().toISOString(),
      syncStatus: navigator.onLine ? 'synced' : 'pending'
    };

    setNotes(notes.map(n => n.id === noteId ? fullNoteData : n));
    setActiveNote(fullNoteData);
    await db.notes.put(fullNoteData);

    if (navigator.onLine) {
      try {
        await api.put(`/notes/${noteId}`, updatedData);
      } catch (err) {
        await queueSyncItem('notes', noteId, 'UPDATE', fullNoteData);
      }
    } else {
      await queueSyncItem('notes', noteId, 'UPDATE', fullNoteData);
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (!confirm('Are you sure you want to delete this notebook note?')) return;
    setNotes(notes.filter(n => n.id !== noteId));
    if (activeNote?.id === noteId) setActiveNote(null);
    await db.notes.delete(noteId);

    if (navigator.onLine) {
      try { await api.delete(`/notes/${noteId}`); } catch (err) { await queueSyncItem('notes', noteId, 'DELETE', {}); }
    } else {
      await queueSyncItem('notes', noteId, 'DELETE', {});
    }
  };

  const handleOpenShare = (title) => {
    setTargetShareTitle(title);
    setShareModalOpen(true);
  };

  const handleInsertAiResearch = (researchText) => {
    if (activeNote) {
      handleSaveNote({
        content: (activeNote.content || '') + '<br/><hr/><br/>' + researchText.replace(/\n/g, '<br/>')
      });
    }
  };

  const folders = ['All', ...new Set(notes.map(n => n.folder || 'General'))];
  const filteredNotes = notes.filter(n => {
    if (selectedFolder !== 'All' && (n.folder || 'General') !== selectedFolder) return false;
    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in font-sans pb-10">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#dfe3e7] dark:border-slate-800">
        <div>
          <h1 className="font-display font-extrabold text-2xl text-[#091426] dark:text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-2xl text-[#835500] dark:text-[#feae2c]">book_5</span>
            Note Library & Canvas
          </h1>
          <p className="text-xs text-[#45474c] dark:text-slate-400">Offline-first digital notebook repository with traffic-light sync</p>
        </div>

        <div className="flex items-center gap-2">
          {activeNote && (
            <button
              onClick={() => { setActiveNote(null); setSearchParams({}); }}
              className="px-4 py-2 rounded-full bg-[#f0f4f8] dark:bg-slate-800 text-xs font-semibold text-[#091426] dark:text-slate-200 hover:bg-[#eaeef2] transition-colors flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-base">arrow_back</span> Back to Library
            </button>
          )}

          <button
            onClick={() => setAiAssistOpen(true)}
            className="px-4 py-2 rounded-full bg-[#feae2c]/20 text-[#835500] dark:text-[#feae2c] font-semibold text-xs border border-[#feae2c]/40 hover:bg-[#feae2c]/30 transition-all flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-base">travel_explore</span> AI Web Assist
          </button>

          <button
            onClick={handleCreateNew}
            className="px-5 py-2 rounded-full bg-[#091426] text-white dark:bg-[#feae2c] dark:text-[#091426] font-display font-bold text-xs shadow-sm hover:opacity-90 transition-all flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-base">add</span> Create New Note
          </button>
        </div>
      </div>

      {activeNote ? (
        <RichTextEditor note={activeNote} onSave={handleSaveNote} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          
          {/* Folders Sidebar */}
          <div className="bg-white dark:bg-[#1e293b] p-4 rounded-3xl border border-[#dfe3e7] dark:border-slate-700 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-[#75777d] dark:text-slate-400 uppercase tracking-wider px-2">Folders</h3>
            <div className="space-y-1">
              {folders.map(f => (
                <button
                  key={f}
                  onClick={() => setSelectedFolder(f)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-all ${
                    selectedFolder === f
                      ? 'bg-[#091426] text-white dark:bg-[#feae2c] dark:text-[#091426] shadow-sm'
                      : 'text-[#45474c] dark:text-slate-300 hover:bg-[#f0f4f8] dark:hover:bg-slate-800'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-base">folder</span> {f}
                  </span>
                  <span className="text-[10px] opacity-80">
                    {f === 'All' ? notes.length : notes.filter(n => (n.folder || 'General') === f).length}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Notes Grid */}
          <div className="md:col-span-3 space-y-4">
            
            {/* Search input */}
            <div className="flex items-center bg-white dark:bg-[#1e293b] rounded-2xl px-4 border border-[#dfe3e7] dark:border-slate-700 shadow-sm">
              <span className="material-symbols-outlined text-slate-400 text-xl mr-2">search</span>
              <input
                type="text"
                placeholder="Search notebooks by topic, title, or folder..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-transparent py-3 text-xs text-[#091426] dark:text-white placeholder-[#75777d] focus:outline-none"
              />
            </div>

            {/* Note Cards Grid */}
            {filteredNotes.length === 0 ? (
              <div className="bg-white dark:bg-[#1e293b] p-12 rounded-3xl text-center border border-[#dfe3e7] dark:border-slate-700 shadow-sm">
                <span className="material-symbols-outlined text-5xl text-slate-300 mb-3">auto_stories</span>
                <p className="font-display font-bold text-base text-[#091426] dark:text-white">No Notes Found</p>
                <p className="text-xs text-[#45474c] dark:text-slate-400 mt-1">Click "Create New Note" to start writing.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredNotes.map((n) => (
                  <div
                    key={n.id}
                    className="bg-white dark:bg-[#1e293b] p-5 rounded-3xl border border-[#dfe3e7] dark:border-slate-700 shadow-sm hover:border-[#feae2c] transition-all group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#f0f4f8] dark:bg-slate-800 text-[#835500] dark:text-[#feae2c]">
                          {n.folder || 'Mathematics'}
                        </span>

                        {/* Sync Traffic Light Badge */}
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#45474c] dark:text-slate-400">
                          <span className={`w-2 h-2 rounded-full ${n.syncStatus === 'pending' ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
                          <span>{n.syncStatus === 'pending' ? 'Pending' : 'Synced'}</span>
                        </div>
                      </div>

                      <h3 className="font-display font-bold text-base text-[#091426] dark:text-white mt-3 group-hover:text-[#835500] dark:group-hover:text-[#feae2c] transition-colors line-clamp-1">
                        {n.title}
                      </h3>

                      <div
                        className="text-xs text-[#45474c] dark:text-slate-300 mt-2 line-clamp-3 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: n.content || 'No preview available' }}
                      />
                    </div>

                    <div className="border-t border-[#dfe3e7] dark:border-slate-700 pt-3 mt-4 flex items-center justify-between text-xs">
                      <span className="text-[11px] text-[#75777d] dark:text-slate-400">
                        {new Date(n.updated_at).toLocaleDateString()}
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenShare(n.title)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-[#091426] dark:hover:text-white hover:bg-[#f0f4f8] transition-colors"
                          title="Share Notebook"
                        >
                          <span className="material-symbols-outlined text-lg">share</span>
                        </button>
                        <button
                          onClick={() => setActiveNote(n)}
                          className="px-3 py-1 bg-[#091426] text-white dark:bg-[#feae2c] dark:text-[#091426] font-bold text-xs rounded-full hover:opacity-90 transition-all"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteNote(n.id)}
                          className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                        >
                          <span className="material-symbols-outlined text-lg">delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        </div>
      )}

      {/* Global Modals */}
      <ShareNotesModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        noteTitle={targetShareTitle}
      />

      <WebSearchAssistDrawer
        isOpen={aiAssistOpen}
        onClose={() => setAiAssistOpen(false)}
        onInsertNote={handleInsertAiResearch}
      />
    </div>
  );
}

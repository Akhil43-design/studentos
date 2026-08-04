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

  const getCoverColor = (folder = '') => {
    const lower = folder.toLowerCase();
    if (lower.includes('math')) return '#8EA8D8';
    if (lower.includes('phy')) return '#E7E1D8';
    if (lower.includes('chem')) return '#C8CED8';
    if (lower.includes('bio')) return '#B8C8A8';
    return '#D9D2C7';
  };

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
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#D7D4CF]">
        <div>
          <h1 className="font-display font-bold text-2xl text-[#2E2E2E] flex items-center gap-2">
            <span className="material-symbols-outlined text-2xl text-[#6B8FD8]">book_5</span>
            Note Library & Subject Notebooks
          </h1>
          <p className="text-xs text-[#767676]">Minimal warm paper-like repository with Notion & Apple aesthetics</p>
        </div>

        <div className="flex items-center gap-2">
          {activeNote && (
            <button
              onClick={() => { setActiveNote(null); setSearchParams({}); }}
              className="px-4 py-2 rounded-full bg-[#F2F1EE] text-xs font-semibold text-[#2E2E2E] hover:bg-[#E7E5E1] transition-colors flex items-center gap-1.5 border border-[#D7D4CF]"
            >
              <span className="material-symbols-outlined text-base">arrow_back</span> Back to Library
            </button>
          )}

          <button
            onClick={() => setAiAssistOpen(true)}
            className="px-4 py-2 rounded-full bg-[#6B8FD8]/15 text-[#6B8FD8] font-semibold text-xs border border-[#6B8FD8]/30 hover:bg-[#6B8FD8]/25 transition-all flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-base">travel_explore</span> AI Web Assist
          </button>

          <button
            onClick={handleCreateNew}
            className="px-5 py-2 rounded-full bg-[#6B8FD8] text-white font-display font-semibold text-xs shadow-sm hover:bg-[#8FB7F5] transition-all flex items-center gap-1.5"
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
          <div className="glass-panel p-4 rounded-3xl border border-[#D7D4CF] shadow-sm space-y-4">
            <h3 className="text-xs font-semibold text-[#767676] uppercase tracking-wider px-2">Folders</h3>
            <div className="space-y-1">
              {folders.map(f => (
                <button
                  key={f}
                  onClick={() => setSelectedFolder(f)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-all ${
                    selectedFolder === f
                      ? 'bg-[#6B8FD8] text-white shadow-sm'
                      : 'text-[#2E2E2E] hover:bg-[#F2F1EE]'
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
            <div className="flex items-center glass-panel rounded-2xl px-4 border border-[#D7D4CF] shadow-sm">
              <span className="material-symbols-outlined text-[#767676] text-xl mr-2">search</span>
              <input
                type="text"
                placeholder="Search notebooks by topic, title, or folder..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-transparent py-3 text-xs text-[#2E2E2E] placeholder-[#B7B7B7] focus:outline-none"
              />
            </div>

            {/* Note Cards Grid */}
            {filteredNotes.length === 0 ? (
              <div className="glass-panel p-12 rounded-3xl text-center border border-[#D7D4CF] shadow-sm">
                <span className="material-symbols-outlined text-5xl text-[#B7B7B7] mb-3">auto_stories</span>
                <p className="font-display font-bold text-base text-[#2E2E2E]">No Notes Found</p>
                <p className="text-xs text-[#767676] mt-1">Click "Create New Note" to start writing.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredNotes.map((n) => {
                  const coverBg = getCoverColor(n.folder);
                  return (
                    <div
                      key={n.id}
                      className="glass-panel rounded-3xl border border-[#D7D4CF] shadow-sm hover:border-[#6B8FD8] transition-all group flex flex-col justify-between overflow-hidden"
                    >
                      {/* Notebook Subject Cover Banner */}
                      <div className="h-4 w-full" style={{ backgroundColor: coverBg }} />

                      <div className="p-5">
                        <div className="flex items-center justify-between gap-2">
                          <span
                            className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full text-[#2E2E2E]"
                            style={{ backgroundColor: coverBg }}
                          >
                            {n.folder || 'Mathematics'}
                          </span>

                          {/* Sync Traffic Light Badge */}
                          <div className="flex items-center gap-1.5 text-[10px] font-semibold text-[#767676]">
                            <span className={`w-2 h-2 rounded-full ${n.syncStatus === 'pending' ? 'bg-[#E8C47A]' : 'bg-[#A8C8A2]'}`}></span>
                            <span>{n.syncStatus === 'pending' ? 'Pending' : 'Synced'}</span>
                          </div>
                        </div>

                        <h3 className="font-display font-bold text-base text-[#2E2E2E] mt-3 group-hover:text-[#6B8FD8] transition-colors line-clamp-1">
                          {n.title}
                        </h3>

                        <div
                          className="text-xs text-[#767676] mt-2 line-clamp-3 leading-relaxed"
                          dangerouslySetInnerHTML={{ __html: n.content || 'No preview available' }}
                        />
                      </div>

                      <div className="border-t border-[#D7D4CF] px-5 py-3 flex items-center justify-between text-xs">
                        <span className="text-[11px] text-[#B7B7B7]">
                          {new Date(n.updated_at).toLocaleDateString()}
                        </span>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleOpenShare(n.title)}
                            className="p-1.5 rounded-lg text-[#767676] hover:text-[#2E2E2E] hover:bg-[#F2F1EE] transition-colors"
                            title="Share Notebook"
                          >
                            <span className="material-symbols-outlined text-lg">share</span>
                          </button>
                          <button
                            onClick={() => setActiveNote(n)}
                            className="px-3 py-1 bg-[#6B8FD8] text-white font-semibold text-xs rounded-full hover:bg-[#8FB7F5] transition-all"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteNote(n.id)}
                            className="p-1.5 rounded-lg text-[#D98989] hover:bg-rose-50 transition-colors"
                          >
                            <span className="material-symbols-outlined text-lg">delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
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

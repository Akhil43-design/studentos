import React, { useState, useRef } from 'react';
import WebSearchAssistDrawer from '../common/WebSearchAssistDrawer';

export default function RichTextEditor({ note, onSave }) {
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  const [folder, setFolder] = useState(note?.folder || 'Mathematics');
  const [isFavorite, setIsFavorite] = useState(note?.is_favorite || false);
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState(note?.tags || ['calculus', 'lecture']);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [aiAssistOpen, setAiAssistOpen] = useState(false);

  const editorRef = useRef(null);

  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value);
  };

  const handleAddTag = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleInsertTable = () => {
    const tableHTML = `<table border="1" style="width:100%; border-collapse:collapse; margin:12px 0;"><tr><th style="padding:8px; border:1px solid #dfe3e7; background:#f0f4f8;">Concept</th><th style="padding:8px; border:1px solid #dfe3e7; background:#f0f4f8;">Formula / Definition</th></tr><tr><td style="padding:8px; border:1px solid #dfe3e7;">Definite Integral</td><td style="padding:8px; border:1px solid #dfe3e7;">∫[a,b] f(x)dx = F(b) - F(a)</td></tr></table><p></p>`;
    execCommand('insertHTML', tableHTML);
  };

  const handleInsertMath = () => {
    const formula = prompt('Enter Math Formula (LaTeX or plain text e.g. ∫ f(x)dx):', '∫ (2x + 5) dx = x² + 5x + C');
    if (formula) {
      const mathHTML = `<span style="background-color:#feae2c20; color:#835500; padding:4px 8px; border-radius:8px; font-family:monospace; font-weight:bold; border:1px solid #feae2c40;">∑ (${formula})</span>&nbsp;`;
      execCommand('insertHTML', mathHTML);
    }
  };

  const handleInsertVoiceNote = () => {
    const audioHTML = `<div style="background:#f0f4f8; padding:10px 14px; border-radius:12px; margin:10px 0; display:inline-flex; align-items:center; gap:8px; border:1px solid #dfe3e7;">🎤 <strong>Voice Audio Note</strong> (Recorded: ${new Date().toLocaleTimeString()})</div><p></p>`;
    execCommand('insertHTML', audioHTML);
  };

  const handleInsertAiResearch = (researchText) => {
    const aiHTML = `<div style="background:#FAF9F5; padding:14px; border-radius:16px; border:1px solid #feae2c; margin:12px 0;">${researchText.replace(/\n/g, '<br/>')}</div><p></p>`;
    execCommand('insertHTML', aiHTML);
  };

  const handleSave = () => {
    const editorContent = editorRef.current ? editorRef.current.innerHTML : content;
    if (onSave) {
      onSave({
        title: title || 'Untitled Academic Note',
        content: editorContent,
        folder,
        tags,
        isFavorite
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2000);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] bg-white dark:bg-[#1e293b] rounded-3xl overflow-hidden border border-[#dfe3e7] dark:border-slate-700 shadow-xl font-sans relative">
      
      {/* Note Header & Metadata */}
      <div className="p-5 border-b border-[#dfe3e7] dark:border-slate-700 space-y-3 bg-[#f8fafc] dark:bg-slate-800/40">
        <div className="flex items-center justify-between gap-4">
          <input
            type="text"
            placeholder="Notebook Title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="flex-1 text-2xl font-display font-extrabold bg-transparent border-none text-[#091426] dark:text-white focus:outline-none placeholder-slate-400"
          />

          <div className="flex items-center gap-2">
            <button
              onClick={() => setAiAssistOpen(true)}
              className="px-3 py-1.5 rounded-full bg-[#feae2c]/20 text-[#835500] dark:text-[#feae2c] font-semibold text-xs border border-[#feae2c]/40 hover:bg-[#feae2c]/30 transition-all flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-base">travel_explore</span>
              AI Assist
            </button>

            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className={`p-2 rounded-full border transition-all ${
                isFavorite ? 'bg-amber-100 text-[#835500] border-amber-300' : 'bg-white dark:bg-slate-800 text-slate-400 border-[#dfe3e7] dark:border-slate-700'
              }`}
            >
              <span className="material-symbols-outlined text-base">star</span>
            </button>

            <button
              onClick={handleSave}
              className="px-5 py-2 rounded-full bg-[#091426] text-white dark:bg-[#feae2c] dark:text-[#091426] font-display font-bold text-xs shadow-sm hover:opacity-90 transition-all flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-base">{savedSuccess ? 'done' : 'save'}</span>
              <span>{savedSuccess ? 'Saved!' : 'Save Note'}</span>
            </button>
          </div>
        </div>

        {/* Tags & Folder bar */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-[#75777d] dark:text-slate-400 font-semibold">Folder:</span>
          <input
            type="text"
            value={folder}
            onChange={(e) => setFolder(e.target.value)}
            className="px-3 py-1 rounded-xl bg-white dark:bg-slate-800 border border-[#dfe3e7] dark:border-slate-700 text-[#091426] dark:text-slate-200 font-bold focus:outline-none"
          />

          <div className="h-4 w-px bg-[#dfe3e7] dark:bg-slate-700 mx-1" />

          {tags.map((t) => (
            <span
              key={t}
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#f0f4f8] dark:bg-slate-800 text-[#835500] dark:text-[#feae2c] font-bold text-[11px]"
            >
              #{t}
              <button onClick={() => handleRemoveTag(t)} className="hover:text-red-500">×</button>
            </span>
          ))}
          <input
            type="text"
            placeholder="+ Add tag (Enter)"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleAddTag}
            className="px-2 py-0.5 bg-transparent text-xs text-[#091426] dark:text-slate-200 focus:outline-none placeholder-slate-400"
          />
        </div>
      </div>

      {/* Editor Formatting Toolbar */}
      <div className="p-2 border-b border-[#dfe3e7] dark:border-slate-700 flex flex-wrap items-center gap-1 bg-white dark:bg-[#1e293b]">
        <button onClick={() => execCommand('bold')} className="p-2 rounded-xl hover:bg-[#f0f4f8] dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold" title="Bold">
          B
        </button>
        <button onClick={() => execCommand('italic')} className="p-2 rounded-xl hover:bg-[#f0f4f8] dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 italic font-bold" title="Italic">
          I
        </button>
        <button onClick={() => execCommand('underline')} className="p-2 rounded-xl hover:bg-[#f0f4f8] dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 underline font-bold" title="Underline">
          U
        </button>

        <div className="h-4 w-px bg-[#dfe3e7] dark:bg-slate-700 mx-1" />

        <button onClick={() => execCommand('insertUnorderedList')} className="p-2 rounded-xl hover:bg-[#f0f4f8] dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300" title="Bullet List">
          <span className="material-symbols-outlined text-lg">format_list_bulleted</span>
        </button>
        <button onClick={() => execCommand('insertOrderedList')} className="p-2 rounded-xl hover:bg-[#f0f4f8] dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300" title="Numbered List">
          <span className="material-symbols-outlined text-lg">format_list_numbered</span>
        </button>

        <div className="h-4 w-px bg-[#dfe3e7] dark:bg-slate-700 mx-1" />

        <button onClick={handleInsertTable} className="p-2 rounded-xl hover:bg-[#f0f4f8] dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300" title="Insert Table">
          <span className="material-symbols-outlined text-lg">table_chart</span>
        </button>
        <button onClick={handleInsertMath} className="p-2 rounded-xl hover:bg-[#f0f4f8] dark:hover:bg-slate-800 text-[#835500] dark:text-[#feae2c]" title="Insert Math Equation">
          <span className="material-symbols-outlined text-lg">functions</span>
        </button>
        <button onClick={handleInsertVoiceNote} className="p-2 rounded-xl hover:bg-[#f0f4f8] dark:hover:bg-slate-800 text-[#835500] dark:text-[#feae2c]" title="Attach Voice Note">
          <span className="material-symbols-outlined text-lg">mic</span>
        </button>
      </div>

      {/* Editable Text Surface */}
      <div className="flex-1 p-6 overflow-y-auto focus:outline-none text-[#091426] dark:text-slate-200 leading-relaxed text-sm bg-white dark:bg-[#1e293b]">
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          dangerouslySetInnerHTML={{ __html: content || '<p>Start recording your lecture notes, equations, and references...</p>' }}
          className="min-h-[400px] outline-none space-y-3"
        />
      </div>

      {/* AI Research Drawer */}
      <WebSearchAssistDrawer
        isOpen={aiAssistOpen}
        onClose={() => setAiAssistOpen(false)}
        onInsertNote={handleInsertAiResearch}
      />

    </div>
  );
}

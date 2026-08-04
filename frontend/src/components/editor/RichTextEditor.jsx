import React, { useState, useRef } from 'react';
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered, 
  Table, 
  Image as ImageIcon, 
  Mic, 
  Calculator, 
  Star, 
  Save, 
  Tag, 
  Paperclip,
  Check
} from 'lucide-react';

export default function RichTextEditor({ note, onSave }) {
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  const [folder, setFolder] = useState(note?.folder || 'General');
  const [isFavorite, setIsFavorite] = useState(note?.is_favorite || false);
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState(note?.tags || ['study', 'notes']);
  const [showVoiceRecorder, setShowVoiceRecorder] = useState(false);
  const [recording, setRecording] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

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
    const tableHTML = `<table border="1" style="width:100%; border-collapse:collapse; margin:10px 0;"><tr><th style="padding:8px; border:1px solid #ccc;">Header 1</th><th style="padding:8px; border:1px solid #ccc;">Header 2</th></tr><tr><td style="padding:8px; border:1px solid #ccc;">Data 1</td><td style="padding:8px; border:1px solid #ccc;">Data 2</td></tr></table><p></p>`;
    execCommand('insertHTML', tableHTML);
  };

  const handleInsertMath = () => {
    const formula = prompt('Enter Math Formula (LaTeX or plain text e.g. E = mc²):', 'f(x) = ax² + bx + c');
    if (formula) {
      const mathHTML = `<span style="background-color:#E0F2FE; color:#0369A1; padding:2px 6px; border-radius:4px; font-family:monospace; font-weight:bold;">∑ (${formula})</span>&nbsp;`;
      execCommand('insertHTML', mathHTML);
    }
  };

  const handleSave = () => {
    const editorContent = editorRef.current ? editorRef.current.innerHTML : content;
    if (onSave) {
      onSave({
        title: title || 'Untitled Note',
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
    <div className="flex flex-col h-[calc(100vh-100px)] glass-panel rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl bg-white dark:bg-darkblue-900">
      
      {/* Note Header & Metadata */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 space-y-3 bg-slate-50/70 dark:bg-slate-900/50">
        <div className="flex items-center justify-between gap-4">
          <input
            type="text"
            placeholder="Note Title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="flex-1 text-2xl font-bold bg-transparent border-none text-slate-900 dark:text-slate-100 focus:outline-none placeholder-slate-400"
          />

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className={`p-2 rounded-xl border transition-all ${isFavorite ? 'bg-amber-100 text-amber-600 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300' : 'bg-white dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700'}`}
              title="Favorite Note"
            >
              <Star className="w-5 h-5 fill-current" />
            </button>

            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-semibold shadow-md shadow-primary-500/25 transition-all text-sm"
            >
              {savedSuccess ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              <span>{savedSuccess ? 'Saved!' : 'Save Note'}</span>
            </button>
          </div>
        </div>

        {/* Tags & Folder bar */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-400 font-medium">Folder:</span>
          <input
            type="text"
            value={folder}
            onChange={(e) => setFolder(e.target.value)}
            className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 focus:outline-none"
          />

          <div className="h-4 w-px bg-slate-300 dark:bg-slate-700 mx-1" />

          <Tag className="w-3.5 h-3.5 text-slate-400" />
          {tags.map((t) => (
            <span
              key={t}
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary-100 dark:bg-primary-950/60 text-primary-700 dark:text-primary-300 font-medium"
            >
              #{t}
              <button onClick={() => handleRemoveTag(t)} className="hover:text-rose-500">×</button>
            </span>
          ))}
          <input
            type="text"
            placeholder="+ Add tag (Enter)"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleAddTag}
            className="px-2 py-0.5 rounded bg-transparent text-slate-600 dark:text-slate-300 focus:outline-none placeholder-slate-400"
          />
        </div>
      </div>

      {/* Editor Formatting Toolbar */}
      <div className="p-2 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center gap-1 bg-white dark:bg-darkblue-900">
        <button onClick={() => execCommand('bold')} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300" title="Bold">
          <Bold className="w-4 h-4" />
        </button>
        <button onClick={() => execCommand('italic')} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300" title="Italic">
          <Italic className="w-4 h-4" />
        </button>
        <button onClick={() => execCommand('underline')} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300" title="Underline">
          <Underline className="w-4 h-4" />
        </button>
        <button onClick={() => execCommand('hiliteColor', '#FEF08A')} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300" title="Highlight Yellow">
          <span className="font-bold bg-yellow-200 text-slate-900 px-1 rounded text-xs">H</span>
        </button>

        <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 mx-1" />

        <button onClick={() => execCommand('insertUnorderedList')} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300" title="Bullet List">
          <List className="w-4 h-4" />
        </button>
        <button onClick={() => execCommand('insertOrderedList')} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300" title="Numbered List">
          <ListOrdered className="w-4 h-4" />
        </button>

        <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 mx-1" />

        <button onClick={handleInsertTable} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300" title="Insert Table">
          <Table className="w-4 h-4" />
        </button>
        <button onClick={handleInsertMath} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300" title="Insert Math Equation">
          <Calculator className="w-4 h-4" />
        </button>

        <button
          onClick={() => {
            const audioHTML = `<div style="background:#F1F5F9; padding:8px 12px; border-radius:8px; margin:8px 0; display:inline-flex; align-items:center; gap:8px;">🎤 <strong>Voice Note</strong> (Recorded: ${new Date().toLocaleTimeString()})</div><p></p>`;
            execCommand('insertHTML', audioHTML);
          }}
          className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-primary-500"
          title="Attach Voice Note"
        >
          <Mic className="w-4 h-4" />
        </button>
      </div>

      {/* Editable Text Surface */}
      <div className="flex-1 p-6 overflow-y-auto focus:outline-none text-slate-800 dark:text-slate-200 leading-relaxed text-base">
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          dangerouslySetInnerHTML={{ __html: content || '<p>Start writing your note content here...</p>' }}
          className="min-h-[400px] outline-none space-y-3"
        />
      </div>

    </div>
  );
}

import React, { useState } from 'react';

export default function ShareNotesModal({ isOpen, onClose, noteTitle = "Mathematics Chapter 4 - Calculus Notes" }) {
  const [permission, setPermission] = useState('view'); // 'view' | 'edit'
  const [copied, setCopied] = useState(false);
  const [collaborators, setCollaborators] = useState([
    { id: 1, name: 'Alex Johnson', email: 'alex.j@smartslate.edu', role: 'Owner' },
    { id: 2, name: 'Prof. Davis', email: 'davis@smartslate.edu', role: 'Editor' },
  ]);
  const [newEmail, setNewEmail] = useState('');

  if (!isOpen) return null;

  const shareUrl = `https://smartslate.edu/share/note_${Math.random().toString(36).substring(2, 9)}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddCollaborator = (e) => {
    e.preventDefault();
    if (!newEmail) return;
    setCollaborators([
      ...collaborators,
      { id: Date.now(), name: newEmail.split('@')[0], email: newEmail, role: permission === 'view' ? 'Viewer' : 'Editor' }
    ]);
    setNewEmail('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#091426]/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#1e293b] rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-[#dfe3e7] dark:border-slate-700 animate-fade-in relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#dfe3e7] dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#feae2c]/20 text-[#835500] dark:text-[#feae2c] flex items-center justify-center">
              <span className="material-symbols-outlined">share</span>
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-[#091426] dark:text-white">Share Notebook</h3>
              <p className="text-xs text-[#45474c] dark:text-slate-400 truncate max-w-[260px]">{noteTitle}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Copy Shareable Link Bar */}
        <div className="mt-6">
          <label className="text-xs font-semibold uppercase tracking-wider text-[#75777d] dark:text-slate-400">Shareable Secret Link</label>
          <div className="mt-2 flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="flex-1 bg-[#f0f4f8] dark:bg-slate-800 border border-[#dfe3e7] dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-[#091426] dark:text-slate-200 focus:outline-none"
            />
            <button
              onClick={handleCopyLink}
              className="px-4 py-2.5 bg-[#091426] text-white dark:bg-[#feae2c] dark:text-[#091426] font-semibold text-xs rounded-xl hover:opacity-90 transition-all flex items-center gap-1 shrink-0"
            >
              <span className="material-symbols-outlined text-base">{copied ? 'done' : 'content_copy'}</span>
              {copied ? 'Copied!' : 'Copy Link'}
            </button>
          </div>
        </div>

        {/* Add Invite Form */}
        <form onSubmit={handleAddCollaborator} className="mt-6">
          <label className="text-xs font-semibold uppercase tracking-wider text-[#75777d] dark:text-slate-400">Invite Classmates or Teachers</label>
          <div className="mt-2 flex items-center gap-2">
            <input
              type="email"
              placeholder="Enter email address..."
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="flex-1 bg-white dark:bg-slate-800 border border-[#dfe3e7] dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs text-[#091426] dark:text-slate-200 focus:outline-none focus:border-[#feae2c]"
            />
            <select
              value={permission}
              onChange={(e) => setPermission(e.target.value)}
              className="bg-[#f0f4f8] dark:bg-slate-800 border border-[#dfe3e7] dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-[#091426] dark:text-slate-200 focus:outline-none"
            >
              <option value="view">Can View</option>
              <option value="edit">Can Edit</option>
            </select>
            <button
              type="submit"
              className="px-4 py-2 bg-[#feae2c] text-[#091426] font-semibold text-xs rounded-xl hover:bg-amber-400 transition-colors shrink-0"
            >
              Invite
            </button>
          </div>
        </form>

        {/* Collaborators Access List */}
        <div className="mt-6">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-[#75777d] dark:text-slate-400 mb-3">People with Access</h4>
          <div className="space-y-2.5 max-h-40 overflow-y-auto pr-1">
            {collaborators.map((person) => (
              <div key={person.id} className="flex items-center justify-between p-2.5 bg-[#f0f4f8] dark:bg-slate-800/60 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#091426] text-white dark:bg-[#feae2c] dark:text-[#091426] font-bold text-xs flex items-center justify-center">
                    {person.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#091426] dark:text-white">{person.name}</p>
                    <p className="text-[10px] text-[#45474c] dark:text-slate-400">{person.email}</p>
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-[#835500] dark:text-[#feae2c] bg-amber-100 dark:bg-amber-950/40 px-2.5 py-1 rounded-md">
                  {person.role}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="mt-6 pt-4 border-t border-[#dfe3e7] dark:border-slate-700 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#091426] text-white dark:bg-[#feae2c] dark:text-[#091426] font-semibold text-xs rounded-full hover:opacity-90 transition-all"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

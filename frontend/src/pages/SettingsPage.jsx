import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useSync } from '../context/SyncContext';
import PinSetupModal from '../components/common/PinSetupModal';
import { db } from '../db/indexedDB';

export default function SettingsPage() {
  const { user, resetPin } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { triggerSync, isSyncing, queueCount } = useSync();

  const [pinModalOpen, setPinModalOpen] = useState(false);
  const [pinSuccess, setPinSuccess] = useState(false);

  const handleSavePin = async (pinStr) => {
    const res = await resetPin({ username: user.username || 'user', email: user.email, newPin: pinStr });
    if (res.success) {
      setPinSuccess(true);
      setTimeout(() => setPinSuccess(false), 3000);
    }
  };

  const handleClearOfflineStorage = async () => {
    if (confirm('Clear local IndexedDB offline storage? All cached notes and drawings will be refreshed from cloud.')) {
      await db.notes.clear();
      await db.drawings.clear();
      await db.syncQueue.clear();
      alert('Local IndexedDB storage reset!');
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans pb-10 max-w-3xl">
      
      {/* Header */}
      <div className="pb-4 border-b border-[#dfe3e7] dark:border-slate-800">
        <h1 className="font-display font-extrabold text-2xl text-[#091426] dark:text-white flex items-center gap-2">
          <span className="material-symbols-outlined text-2xl text-[#835500] dark:text-[#feae2c]">settings</span>
          App Settings & Preferences
        </h1>
        <p className="text-xs text-[#45474c] dark:text-slate-400">Security PIN configuration, theme options, and IndexedDB sync storage</p>
      </div>

      {/* Profile Card */}
      <div className="bg-white dark:bg-[#1e293b] p-6 rounded-3xl border border-[#dfe3e7] dark:border-slate-700 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-[#dfe3e7] dark:border-slate-700 pb-3">
          <h2 className="font-display font-bold text-base text-[#091426] dark:text-white">Academic User Profile</h2>
          <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-[#feae2c] text-[#091426]">
            {user?.role || 'Student'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-[#75777d] dark:text-slate-400 font-semibold block">Full Name</span>
            <p className="font-bold text-[#091426] dark:text-white mt-0.5">{user?.fullName || user?.name || 'Academic User'}</p>
          </div>
          <div>
            <span className="text-[#75777d] dark:text-slate-400 font-semibold block">Username / Email</span>
            <p className="font-bold text-[#091426] dark:text-white mt-0.5">{user?.username} ({user?.email})</p>
          </div>
        </div>
      </div>

      {/* 4-Digit Security PIN Lock */}
      <div className="bg-white dark:bg-[#1e293b] p-6 rounded-3xl border border-[#dfe3e7] dark:border-slate-700 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display font-bold text-base text-[#091426] dark:text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-lg text-[#835500] dark:text-[#feae2c]">lock_reset</span>
              Security PIN Configuration
            </h2>
            <p className="text-xs text-[#45474c] dark:text-slate-400">Lock sensitive notes & private drawing canvas with a 4-digit PIN</p>
          </div>

          <button
            onClick={() => setPinModalOpen(true)}
            className="px-4 py-2 bg-[#091426] text-white dark:bg-[#feae2c] dark:text-[#091426] font-display font-bold text-xs rounded-full hover:opacity-90 transition-all flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-base">pin</span> Configure PIN
          </button>
        </div>

        {pinSuccess && (
          <div className="p-3 rounded-xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 text-xs font-bold text-center flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-base">check_circle</span>
            Security PIN updated successfully!
          </div>
        )}
      </div>

      {/* Theme Preference */}
      <div className="bg-white dark:bg-[#1e293b] p-6 rounded-3xl border border-[#dfe3e7] dark:border-slate-700 shadow-sm flex items-center justify-between">
        <div>
          <h2 className="font-display font-bold text-base text-[#091426] dark:text-white">Theme & Color Palette</h2>
          <p className="text-xs text-[#45474c] dark:text-slate-400">Switch between Slate Light mode and Dark Slate mode</p>
        </div>

        <button
          onClick={toggleTheme}
          className="px-4 py-2 rounded-full bg-[#f0f4f8] dark:bg-slate-800 text-[#091426] dark:text-slate-200 text-xs font-bold hover:bg-slate-200 transition-colors flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-base text-amber-500">{isDark ? 'light_mode' : 'dark_mode'}</span>
          <span>{isDark ? 'Light Slate Theme' : 'Dark Slate Theme'}</span>
        </button>
      </div>

      {/* Offline Storage Sync Manager */}
      <div className="bg-white dark:bg-[#1e293b] p-6 rounded-3xl border border-[#dfe3e7] dark:border-slate-700 shadow-sm space-y-4">
        <div>
          <h2 className="font-display font-bold text-base text-[#091426] dark:text-white">IndexedDB Storage & Cloud Sync</h2>
          <p className="text-xs text-[#45474c] dark:text-slate-400">
            Offline-first status: <span className="font-bold text-[#835500] dark:text-[#feae2c]">{queueCount} pending items</span> in local queue.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={triggerSync}
            disabled={isSyncing}
            className="px-5 py-2.5 rounded-full bg-[#091426] text-white dark:bg-[#feae2c] dark:text-[#091426] font-display font-bold text-xs hover:opacity-90 transition-all flex items-center gap-2 shadow-sm"
          >
            <span className={`material-symbols-outlined text-base ${isSyncing ? 'animate-spin' : ''}`}>sync</span>
            <span>{isSyncing ? 'Syncing Cloud...' : 'Force Cloud Sync Now'}</span>
          </button>

          <button
            onClick={handleClearOfflineStorage}
            className="px-5 py-2.5 rounded-full bg-red-50 text-red-600 dark:bg-red-950/60 dark:text-red-300 font-bold text-xs hover:bg-red-100 transition-all flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-base">delete_forever</span>
            <span>Reset Local IndexedDB</span>
          </button>
        </div>
      </div>

      <PinSetupModal
        isOpen={pinModalOpen}
        onClose={() => setPinModalOpen(false)}
        onSavePin={handleSavePin}
      />
    </div>
  );
}

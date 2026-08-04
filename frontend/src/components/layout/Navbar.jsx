import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import SyncIndicator from './SyncIndicator';
import ThemeToggle from '../common/ThemeToggle';

export default function Navbar({ onOpenSidebar, onOpenSearch, onOpenAiAssist }) {
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <header className="sticky top-0 z-30 w-full bg-white/85 dark:bg-[#091426]/90 backdrop-blur-md border-b border-[#dfe3e7] dark:border-slate-800 transition-colors">
      <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Left: Mobile Menu & Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenSidebar}
            className="p-2 rounded-xl text-[#45474c] dark:text-slate-300 hover:bg-[#f0f4f8] dark:hover:bg-slate-800 md:hidden"
            aria-label="Toggle Sidebar"
          >
            <span className="material-symbols-outlined">menu</span>
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#091426] dark:bg-[#feae2c] flex items-center justify-center text-white dark:text-[#091426] font-display font-extrabold text-lg shadow-sm">
              S
            </div>
            <div className="hidden sm:block">
              <span className="font-display font-extrabold text-lg tracking-tight text-[#091426] dark:text-white">
                SmartSlate
              </span>
              <span className="ml-2 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-[#835500] dark:text-[#feae2c]">
                Offline Studio
              </span>
            </div>
          </div>
        </div>

        {/* Middle: Global Search Trigger */}
        <button
          onClick={onOpenSearch}
          className="flex-1 max-w-md hidden md:flex items-center gap-3 px-4 py-2 rounded-xl bg-[#f0f4f8] dark:bg-slate-800/80 text-[#45474c] dark:text-slate-400 hover:bg-[#eaeef2] dark:hover:bg-slate-800 text-xs font-medium border border-[#dfe3e7] dark:border-slate-700/60 transition-all shadow-inner"
        >
          <span className="material-symbols-outlined text-base">search</span>
          <span>Search notebooks, exams, equations, topics...</span>
          <kbd className="ml-auto text-[10px] font-bold bg-white dark:bg-slate-700 text-slate-500 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-600">
            Ctrl+K
          </kbd>
        </button>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* AI Search Assistant Trigger */}
          <button
            onClick={onOpenAiAssist}
            className="px-3 py-1.5 bg-[#feae2c]/20 hover:bg-[#feae2c]/30 text-[#835500] dark:text-[#feae2c] font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-all border border-[#feae2c]/40"
            title="Open AI Research Assistant"
          >
            <span className="material-symbols-outlined text-base">travel_explore</span>
            <span className="hidden lg:inline">AI Assist</span>
          </button>

          {/* Sync Status Badge */}
          <SyncIndicator />

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Mobile Search Button */}
          <button
            onClick={onOpenSearch}
            className="p-2 rounded-xl text-[#45474c] dark:text-slate-300 hover:bg-[#f0f4f8] dark:hover:bg-slate-800 md:hidden"
          >
            <span className="material-symbols-outlined">search</span>
          </button>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-[#f0f4f8] dark:hover:bg-slate-800 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-[#091426] text-white dark:bg-[#feae2c] dark:text-[#091426] flex items-center justify-center font-bold text-xs shadow-sm">
                {user?.fullName ? user.fullName.charAt(0).toUpperCase() : (user?.name ? user.name.charAt(0).toUpperCase() : 'U')}
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-xs font-bold text-[#091426] dark:text-white leading-tight">
                  {user?.fullName || user?.name || 'Academic User'}
                </p>
                <p className="text-[10px] text-[#45474c] dark:text-slate-400 capitalize">
                  {user?.role || 'Student'}
                </p>
              </div>
            </button>

            {/* Dropdown Menu */}
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#1e293b] rounded-2xl shadow-xl py-2 border border-[#dfe3e7] dark:border-slate-700 animate-fade-in z-50">
                <div className="px-4 py-2 border-b border-[#dfe3e7] dark:border-slate-700">
                  <p className="text-xs font-bold text-[#091426] dark:text-white">{user?.fullName || user?.name}</p>
                  <p className="text-[10px] text-[#45474c] dark:text-slate-400 truncate">{user?.email}</p>
                  <span className="mt-1.5 inline-block text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-[#f0f4f8] dark:bg-slate-800 text-[#835500] dark:text-[#feae2c]">
                    Role: {user?.role || 'Student'}
                  </span>
                </div>
                <button
                  onClick={() => { setShowDropdown(false); logout(); }}
                  className="w-full px-4 py-2 text-left text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-base">logout</span>
                  Sign Out
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}

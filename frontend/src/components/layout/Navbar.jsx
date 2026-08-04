import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import SyncIndicator from './SyncIndicator';
import ThemeToggle from '../common/ThemeToggle';

export default function Navbar({ onOpenSidebar, onOpenSearch, onOpenAiAssist }) {
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <header className="sticky top-0 z-30 w-full bg-[#F7F6F3]/90 dark:bg-[#2C2C2C]/90 backdrop-blur-md border-b border-[#D7D4CF] dark:border-slate-800 transition-colors">
      <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Left: Mobile Menu & Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenSidebar}
            className="p-2 rounded-xl text-[#767676] hover:bg-[#E7E5E1] md:hidden"
            aria-label="Toggle Sidebar"
          >
            <span className="material-symbols-outlined">menu</span>
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#6B8FD8] text-white flex items-center justify-center font-display font-bold text-base shadow-sm">
              S
            </div>
            <div className="hidden sm:block">
              <span className="font-display font-bold text-base tracking-tight text-[#2E2E2E] dark:text-white">
                SmartSlate
              </span>
              <span className="ml-2 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#ECEAE6] text-[#767676] border border-[#D7D4CF]">
                Notion Studio
              </span>
            </div>
          </div>
        </div>

        {/* Middle: Global Search Trigger */}
        <button
          onClick={onOpenSearch}
          className="flex-1 max-w-md hidden md:flex items-center gap-3 px-4 py-2 rounded-xl bg-[#F2F1EE] dark:bg-slate-800/80 text-[#767676] hover:bg-[#ECEAE6] text-xs font-medium border border-[#D7D4CF] transition-all"
        >
          <span className="material-symbols-outlined text-base">search</span>
          <span>Search notebooks, exams, equations, topics...</span>
          <kbd className="ml-auto text-[10px] font-semibold bg-white dark:bg-slate-700 text-[#767676] px-1.5 py-0.5 rounded border border-[#D7D4CF]">
            Ctrl+K
          </kbd>
        </button>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* AI Search Assistant Trigger */}
          <button
            onClick={onOpenAiAssist}
            className="px-3.5 py-1.5 bg-[#6B8FD8]/15 hover:bg-[#6B8FD8]/25 text-[#6B8FD8] font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-all border border-[#6B8FD8]/30"
            title="Open AI Research Assistant"
          >
            <span className="material-symbols-outlined text-base">travel_explore</span>
            <span className="hidden lg:inline">AI Assist</span>
          </button>

          {/* Sync Status Badge */}
          <SyncIndicator />

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-[#F2F1EE] transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-[#6B8FD8] text-white flex items-center justify-center font-bold text-xs shadow-sm">
                {user?.fullName ? user.fullName.charAt(0).toUpperCase() : (user?.name ? user.name.charAt(0).toUpperCase() : 'U')}
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-xs font-bold text-[#2E2E2E] dark:text-white leading-tight">
                  {user?.fullName || user?.name || 'Academic User'}
                </p>
                <p className="text-[10px] text-[#767676] capitalize">
                  {user?.role || 'Student'}
                </p>
              </div>
            </button>

            {/* Dropdown Menu */}
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-56 glass-panel rounded-2xl shadow-xl py-2 border border-[#D7D4CF] animate-fade-in z-50">
                <div className="px-4 py-2 border-b border-[#D7D4CF]">
                  <p className="text-xs font-bold text-[#2E2E2E] dark:text-white">{user?.fullName || user?.name}</p>
                  <p className="text-[10px] text-[#767676] truncate">{user?.email}</p>
                  <span className="mt-1.5 inline-block text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-[#F2F1EE] text-[#6B8FD8] border border-[#D7D4CF]">
                    Role: {user?.role || 'Student'}
                  </span>
                </div>
                <button
                  onClick={() => { setShowDropdown(false); logout(); }}
                  className="w-full px-4 py-2 text-left text-xs font-semibold text-[#D98989] hover:bg-rose-50 flex items-center gap-2"
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

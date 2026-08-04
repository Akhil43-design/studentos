import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Sidebar({ isOpen, onClose }) {
  const { user } = useAuth();

  const getDashboardPath = () => {
    switch (user?.role) {
      case 'teacher': return '/dashboard/teacher';
      case 'parent': return '/dashboard/parent';
      case 'admin': return '/dashboard/admin';
      default: return '/dashboard/student';
    }
  };

  const navItems = [
    { label: 'Welcome Splash', path: '/splash', icon: 'auto_awesome' },
    { label: 'Dashboard', path: getDashboardPath(), icon: 'dashboard' },
    { label: 'Note Library', path: '/notebooks', icon: 'book_5' },
    { label: 'Drawing Studio', path: '/drawing', icon: 'draw' },
    { label: 'Group Chat Rooms', path: '/chat', icon: 'forum', badge: 'New' },
    { label: 'Assignments', path: '/assignments', icon: 'assignment' },
    { label: 'Active Exams', path: '/exams', icon: 'quiz' },
    { label: 'Attendance', path: '/attendance', icon: 'event_available' },
    { label: 'Reports', path: '/reports', icon: 'analytics' },
    { label: 'Settings & PIN', path: '/settings', icon: 'settings' },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 z-40 bg-[#091426]/60 backdrop-blur-sm md:hidden"
        />
      )}

      <aside className={`fixed top-0 left-0 bottom-0 z-50 w-64 bg-white dark:bg-[#1e293b] border-r border-[#dfe3e7] dark:border-slate-800 transition-transform duration-300 ease-in-out md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col font-sans shadow-md`}>
        
        {/* Sidebar Header */}
        <div className="h-16 px-6 flex items-center justify-between border-b border-[#dfe3e7] dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#091426] text-white dark:bg-[#feae2c] dark:text-[#091426] font-display font-extrabold flex items-center justify-center text-base">
              S
            </div>
            <span className="font-display font-extrabold text-lg tracking-tight text-[#091426] dark:text-white">SmartSlate</span>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 md:hidden"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* User Card */}
        <div className="p-4 mx-3 my-3 rounded-2xl bg-[#f0f4f8] dark:bg-slate-800/80 border border-[#dfe3e7] dark:border-slate-700">
          <p className="text-[10px] text-[#75777d] dark:text-slate-400 font-bold uppercase tracking-wider">
            Academic Profile
          </p>
          <p className="text-xs font-bold text-[#091426] dark:text-white truncate mt-0.5">
            {user?.fullName || user?.name || 'User'}
          </p>
          <span className="mt-1.5 inline-block text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-[#feae2c] text-[#091426]">
            {user?.role || 'Student'}
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="px-3 py-2 space-y-1 overflow-y-auto flex-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-[#091426] text-white dark:bg-[#feae2c] dark:text-[#091426] shadow-sm font-bold'
                    : 'text-[#45474c] dark:text-slate-300 hover:bg-[#f0f4f8] dark:hover:bg-slate-800 hover:text-[#091426]'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#feae2c] text-[#091426]">
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer info */}
        <div className="p-4 border-t border-[#dfe3e7] dark:border-slate-800 text-[11px] text-[#75777d] dark:text-slate-400 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            Sync Active
          </span>
          <span className="font-mono text-[10px]">v1.2</span>
        </div>
      </aside>
    </>
  );
}

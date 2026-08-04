import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function SplashPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleQuickRoleStart = async (role) => {
    // Quick demo login for instant access
    await login({
      email: `${role}@smartslate.edu`,
      password: 'password123',
      role: role,
      name: `Demo ${role.charAt(0).toUpperCase() + role.slice(1)}`
    });
    navigate(`/dashboard/${role}`);
  };

  return (
    <div className="min-h-screen bg-[#f6fafe] dark:bg-[#091426] text-[#171c1f] dark:text-[#f0f4f8] flex flex-col font-sans transition-colors duration-300">
      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-[#dfe3e7] dark:border-slate-800 bg-white/70 dark:bg-[#091426]/70 backdrop-blur-md sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#091426] dark:bg-[#feae2c] flex items-center justify-center text-white dark:text-[#091426] font-display font-bold text-xl shadow-md">
            S
          </div>
          <div>
            <h1 className="font-display font-bold text-xl tracking-tight text-[#091426] dark:text-white">SmartSlate</h1>
            <p className="text-xs text-[#45474c] dark:text-slate-400 font-medium">Academic Digital Notebook & LMS</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <Link
              to="/dashboard/student"
              className="px-4 py-2 bg-[#091426] text-white dark:bg-[#feae2c] dark:text-[#091426] text-sm font-semibold rounded-full hover:opacity-90 transition-all shadow-sm flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-base">dashboard</span>
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-semibold text-[#091426] dark:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800 rounded-full transition-colors"
              >
                Log In
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 bg-[#feae2c] text-[#091426] text-sm font-semibold rounded-full hover:bg-amber-400 transition-all shadow-sm"
              >
                Sign Up Free
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-6xl mx-auto px-6 py-12 flex flex-col items-center text-center">
        {/* Status Traffic Light Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-slate-800 border border-[#dfe3e7] dark:border-slate-700 shadow-sm text-xs font-semibold text-[#091426] dark:text-slate-300 mb-8">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          Offline-First & Auto-Cloud Synchronized
        </div>

        <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-[#091426] dark:text-white tracking-tight leading-tight max-w-4xl">
          Academic Precision Meets Fluid Digital Note-Taking
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-[#45474c] dark:text-slate-300 max-w-2xl font-normal leading-relaxed">
          SmartSlate combines instant hand-drawing studio, digital notes, AI web search assistance, live active exams, and role-based learning portals.
        </p>

        {/* Quick Demo Role Cards */}
        <div className="mt-12 w-full">
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#75777d] dark:text-slate-400 mb-6">
            Explore Demo Portals Instantly
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 text-left">
            {/* Student */}
            <button
              onClick={() => handleQuickRoleStart('student')}
              className="p-6 rounded-2xl bg-white dark:bg-[#1e293b] border border-[#dfe3e7] dark:border-slate-700 hover:border-[#feae2c] dark:hover:border-[#feae2c] shadow-sm hover:shadow-lg transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#e4e9ed] dark:bg-slate-700 text-[#091426] dark:text-[#feae2c] flex items-center justify-center mb-4 group-hover:bg-[#feae2c] group-hover:text-[#091426] transition-colors">
                  <span className="material-symbols-outlined text-2xl">school</span>
                </div>
                <h3 className="font-display font-bold text-lg text-[#091426] dark:text-white">Student Portal</h3>
                <p className="text-xs text-[#45474c] dark:text-slate-300 mt-2 leading-relaxed">
                  Note library, active drawing canvas, exams taking & group study chat.
                </p>
              </div>
              <div className="mt-6 flex items-center text-xs font-semibold text-[#835500] dark:text-[#feae2c] group-hover:translate-x-1 transition-transform">
                Launch Portal <span className="material-symbols-outlined text-base ml-1">arrow_forward</span>
              </div>
            </button>

            {/* Teacher */}
            <button
              onClick={() => handleQuickRoleStart('teacher')}
              className="p-6 rounded-2xl bg-white dark:bg-[#1e293b] border border-[#dfe3e7] dark:border-slate-700 hover:border-[#feae2c] dark:hover:border-[#feae2c] shadow-sm hover:shadow-lg transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#e4e9ed] dark:bg-slate-700 text-[#091426] dark:text-[#feae2c] flex items-center justify-center mb-4 group-hover:bg-[#feae2c] group-hover:text-[#091426] transition-colors">
                  <span className="material-symbols-outlined text-2xl">co_present</span>
                </div>
                <h3 className="font-display font-bold text-lg text-[#091426] dark:text-white">Teacher Portal</h3>
                <p className="text-xs text-[#45474c] dark:text-slate-300 mt-2 leading-relaxed">
                  Assignment evaluations, batch announcements & student progress.
                </p>
              </div>
              <div className="mt-6 flex items-center text-xs font-semibold text-[#835500] dark:text-[#feae2c] group-hover:translate-x-1 transition-transform">
                Launch Portal <span className="material-symbols-outlined text-base ml-1">arrow_forward</span>
              </div>
            </button>

            {/* Parent */}
            <button
              onClick={() => handleQuickRoleStart('parent')}
              className="p-6 rounded-2xl bg-white dark:bg-[#1e293b] border border-[#dfe3e7] dark:border-slate-700 hover:border-[#feae2c] dark:hover:border-[#feae2c] shadow-sm hover:shadow-lg transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#e4e9ed] dark:bg-slate-700 text-[#091426] dark:text-[#feae2c] flex items-center justify-center mb-4 group-hover:bg-[#feae2c] group-hover:text-[#091426] transition-colors">
                  <span className="material-symbols-outlined text-2xl">family_restroom</span>
                </div>
                <h3 className="font-display font-bold text-lg text-[#091426] dark:text-white">Parent Portal</h3>
                <p className="text-xs text-[#45474c] dark:text-slate-300 mt-2 leading-relaxed">
                  Attendance logs, performance metrics & direct teacher messaging.
                </p>
              </div>
              <div className="mt-6 flex items-center text-xs font-semibold text-[#835500] dark:text-[#feae2c] group-hover:translate-x-1 transition-transform">
                Launch Portal <span className="material-symbols-outlined text-base ml-1">arrow_forward</span>
              </div>
            </button>

            {/* Admin */}
            <button
              onClick={() => handleQuickRoleStart('admin')}
              className="p-6 rounded-2xl bg-white dark:bg-[#1e293b] border border-[#dfe3e7] dark:border-slate-700 hover:border-[#feae2c] dark:hover:border-[#feae2c] shadow-sm hover:shadow-lg transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#e4e9ed] dark:bg-slate-700 text-[#091426] dark:text-[#feae2c] flex items-center justify-center mb-4 group-hover:bg-[#feae2c] group-hover:text-[#091426] transition-colors">
                  <span className="material-symbols-outlined text-2xl">admin_panel_settings</span>
                </div>
                <h3 className="font-display font-bold text-lg text-[#091426] dark:text-white">Admin Hub</h3>
                <p className="text-xs text-[#45474c] dark:text-slate-300 mt-2 leading-relaxed">
                  System health metrics, user role permissions & database sync.
                </p>
              </div>
              <div className="mt-6 flex items-center text-xs font-semibold text-[#835500] dark:text-[#feae2c] group-hover:translate-x-1 transition-transform">
                Launch Portal <span className="material-symbols-outlined text-base ml-1">arrow_forward</span>
              </div>
            </button>
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="mt-16 w-full pt-12 border-t border-[#dfe3e7] dark:border-slate-800">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-lg bg-[#feae2c]/20 text-[#835500] dark:text-[#feae2c] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined">wifi_off</span>
              </div>
              <div>
                <h4 className="font-display font-bold text-base text-[#091426] dark:text-white">Traffic Light Offline Sync</h4>
                <p className="text-xs text-[#45474c] dark:text-slate-300 mt-1">
                  Notes are stored safely in local storage (Dexie IndexedDB) with real-time green/amber sync indicators.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-lg bg-[#feae2c]/20 text-[#835500] dark:text-[#feae2c] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined">travel_explore</span>
              </div>
              <div>
                <h4 className="font-display font-bold text-base text-[#091426] dark:text-white">AI Web Search Assist</h4>
                <p className="text-xs text-[#45474c] dark:text-slate-300 mt-1">
                  Query research topics, generate key bullet points, and auto-insert references right into your notebook canvas.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-lg bg-[#feae2c]/20 text-[#835500] dark:text-[#feae2c] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined">forum</span>
              </div>
              <div>
                <h4 className="font-display font-bold text-base text-[#091426] dark:text-white">Study Group Discussions</h4>
                <p className="text-xs text-[#45474c] dark:text-slate-300 mt-1">
                  Collaborative chat rooms per subject where students and teachers share handwritten notes and resources.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-xs text-[#75777d] dark:text-slate-500 border-t border-[#dfe3e7] dark:border-slate-800">
        SmartSlate Digital Notebook &copy; {new Date().getFullYear()} — Built with Academic Precision
      </footer>
    </div>
  );
}

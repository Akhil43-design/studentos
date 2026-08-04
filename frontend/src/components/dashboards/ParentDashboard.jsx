import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

export default function ParentDashboard() {
  const { user } = useAuth();

  const childInfo = {
    name: 'Alex Johnson',
    grade: 'Grade 10 - Section A',
    rollNumber: '101',
    attendance: '96.2%',
    examAverage: '92.5%',
    teachers: [
      { name: 'Dr. Sarah Connor', subject: 'Physics & Science', email: 's.connor@smartslate.edu' },
      { name: 'Prof. Alan Turing', subject: 'Mathematics', email: 'a.turing@smartslate.edu' },
    ]
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans pb-10">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#091426] text-white shadow-xl relative overflow-hidden border border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 text-[#835500] dark:text-[#feae2c] text-xs font-bold uppercase tracking-wider mb-2">
            <span className="material-symbols-outlined text-sm">family_restroom</span>
            Parent Progress Portal
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-white">
            Welcome, {user?.fullName || user?.name || 'Mr. Johnson'} 👨‍👩‍👧
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-xl">
            Monitoring academic performance, attendance, and teacher remarks for {childInfo.name}.
          </p>
        </div>
      </div>

      {/* Child Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#1e293b] p-5 rounded-2xl border border-[#dfe3e7] dark:border-slate-700 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-[#75777d] dark:text-slate-400">Student Name</p>
            <p className="text-lg font-display font-extrabold text-[#091426] dark:text-white mt-1">{childInfo.name}</p>
            <p className="text-[10px] text-[#45474c] dark:text-slate-400">{childInfo.grade}</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-[#091426] text-white dark:bg-[#feae2c] dark:text-[#091426] flex items-center justify-center font-bold text-sm">
            {childInfo.name.charAt(0)}
          </div>
        </div>

        <div className="bg-white dark:bg-[#1e293b] p-5 rounded-2xl border border-[#dfe3e7] dark:border-[#dfe3e7] dark:border-slate-700 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-[#75777d] dark:text-slate-400">Overall Attendance</p>
            <p className="text-2xl font-display font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">{childInfo.attendance}</p>
            <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">🟢 Regular Attendance</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">event_available</span>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1e293b] p-5 rounded-2xl border border-[#dfe3e7] dark:border-slate-700 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-[#75777d] dark:text-slate-400">Exam Marks Avg</p>
            <p className="text-2xl font-display font-extrabold text-[#091426] dark:text-white mt-1">{childInfo.examAverage}</p>
            <p className="text-[10px] text-[#835500] dark:text-[#feae2c] font-semibold mt-0.5">Grade A+</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-amber-100 text-[#835500] flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">school</span>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1e293b] p-5 rounded-2xl border border-[#dfe3e7] dark:border-slate-700 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-[#75777d] dark:text-slate-400">Active Notebooks</p>
            <p className="text-2xl font-display font-extrabold text-[#091426] dark:text-white mt-1">12 Notes</p>
            <p className="text-[10px] text-sky-600 font-semibold mt-0.5">Synced to Cloud</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">book_5</span>
          </div>
        </div>
      </div>

      {/* Main Content: Teachers Contact & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Class Teachers List */}
        <div className="bg-white dark:bg-[#1e293b] p-6 rounded-3xl border border-[#dfe3e7] dark:border-slate-700 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#dfe3e7] dark:border-slate-700">
            <h2 className="font-display font-bold text-lg text-[#091426] dark:text-white">Subject Teachers</h2>
            <span className="text-xs text-[#75777d]">Grade 10A Faculty</span>
          </div>

          <div className="space-y-3">
            {childInfo.teachers.map((t, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-[#f0f4f8] dark:bg-slate-800/60 border border-[#dfe3e7] dark:border-slate-700 flex items-center justify-between">
                <div>
                  <h4 className="font-display font-bold text-sm text-[#091426] dark:text-white">{t.name}</h4>
                  <p className="text-xs text-[#45474c] dark:text-slate-400 mt-0.5">{t.subject}</p>
                </div>
                <Link
                  to="/chat"
                  className="px-3.5 py-1.5 bg-[#091426] text-white dark:bg-[#feae2c] dark:text-[#091426] font-bold text-xs rounded-full hover:opacity-90 transition-all flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-sm">chat</span> Message
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Academic Updates Feed */}
        <div className="bg-white dark:bg-[#1e293b] p-6 rounded-3xl border border-[#dfe3e7] dark:border-slate-700 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#dfe3e7] dark:border-slate-700">
            <h2 className="font-display font-bold text-lg text-[#091426] dark:text-white">Recent Student Activity</h2>
            <span className="text-xs text-[#75777d]">Live Sync</span>
          </div>

          <div className="space-y-3">
            <div className="p-3.5 rounded-2xl bg-[#f0f4f8] dark:bg-slate-800/40 border border-[#dfe3e7] dark:border-slate-700 flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0"></span>
              <div>
                <p className="text-xs font-bold text-[#091426] dark:text-white">Calculus Active Exam Completed</p>
                <p className="text-[11px] text-[#45474c] dark:text-slate-400 mt-0.5">Scored 94/100 on Chapter 4 Integration proofs.</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#f0f4f8] dark:bg-slate-800/40 border border-[#dfe3e7] dark:border-slate-700 flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0"></span>
              <div>
                <p className="text-xs font-bold text-[#091426] dark:text-white">New Drawing Canvas Note Added</p>
                <p className="text-[11px] text-[#45474c] dark:text-slate-400 mt-0.5">Created hand-drawn physics optics diagram in Notebooks.</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

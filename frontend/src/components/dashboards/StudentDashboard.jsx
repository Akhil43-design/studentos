import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { db } from '../../db/indexedDB';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [notes, setNotes] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [attendance, setAttendance] = useState({ percentage: 94.2, total: 28, presentCount: 26 });

  useEffect(() => {
    async function loadStudentData() {
      try {
        if (navigator.onLine) {
          const [nRes, aRes] = await Promise.all([
            api.get('/notes?limit=4').catch(() => ({ data: { notes: [] } })),
            api.get('/assignments').catch(() => ({ data: { assignments: [] } }))
          ]);

          setNotes(nRes.data.notes || []);
          setAssignments(aRes.data.assignments || []);
        } else {
          const localNotes = await db.notes.toArray();
          setNotes(localNotes.slice(0, 4));
        }
      } catch (err) {
        console.error(err);
      }
    }
    loadStudentData();
  }, []);

  const todayClasses = [
    { time: '09:00 AM', subject: 'Calculus & Vectors', room: 'Lecture Hall 201', teacher: 'Prof. Alan Turing', badge: 'Active Exam' },
    { time: '11:15 AM', subject: 'Quantum Physics', room: 'Physics Lab 3B', teacher: 'Dr. Sarah Connor', badge: 'Notebook Required' },
    { time: '01:45 PM', subject: 'Computer Science & Algo', room: 'Computer Lab 1', teacher: 'Er. Linus Torvalds', badge: 'Assignment Due' },
  ];

  return (
    <div className="space-y-6 animate-fade-in font-sans pb-10">
      
      {/* Academic Hero Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#091426] text-white shadow-xl relative overflow-hidden border border-slate-800">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-[#feae2c]">
              Academic Precision Portal • Offline Auto-Sync Active
            </span>
          </div>

          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-white">
            Welcome back, {user?.fullName || user?.name || 'Alex'}! 🎓
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-xl leading-relaxed">
            Your notebook library, drawing studio, and active class schedule are ready.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 mt-6">
            <Link
              to="/notebooks"
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#feae2c] text-[#091426] font-display font-bold text-xs hover:bg-amber-400 transition-all shadow-sm"
            >
              <span className="material-symbols-outlined text-base">add</span> New Notebook Note
            </Link>
            <Link
              to="/drawing"
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1e293b] text-white font-semibold text-xs border border-slate-700 hover:border-[#feae2c] transition-all"
            >
              <span className="material-symbols-outlined text-base">draw</span> Launch Drawing Studio
            </Link>
            <Link
              to="/chat"
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1e293b] text-white font-semibold text-xs border border-slate-700 hover:border-[#feae2c] transition-all"
            >
              <span className="material-symbols-outlined text-base">forum</span> Study Group Chat
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Attendance */}
        <div className="bg-white dark:bg-[#1e293b] p-5 rounded-2xl border border-[#dfe3e7] dark:border-slate-700 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-[#75777d] dark:text-slate-400">Attendance Rating</p>
            <p className="text-2xl font-display font-extrabold text-[#091426] dark:text-white mt-1">{attendance.percentage}%</p>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">🟢 Verified Standing</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">event_available</span>
          </div>
        </div>

        {/* Exams Score */}
        <div className="bg-white dark:bg-[#1e293b] p-5 rounded-2xl border border-[#dfe3e7] dark:border-slate-700 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-[#75777d] dark:text-slate-400">Exam Performance</p>
            <p className="text-2xl font-display font-extrabold text-[#091426] dark:text-white mt-1">92.8%</p>
            <p className="text-[11px] font-semibold text-[#835500] dark:text-[#feae2c] mt-0.5">Grade A+ (Rank #3)</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-amber-100 dark:bg-amber-950/50 text-[#835500] dark:text-[#feae2c] flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">school</span>
          </div>
        </div>

        {/* Homework */}
        <div className="bg-white dark:bg-[#1e293b] p-5 rounded-2xl border border-[#dfe3e7] dark:border-slate-700 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-[#75777d] dark:text-slate-400">Pending Homework</p>
            <p className="text-2xl font-display font-extrabold text-[#091426] dark:text-white mt-1">{assignments.length || 2}</p>
            <p className="text-[11px] text-amber-600 font-semibold mt-0.5">🟡 1 Due Tomorrow</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-sky-100 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400 flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">assignment</span>
          </div>
        </div>

        {/* Synced Notes */}
        <div className="bg-white dark:bg-[#1e293b] p-5 rounded-2xl border border-[#dfe3e7] dark:border-slate-700 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-[#75777d] dark:text-slate-400">Notebook Storage</p>
            <p className="text-2xl font-display font-extrabold text-[#091426] dark:text-white mt-1">{notes.length || 5}</p>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">🟢 Auto Synced</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-indigo-100 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">book_5</span>
          </div>
        </div>

      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Class Timetable */}
        <div className="lg:col-span-2 bg-white dark:bg-[#1e293b] p-6 rounded-3xl border border-[#dfe3e7] dark:border-slate-700 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#dfe3e7] dark:border-slate-700">
            <div>
              <h2 className="font-display font-bold text-lg text-[#091426] dark:text-white">Today's Academic Schedule</h2>
              <p className="text-xs text-[#45474c] dark:text-slate-400">Lectures & interactive active exam sessions</p>
            </div>
            <Link to="/exams" className="px-3 py-1 bg-[#feae2c] text-[#091426] font-bold text-xs rounded-full hover:bg-amber-400 transition-colors">
              Active Exam Mode
            </Link>
          </div>

          <div className="space-y-3">
            {todayClasses.map((c, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-[#f0f4f8] dark:bg-slate-800/60 border border-[#dfe3e7] dark:border-slate-700 flex items-center justify-between hover:border-[#feae2c] transition-all"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#091426] text-white dark:bg-[#feae2c] dark:text-[#091426] font-bold text-xs flex items-center justify-center shrink-0">
                    {idx + 1}
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-sm text-[#091426] dark:text-white">{c.subject}</h4>
                    <p className="text-xs text-[#45474c] dark:text-slate-400 mt-0.5">{c.room} • {c.teacher}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold text-[#091426] dark:text-slate-200 block">{c.time}</span>
                  <span className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950/40 text-[#835500] dark:text-[#feae2c] mt-1">
                    {c.badge}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notebook Library Sidebar */}
        <div className="bg-white dark:bg-[#1e293b] p-6 rounded-3xl border border-[#dfe3e7] dark:border-slate-700 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#dfe3e7] dark:border-slate-700">
            <h2 className="font-display font-bold text-lg text-[#091426] dark:text-white">Recent Notebooks</h2>
            <Link to="/notebooks" className="text-xs font-semibold text-[#835500] dark:text-[#feae2c] hover:underline">
              View All
            </Link>
          </div>

          <div className="space-y-3">
            {[
              { id: 1, title: 'Calculus Chapter 4 Proofs', tag: 'Math', date: 'Synced Today', status: 'synced' },
              { id: 2, title: 'Physics Optics Experiment Notes', tag: 'Physics', date: 'Synced Yesterday', status: 'synced' },
              { id: 3, title: 'Data Structures Hand-Drawn Diagrams', tag: 'CS', date: 'Pending Local', status: 'pending' },
            ].map((n) => (
              <Link
                key={n.id}
                to="/notebooks"
                className="block p-3.5 rounded-2xl bg-[#f0f4f8] dark:bg-slate-800/40 border border-[#dfe3e7] dark:border-slate-700 hover:border-[#feae2c] transition-all"
              >
                <div className="flex items-center justify-between">
                  <p className="font-display font-bold text-xs text-[#091426] dark:text-white truncate">{n.title}</p>
                  <span className={`w-2 h-2 rounded-full ${n.status === 'synced' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                </div>
                <div className="flex items-center justify-between mt-2 text-[10px] text-[#45474c] dark:text-slate-400">
                  <span className="px-2 py-0.5 rounded bg-white dark:bg-slate-700 font-semibold">{n.tag}</span>
                  <span>{n.date}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

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
    { time: '09:00 AM', subject: 'Calculus & Vectors', room: 'Lecture Hall 201', teacher: 'Prof. Alan Turing', badge: 'Active Exam', color: '#8EA8D8' },
    { time: '11:15 AM', subject: 'Quantum Physics', room: 'Physics Lab 3B', teacher: 'Dr. Sarah Connor', badge: 'Notebook Required', color: '#E7E1D8' },
    { time: '01:45 PM', subject: 'Computer Science & Algo', room: 'Computer Lab 1', teacher: 'Er. Linus Torvalds', badge: 'Assignment Due', color: '#B8C8A8' },
  ];

  return (
    <div className="space-y-6 animate-fade-in font-sans pb-10">
      
      {/* Academic Hero Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#6B8FD8] text-white shadow-md relative overflow-hidden border border-[#D7D4CF]">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#A8C8A2]"></span>
            <span className="text-xs font-semibold uppercase tracking-wider text-white/90">
              Academic Precision Portal • Offline Auto-Sync Active
            </span>
          </div>

          <h1 className="font-display font-bold text-2xl sm:text-3xl text-white">
            Welcome back, {user?.fullName || user?.name || 'Alex'}! 🎓
          </h1>
          <p className="text-white/80 text-xs sm:text-sm mt-1 max-w-xl leading-relaxed">
            Your notebook library, drawing studio, and active class schedule are ready.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 mt-6">
            <Link
              to="/notebooks"
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-[#2E2E2E] font-semibold text-xs hover:bg-[#F2F1EE] transition-all shadow-sm"
            >
              <span className="material-symbols-outlined text-base">add</span> New Notebook Note
            </Link>
            <Link
              to="/drawing"
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#2E2E2E] text-white font-semibold text-xs border border-white/20 hover:bg-[#4A6EB6] transition-all"
            >
              <span className="material-symbols-outlined text-base">draw</span> Launch Drawing Studio
            </Link>
            <Link
              to="/chat"
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#2E2E2E] text-white font-semibold text-xs border border-white/20 hover:bg-[#4A6EB6] transition-all"
            >
              <span className="material-symbols-outlined text-base">forum</span> Study Group Chat
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Attendance */}
        <div className="glass-panel p-5 rounded-3xl border border-[#D7D4CF] shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-[#767676]">Attendance Rating</p>
            <p className="text-2xl font-display font-bold text-[#2E2E2E] mt-1">{attendance.percentage}%</p>
            <p className="text-[11px] text-[#A8C8A2] font-semibold mt-0.5">🟢 Verified Standing</p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-[#A8C8A2]/20 text-[#2E2E2E] flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">event_available</span>
          </div>
        </div>

        {/* Exams Score */}
        <div className="glass-panel p-5 rounded-3xl border border-[#D7D4CF] shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-[#767676]">Exam Performance</p>
            <p className="text-2xl font-display font-bold text-[#2E2E2E] mt-1">92.8%</p>
            <p className="text-[11px] font-semibold text-[#6B8FD8] mt-0.5">Grade A+ (Rank #3)</p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-[#6B8FD8]/20 text-[#6B8FD8] flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">school</span>
          </div>
        </div>

        {/* Homework */}
        <div className="glass-panel p-5 rounded-3xl border border-[#D7D4CF] shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-[#767676]">Pending Homework</p>
            <p className="text-2xl font-display font-bold text-[#2E2E2E] mt-1">{assignments.length || 2}</p>
            <p className="text-[11px] text-[#E8C47A] font-semibold mt-0.5">🟡 1 Due Tomorrow</p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-[#E8C47A]/20 text-[#2E2E2E] flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">assignment</span>
          </div>
        </div>

        {/* Synced Notes */}
        <div className="glass-panel p-5 rounded-3xl border border-[#D7D4CF] shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-[#767676]">Notebook Storage</p>
            <p className="text-2xl font-display font-bold text-[#2E2E2E] mt-1">{notes.length || 5}</p>
            <p className="text-[11px] text-[#A8C8A2] font-semibold mt-0.5">🟢 Auto Synced</p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-[#8FB7F5]/20 text-[#6B8FD8] flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">book_5</span>
          </div>
        </div>

      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Class Timetable */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-3xl border border-[#D7D4CF] shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#D7D4CF]">
            <div>
              <h2 className="font-display font-bold text-lg text-[#2E2E2E]">Today's Academic Schedule</h2>
              <p className="text-xs text-[#767676]">Lectures & interactive active exam sessions</p>
            </div>
            <Link to="/exams" className="px-3.5 py-1.5 bg-[#6B8FD8] text-white font-semibold text-xs rounded-full hover:bg-[#8FB7F5] transition-colors">
              Active Exam Mode
            </Link>
          </div>

          <div className="space-y-3">
            {todayClasses.map((c, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-[#F2F1EE] border border-[#D7D4CF] flex items-center justify-between hover:border-[#6B8FD8] transition-all"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#6B8FD8] text-white font-bold text-xs flex items-center justify-center shrink-0">
                    {idx + 1}
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-sm text-[#2E2E2E]">{c.subject}</h4>
                    <p className="text-xs text-[#767676] mt-0.5">{c.room} • {c.teacher}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold text-[#2E2E2E] block">{c.time}</span>
                  <span className="inline-block text-[10px] font-semibold px-2.5 py-0.5 rounded text-[#2E2E2E] mt-1" style={{ backgroundColor: c.color }}>
                    {c.badge}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notebook Library Sidebar */}
        <div className="glass-panel p-6 rounded-3xl border border-[#D7D4CF] shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#D7D4CF]">
            <h2 className="font-display font-bold text-lg text-[#2E2E2E]">Recent Notebooks</h2>
            <Link to="/notebooks" className="text-xs font-semibold text-[#6B8FD8] hover:underline">
              View All
            </Link>
          </div>

          <div className="space-y-3">
            {[
              { id: 1, title: 'Calculus Chapter 4 Proofs', tag: 'Mathematics', date: 'Synced Today', status: 'synced', color: '#8EA8D8' },
              { id: 2, title: 'Physics Optics Experiment Notes', tag: 'Physics', date: 'Synced Yesterday', status: 'synced', color: '#E7E1D8' },
              { id: 3, title: 'Data Structures Hand-Drawn Diagrams', tag: 'CS', date: 'Pending Local', status: 'pending', color: '#C8CED8' },
            ].map((n) => (
              <Link
                key={n.id}
                to="/notebooks"
                className="block p-3.5 rounded-2xl bg-[#F2F1EE] border border-[#D7D4CF] hover:border-[#6B8FD8] transition-all"
              >
                <div className="flex items-center justify-between">
                  <p className="font-display font-bold text-xs text-[#2E2E2E] truncate">{n.title}</p>
                  <span className={`w-2 h-2 rounded-full ${n.status === 'synced' ? 'bg-[#A8C8A2]' : 'bg-[#E8C47A]'}`}></span>
                </div>
                <div className="flex items-center justify-between mt-2 text-[10px] text-[#767676]">
                  <span className="px-2 py-0.5 rounded font-semibold text-[#2E2E2E]" style={{ backgroundColor: n.color }}>{n.tag}</span>
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

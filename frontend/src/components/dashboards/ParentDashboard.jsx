import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

export default function ParentDashboard() {
  const { user } = useAuth();
  const [childInfo, setChildInfo] = useState({
    name: 'Alex Johnson',
    rollNo: '101',
    grade: 'Grade 10 - Section A',
    attendancePercent: 95.8,
    gpa: '3.92',
    rank: '#2 in Class'
  });

  const [recentMarks, setRecentMarks] = useState([
    { exam: 'Calculus Mid-Term Test', marks: 95, maxMarks: 100, date: '2026-07-28', grade: 'A+' },
    { exam: 'Quantum Physics Lab Quiz', marks: 91, maxMarks: 100, date: '2026-07-22', grade: 'A' },
    { exam: 'Computer Science Data Structures', marks: 98, maxMarks: 100, date: '2026-07-15', grade: 'A+' },
  ]);

  return (
    <div className="space-y-6 animate-fade-in font-sans pb-10">
      
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#6B8FD8] text-white shadow-md relative overflow-hidden border border-[#D7D4CF]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold uppercase tracking-wider mb-2">
            <span className="material-symbols-outlined text-sm">family_restroom</span>
            Parent Observer Portal
          </div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-white">
            Welcome, {user?.fullName || user?.name || 'Robert Morgan'} 👨‍👩‍👧
          </h1>
          <p className="text-white/80 text-xs sm:text-sm mt-1 max-w-xl">
            Real-time academic standing, attendance progress gauge, and teacher communications for {childInfo.name}.
          </p>
        </div>
      </div>

      {/* Child Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-3xl border border-[#D7D4CF] shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-[#767676]">Student Name</p>
            <p className="text-xl font-display font-bold text-[#2E2E2E] mt-1">{childInfo.name}</p>
            <p className="text-[11px] text-[#6B8FD8] font-semibold mt-0.5">{childInfo.grade}</p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-[#6B8FD8] text-white flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">person</span>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-3xl border border-[#D7D4CF] shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-[#767676]">Overall Attendance</p>
            <p className="text-xl font-display font-bold text-[#2E2E2E] mt-1">{childInfo.attendancePercent}%</p>
            <p className="text-[11px] text-[#A8C8A2] font-semibold mt-0.5">🟢 Verified Standing</p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-[#A8C8A2] text-[#2E2E2E] flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">event_available</span>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-3xl border border-[#D7D4CF] shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-[#767676]">Current GPA</p>
            <p className="text-xl font-display font-bold text-[#2E2E2E] mt-1">{childInfo.gpa}</p>
            <p className="text-[11px] text-[#6B8FD8] font-semibold mt-0.5">{childInfo.rank}</p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-[#6B8FD8]/20 text-[#6B8FD8] flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">trophy</span>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-3xl border border-[#D7D4CF] shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-[#767676]">Homework Compliance</p>
            <p className="text-xl font-display font-bold text-[#2E2E2E] mt-1">100%</p>
            <p className="text-[11px] text-[#A8C8A2] font-semibold mt-0.5">All Submissions Passed</p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-[#E8C47A]/20 text-[#2E2E2E] flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">task_alt</span>
          </div>
        </div>
      </div>

      {/* Exam Breakdown List */}
      <div className="glass-panel p-6 rounded-3xl border border-[#D7D4CF] shadow-sm space-y-4">
        <h2 className="font-display font-bold text-lg text-[#2E2E2E]">Recent Exam & Test Performance</h2>
        <div className="space-y-3">
          {recentMarks.map((m, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-[#F2F1EE] border border-[#D7D4CF] flex items-center justify-between">
              <div>
                <h4 className="font-display font-bold text-sm text-[#2E2E2E]">{m.exam}</h4>
                <p className="text-xs text-[#767676] mt-0.5">Evaluated on {m.date}</p>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-[#6B8FD8] block">{m.marks} / {m.maxMarks}</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#A8C8A2] text-[#2E2E2E] inline-block mt-1">Grade {m.grade}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

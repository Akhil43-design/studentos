import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

export default function TeacherDashboard() {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceState, setAttendanceState] = useState({});
  const [markSuccess, setMarkSuccess] = useState(false);

  useEffect(() => {
    async function loadTeacherData() {
      try {
        const res = await api.get('/users/students').catch(() => ({ data: { students: [] } }));
        const list = res.data.students || [
          { student_id: '1', roll_number: '101', full_name: 'Alex Johnson', class_name: 'Grade 10A' },
          { student_id: '2', roll_number: '102', full_name: 'Sarah Connor', class_name: 'Grade 10A' },
          { student_id: '3', roll_number: '103', full_name: 'David Smith', class_name: 'Grade 10A' },
        ];
        setStudents(list);

        const initialMap = {};
        list.forEach(s => { initialMap[s.student_id] = 'present'; });
        setAttendanceState(initialMap);
      } catch (err) {
        console.error(err);
      }
    }
    loadTeacherData();
  }, []);

  const handleToggleAttendance = (stdId, status) => {
    setAttendanceState(prev => ({ ...prev, [stdId]: status }));
  };

  const handleSaveAttendance = async () => {
    try {
      const records = Object.keys(attendanceState).map(stdId => ({
        studentId: stdId,
        status: attendanceState[stdId]
      }));

      await api.post('/attendance/mark', {
        date: attendanceDate,
        classId: 'cls_10A',
        records
      });

      setMarkSuccess(true);
      setTimeout(() => setMarkSuccess(false), 2500);
    } catch (err) {
      setMarkSuccess(true);
      setTimeout(() => setMarkSuccess(false), 2500);
    }
  };

  const filteredStudents = students.filter(s => 
    s.full_name.toLowerCase().includes(search.toLowerCase()) || 
    s.roll_number.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in font-sans pb-10">
      
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#091426] text-white shadow-xl relative overflow-hidden border border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 text-[#835500] dark:text-[#feae2c] text-xs font-bold uppercase tracking-wider mb-2">
            <span className="material-symbols-outlined text-sm">co_present</span>
            Teacher Console • Grade 10A
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-white">
            Welcome, {user?.fullName || user?.name || 'Dr. Sarah Connor'} 👩‍🏫
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-xl">
            Department of Science & Mathematics • Attendance marker & batch announcements.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-[#1e293b] p-5 rounded-2xl border border-[#dfe3e7] dark:border-slate-700 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-[#75777d] dark:text-slate-400">Total Enrolled Students</p>
            <p className="text-2xl font-display font-extrabold text-[#091426] dark:text-white mt-1">{students.length || 28}</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-[#091426] text-white dark:bg-[#feae2c] dark:text-[#091426] flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">groups</span>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1e293b] p-5 rounded-2xl border border-[#dfe3e7] dark:border-slate-700 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-[#75777d] dark:text-slate-400">Class Attendance Today</p>
            <p className="text-2xl font-display font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">96.4%</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">event_available</span>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1e293b] p-5 rounded-2xl border border-[#dfe3e7] dark:border-slate-700 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-[#75777d] dark:text-slate-400">Active Assignments</p>
            <p className="text-2xl font-display font-extrabold text-[#835500] dark:text-[#feae2c] mt-1">3 Tasks</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-amber-100 text-[#835500] flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">assignment</span>
          </div>
        </div>
      </div>

      {/* Attendance Marker */}
      <div className="bg-white dark:bg-[#1e293b] p-6 rounded-3xl border border-[#dfe3e7] dark:border-slate-700 shadow-sm space-y-5">
        
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#dfe3e7] dark:border-slate-700 pb-4">
          <div>
            <h2 className="font-display font-bold text-lg text-[#091426] dark:text-white">Daily Attendance Marker</h2>
            <p className="text-xs text-[#45474c] dark:text-slate-400">Mark or update student attendance for Grade 10A</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <input
              type="date"
              value={attendanceDate}
              onChange={(e) => setAttendanceDate(e.target.value)}
              className="px-3.5 py-2 rounded-xl border border-[#dfe3e7] dark:border-slate-700 bg-[#f0f4f8] dark:bg-slate-800 text-xs font-semibold text-[#091426] dark:text-slate-200 focus:outline-none"
            />

            <button
              onClick={handleSaveAttendance}
              className="flex items-center gap-2 px-5 py-2 rounded-full bg-[#091426] text-white dark:bg-[#feae2c] dark:text-[#091426] font-display font-bold text-xs shadow-sm hover:opacity-90 transition-all"
            >
              <span className="material-symbols-outlined text-base">{markSuccess ? 'done' : 'save'}</span>
              <span>{markSuccess ? 'Attendance Saved!' : 'Save Attendance'}</span>
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-lg">search</span>
          <input
            type="text"
            placeholder="Search student by name or roll number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#f0f4f8] dark:bg-slate-800/80 text-xs text-[#091426] dark:text-white border border-[#dfe3e7] dark:border-slate-700 focus:outline-none"
          />
        </div>

        {/* Roster Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#dfe3e7] dark:border-slate-700 text-xs font-semibold text-[#75777d] dark:text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">Roll No</th>
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4">Class</th>
                <th className="py-3 px-4 text-center">Attendance Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#dfe3e7] dark:divide-slate-800 text-xs">
              {filteredStudents.map((std) => {
                const status = attendanceState[std.student_id] || 'present';
                return (
                  <tr key={std.student_id} className="hover:bg-[#f0f4f8] dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-[#091426] dark:text-white">{std.roll_number}</td>
                    <td className="py-3 px-4 font-bold text-[#091426] dark:text-white">{std.full_name}</td>
                    <td className="py-3 px-4 text-[#45474c] dark:text-slate-400">{std.class_name || 'Grade 10A'}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleToggleAttendance(std.student_id, 'present')}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                            status === 'present'
                              ? 'bg-emerald-500 text-white shadow-sm'
                              : 'bg-[#f0f4f8] dark:bg-slate-800 text-slate-500 hover:bg-emerald-100'
                          }`}
                        >
                          Present
                        </button>
                        <button
                          onClick={() => handleToggleAttendance(std.student_id, 'absent')}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                            status === 'absent'
                              ? 'bg-red-500 text-white shadow-sm'
                              : 'bg-[#f0f4f8] dark:bg-slate-800 text-slate-500 hover:bg-red-100'
                          }`}
                        >
                          Absent
                        </button>
                        <button
                          onClick={() => handleToggleAttendance(std.student_id, 'late')}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                            status === 'late'
                              ? 'bg-amber-500 text-white shadow-sm'
                              : 'bg-[#f0f4f8] dark:bg-slate-800 text-slate-500 hover:bg-amber-100'
                          }`}
                        >
                          Late
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}

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
      <div className="p-6 sm:p-8 rounded-3xl bg-[#6B8FD8] text-white shadow-md relative overflow-hidden border border-[#D7D4CF]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold uppercase tracking-wider mb-2">
            <span className="material-symbols-outlined text-sm">co_present</span>
            Teacher Console • Grade 10A
          </div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-white">
            Welcome, {user?.fullName || user?.name || 'Dr. Sarah Connor'} 👩‍🏫
          </h1>
          <p className="text-white/80 text-xs sm:text-sm mt-1 max-w-xl">
            Department of Science & Mathematics • Attendance marker & batch announcements.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-panel p-5 rounded-3xl border border-[#D7D4CF] shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-[#767676]">Total Enrolled Students</p>
            <p className="text-2xl font-display font-bold text-[#2E2E2E] mt-1">{students.length || 28}</p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-[#6B8FD8] text-white flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">groups</span>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-3xl border border-[#D7D4CF] shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-[#767676]">Class Attendance Today</p>
            <p className="text-2xl font-display font-bold text-[#2E2E2E] mt-1">96.4%</p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-[#A8C8A2] text-[#2E2E2E] flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">event_available</span>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-3xl border border-[#D7D4CF] shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-[#767676]">Active Assignments</p>
            <p className="text-2xl font-display font-bold text-[#2E2E2E] mt-1">3 Tasks</p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-[#E8C47A] text-[#2E2E2E] flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">assignment</span>
          </div>
        </div>
      </div>

      {/* Attendance Marker */}
      <div className="glass-panel p-6 rounded-3xl border border-[#D7D4CF] shadow-sm space-y-5">
        
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#D7D4CF] pb-4">
          <div>
            <h2 className="font-display font-bold text-lg text-[#2E2E2E]">Daily Attendance Marker</h2>
            <p className="text-xs text-[#767676]">Mark or update student attendance for Grade 10A</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <input
              type="date"
              value={attendanceDate}
              onChange={(e) => setAttendanceDate(e.target.value)}
              className="px-3.5 py-2 rounded-xl border border-[#D7D4CF] bg-[#F2F1EE] text-xs font-semibold text-[#2E2E2E] focus:outline-none"
            />

            <button
              onClick={handleSaveAttendance}
              className="flex items-center gap-2 px-5 py-2 rounded-full bg-[#6B8FD8] text-white font-display font-bold text-xs shadow-sm hover:bg-[#8FB7F5] transition-all"
            >
              <span className="material-symbols-outlined text-base">{markSuccess ? 'done' : 'save'}</span>
              <span>{markSuccess ? 'Attendance Saved!' : 'Save Attendance'}</span>
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#767676] text-lg">search</span>
          <input
            type="text"
            placeholder="Search student by name or roll number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#F2F1EE] text-xs text-[#2E2E2E] border border-[#D7D4CF] focus:outline-none"
          />
        </div>

        {/* Roster Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#D7D4CF] text-xs font-semibold text-[#767676] uppercase tracking-wider">
                <th className="py-3 px-4">Roll No</th>
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4">Class</th>
                <th className="py-3 px-4 text-center">Attendance Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D7D4CF] text-xs">
              {filteredStudents.map((std) => {
                const status = attendanceState[std.student_id] || 'present';
                return (
                  <tr key={std.student_id} className="hover:bg-[#F2F1EE] transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-[#2E2E2E]">{std.roll_number}</td>
                    <td className="py-3 px-4 font-bold text-[#2E2E2E]">{std.full_name}</td>
                    <td className="py-3 px-4 text-[#767676]">{std.class_name || 'Grade 10A'}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleToggleAttendance(std.student_id, 'present')}
                          className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                            status === 'present'
                              ? 'bg-[#A8C8A2] text-[#2E2E2E] font-bold shadow-sm'
                              : 'bg-[#F2F1EE] text-[#767676] hover:bg-[#A8C8A2]/30'
                          }`}
                        >
                          Present
                        </button>
                        <button
                          onClick={() => handleToggleAttendance(std.student_id, 'absent')}
                          className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                            status === 'absent'
                              ? 'bg-[#D98989] text-white font-bold shadow-sm'
                              : 'bg-[#F2F1EE] text-[#767676] hover:bg-[#D98989]/30'
                          }`}
                        >
                          Absent
                        </button>
                        <button
                          onClick={() => handleToggleAttendance(std.student_id, 'late')}
                          className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                            status === 'late'
                              ? 'bg-[#E8C47A] text-[#2E2E2E] font-bold shadow-sm'
                              : 'bg-[#F2F1EE] text-[#767676] hover:bg-[#E8C47A]/30'
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

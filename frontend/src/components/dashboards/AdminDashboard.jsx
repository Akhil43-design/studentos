import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [userList, setUserList] = useState([]);
  const [systemStats, setSystemStats] = useState({
    status: 'Online',
    dbSize: '2.4 MB',
    piCpuTemp: '42.1°C',
    ramUsage: '48.2 MB / 512 MB',
    socketConnections: 3
  });

  useEffect(() => {
    async function loadAdminData() {
      try {
        const res = await api.get('/users').catch(() => ({ data: { users: [] } }));
        setUserList(res.data.users || [
          { id: 1, full_name: 'Alex Johnson', username: 'student', email: 'student@smartslate.edu', role: 'student' },
          { id: 2, full_name: 'Dr. Sarah Connor', username: 'teacher', email: 'teacher@smartslate.edu', role: 'teacher' },
          { id: 3, full_name: 'Mr. Johnson', username: 'parent', email: 'parent@smartslate.edu', role: 'parent' },
          { id: 4, full_name: 'System Admin', username: 'admin', email: 'admin@smartslate.edu', role: 'admin' },
        ]);
      } catch (err) {
        console.error(err);
      }
    }
    loadAdminData();
  }, []);

  return (
    <div className="space-y-6 animate-fade-in font-sans pb-10">
      
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#091426] text-white shadow-xl relative overflow-hidden border border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold uppercase tracking-wider mb-2 border border-rose-500/30">
            <span className="material-symbols-outlined text-sm">admin_panel_settings</span>
            System Administrator Console
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-white">
            SmartSlate Hardware & SQLite Diagnostics 🛡️
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-xl">
            Monitoring local Raspberry Pi Zero 2 W Node.js server, SQLite DB size, active sockets, and user roles.
          </p>
        </div>
      </div>

      {/* Hardware Telemetry Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white dark:bg-[#1e293b] p-5 rounded-2xl border border-[#dfe3e7] dark:border-slate-700 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-[#75777d] dark:text-slate-400">Pi Zero 2 W Status</p>
            <p className="text-xl font-display font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">● {systemStats.status}</p>
            <p className="text-[10px] text-[#45474c] dark:text-slate-400 mt-0.5">ARM64 • Lite OS (Kiosk)</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">memory</span>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1e293b] p-5 rounded-2xl border border-[#dfe3e7] dark:border-slate-700 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-[#75777d] dark:text-slate-400">Node Heap RAM</p>
            <p className="text-xl font-display font-extrabold text-[#091426] dark:text-white mt-1">{systemStats.ramUsage}</p>
            <p className="text-[10px] text-[#835500] dark:text-[#feae2c] font-semibold mt-0.5">Capped at 128MB</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-amber-100 text-[#835500] flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">speed</span>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1e293b] p-5 rounded-2xl border border-[#dfe3e7] dark:border-slate-700 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-[#75777d] dark:text-slate-400">SQLite Database Size</p>
            <p className="text-xl font-display font-extrabold text-[#091426] dark:text-white mt-1">{systemStats.dbSize}</p>
            <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">WAL Mode Active</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-[#091426] text-white dark:bg-[#feae2c] dark:text-[#091426] flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">database</span>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1e293b] p-5 rounded-2xl border border-[#dfe3e7] dark:border-slate-700 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-[#75777d] dark:text-slate-400">Pi Thermal Sensor</p>
            <p className="text-xl font-display font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">{systemStats.piCpuTemp}</p>
            <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">Optimal Thermal</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">thermostat</span>
          </div>
        </div>

      </div>

      {/* User Accounts Table */}
      <div className="bg-white dark:bg-[#1e293b] p-6 rounded-3xl border border-[#dfe3e7] dark:border-slate-700 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#dfe3e7] dark:border-slate-700 pb-3">
          <div>
            <h2 className="font-display font-bold text-lg text-[#091426] dark:text-white">User Accounts Registry</h2>
            <p className="text-xs text-[#45474c] dark:text-slate-400">System user accounts and access credentials</p>
          </div>

          <button className="px-4 py-2 rounded-full bg-[#091426] text-white dark:bg-[#feae2c] dark:text-[#091426] font-display font-bold text-xs shadow-sm flex items-center gap-1.5">
            <span className="material-symbols-outlined text-base">person_add</span> Provision Account
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#dfe3e7] dark:border-slate-700 text-xs font-semibold text-[#75777d] dark:text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">Full Name</th>
                <th className="py-3 px-4">Username</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#dfe3e7] dark:divide-slate-800 text-xs font-semibold">
              {userList.map((u) => (
                <tr key={u.id} className="hover:bg-[#f0f4f8] dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-[#091426] dark:text-white">{u.full_name}</td>
                  <td className="py-3.5 px-4 font-mono text-[#091426] dark:text-slate-300">{u.username}</td>
                  <td className="py-3.5 px-4 text-[#45474c] dark:text-slate-400">{u.email}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#f0f4f8] dark:bg-slate-800 text-[#835500] dark:text-[#feae2c]">
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button className="text-xs font-bold text-[#835500] dark:text-[#feae2c] hover:underline">
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

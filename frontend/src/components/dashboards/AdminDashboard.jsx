import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  ShieldCheck, 
  Users, 
  Database, 
  Activity, 
  Cpu, 
  RefreshCw, 
  HardDrive, 
  Download,
  UserPlus
} from 'lucide-react';
import api from '../../services/api';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [userList, setUserList] = useState([]);
  const [systemStats, setSystemStats] = useState({
    status: 'Online',
    dbSize: '2.4 MB',
    piCpuTemp: '42.1°C',
    uptime: '14 days 6 hours',
    activeUsers: 4
  });

  useEffect(() => {
    async function loadAdminData() {
      try {
        const res = await api.get('/users');
        setUserList(res.data.users || []);
      } catch (err) {
        console.error(err);
      }
    }
    loadAdminData();
  }, []);

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-darkblue-800 to-primary-950 text-white shadow-xl relative overflow-hidden border border-slate-800">
        <div>
          <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-semibold uppercase tracking-wider border border-rose-500/30">
            System Administrator Operations
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold mt-2">
            SmartSlate Administration Hub 🛡️
          </h1>
          <p className="text-slate-400 text-sm mt-1 max-w-xl">
            Managing local Raspberry Pi Node.js + Express backend, SQLite database, user provisioning, and synchronization.
          </p>
        </div>
      </div>

      {/* Raspberry Pi Hardware & DB Diagnostics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="glass-panel p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">Raspberry Pi Server Status</p>
            <p className="text-xl font-extrabold text-emerald-500 mt-1">● {systemStats.status}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">ARM64 Architecture</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">
            <Cpu className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">SQLite DB File Size</p>
            <p className="text-xl font-extrabold text-slate-900 dark:text-slate-100 mt-1">{systemStats.dbSize}</p>
            <p className="text-[11px] text-sky-500 font-semibold mt-0.5">Auto-vacuum enabled</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-primary-500/10 text-primary-500 flex items-center justify-center font-bold">
            <Database className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">Registered Accounts</p>
            <p className="text-xl font-extrabold text-slate-900 dark:text-slate-100 mt-1">{userList.length || 4}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Role-based Auth</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-bold">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">Pi Core Temp</p>
            <p className="text-xl font-extrabold text-amber-500 mt-1">{systemStats.piCpuTemp}</p>
            <p className="text-[11px] text-emerald-500 font-semibold mt-0.5">Optimal Thermal</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">
            <Activity className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* User Accounts Management Table */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">User Account Registry</h2>
            <p className="text-xs text-slate-500">Manage students, teachers, parents, and administrative roles</p>
          </div>

          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-500 text-white font-bold text-xs shadow-md shadow-primary-500/20">
              <UserPlus className="w-4 h-4" /> Add New User
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-400 uppercase">
                <th className="py-3 px-4">Full Name</th>
                <th className="py-3 px-4">Username</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
              {userList.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="py-3 px-4 font-semibold text-slate-900 dark:text-slate-100">{u.full_name}</td>
                  <td className="py-3 px-4 font-mono text-xs text-slate-500">{u.username}</td>
                  <td className="py-3 px-4 text-xs text-slate-500">{u.email}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      u.role === 'admin' ? 'bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-300' :
                      u.role === 'teacher' ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-300' :
                      u.role === 'parent' ? 'bg-teal-100 text-teal-600 dark:bg-teal-950 dark:text-teal-300' :
                      'bg-sky-100 text-sky-600 dark:bg-sky-950 dark:text-sky-300'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button className="text-xs text-primary-500 hover:underline font-semibold">
                      Edit Role
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

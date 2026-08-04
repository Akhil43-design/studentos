import React, { useState, useEffect } from 'react';
import { Bell, CheckCheck, Info } from 'lucide-react';
import api from '../services/api';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    async function loadNotifications() {
      try {
        const res = await api.get('/notifications');
        setNotifications(res.data.notifications || []);
      } catch (err) {
        console.error(err);
      }
    }
    loadNotifications();
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await api.put('/notifications/all/read');
      setNotifications(notifications.map(n => ({ ...n, is_read: 1 })));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Bell className="w-6 h-6 text-primary-500" /> Notifications & Alerts
          </h1>
          <p className="text-xs text-slate-500">System announcements, assignment alerts, and teacher messages</p>
        </div>

        <button
          onClick={handleMarkAllRead}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200"
        >
          <CheckCheck className="w-4 h-4 text-emerald-500" /> Mark All as Read
        </button>
      </div>

      <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
        {notifications.length === 0 ? (
          <div className="p-4 rounded-2xl bg-sky-50 dark:bg-slate-800/40 border border-sky-100 dark:border-slate-700 flex items-start gap-3">
            <Info className="w-5 h-5 text-primary-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-slate-100">Welcome to SmartSlate!</p>
              <p className="text-xs text-slate-500 mt-1">Your offline digital notebook is synchronized with the local Raspberry Pi server.</p>
              <span className="text-[10px] text-slate-400 mt-2 block">Today</span>
            </div>
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              className={`p-4 rounded-2xl border transition-colors ${
                n.is_read ? 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800' : 'bg-primary-50/50 dark:bg-slate-800 border-primary-200 dark:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{n.title}</p>
                <span className="text-[10px] text-slate-400">{new Date(n.created_at).toLocaleTimeString()}</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">{n.message}</p>
            </div>
          ))
        )}
      </div>

    </div>
  );
}

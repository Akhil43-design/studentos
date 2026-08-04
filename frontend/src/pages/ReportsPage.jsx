import React from 'react';
import { FileText, Download, FileSpreadsheet, Printer } from 'lucide-react';
import api from '../services/api';

export default function ReportsPage() {
  const downloadReport = (type, format) => {
    const token = localStorage.getItem('smartslate_token');
    const url = `/api/reports/${type}?format=${format}`;
    
    // Trigger file download
    fetch(url, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.blob())
      .then(blob => {
        const fileUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = fileUrl;
        a.download = `smartslate_${type}_report.${format}`;
        a.click();
      })
      .catch(err => alert('Download error: ' + err.message));
  };

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <FileText className="w-6 h-6 text-primary-500" /> Export Reports & Analytics
        </h1>
        <p className="text-xs text-slate-500">Generate PDF and CSV reports for attendance, exam scorecards, and notes</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Attendance Reports */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Attendance Report</h2>
          <p className="text-xs text-slate-500">Includes student roll numbers, presence count, and monthly status logs.</p>
          
          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={() => downloadReport('attendance', 'pdf')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-500 text-white font-bold text-xs shadow-md shadow-primary-500/20"
            >
              <Download className="w-4 h-4" /> Download PDF
            </button>
            <button
              onClick={() => downloadReport('attendance', 'csv')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-500" /> Export CSV
            </button>
          </div>
        </div>

        {/* Exam Marks Reports */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Exam Marks Scorecards</h2>
          <p className="text-xs text-slate-500">Subject-wise marks, max scores, percentages, and teacher comments.</p>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={() => downloadReport('marks', 'csv')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-500 text-white font-bold text-xs shadow-md shadow-primary-500/20"
            >
              <FileSpreadsheet className="w-4 h-4" /> Export Marks CSV
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FileCheck, Plus, Upload, CheckCircle, Clock, FileText } from 'lucide-react';
import api from '../services/api';

export default function AssignmentsPage() {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [dueDate, setDueDate] = useState('');

  useEffect(() => {
    async function loadAssignments() {
      try {
        const res = await api.get('/assignments');
        setAssignments(res.data.assignments || []);
      } catch (err) {
        console.error(err);
      }
    }
    loadAssignments();
  }, []);

  const handleCreateAssignment = async (e) => {
    e.preventDefault();
    try {
      await api.post('/assignments', {
        title: newTitle,
        description: newDesc,
        subjectId: 'sbj_phy',
        classId: 'cls_10A',
        dueDate: dueDate || new Date(Date.now() + 7 * 86400000).toISOString()
      });
      alert('Assignment published successfully!');
      setShowCreateModal(false);
      const res = await api.get('/assignments');
      setAssignments(res.data.assignments || []);
    } catch (err) {
      alert('Error: ' + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <FileCheck className="w-6 h-6 text-primary-500" /> Homework & Assignments Hub
          </h1>
          <p className="text-xs text-slate-500">Track deadlines, submit attachments, and receive teacher evaluation</p>
        </div>

        {(user?.role === 'teacher' || user?.role === 'admin') && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-bold text-xs shadow-md shadow-primary-500/25 transition-all"
          >
            <Plus className="w-4 h-4" /> Publish New Assignment
          </button>
        )}
      </div>

      {/* Assignments List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {assignments.length === 0 ? (
          <div className="md:col-span-2 glass-panel p-12 rounded-3xl text-center border border-slate-200 dark:border-slate-800">
            <FileCheck className="w-12 h-12 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">No active assignments</p>
          </div>
        ) : (
          assignments.map((a) => (
            <div
              key={a.id}
              className="glass-panel p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-primary-100 dark:bg-primary-950 text-primary-600 dark:text-primary-300">
                    {a.subject_name || 'Physics'}
                  </span>
                  <span className="text-xs font-semibold text-amber-500 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> Due: {new Date(a.due_date).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mt-2">{a.title}</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{a.description || 'Complete exercises and attach notes.'}</p>
              </div>

              <div className="border-t border-slate-100 dark:border-slate-800 pt-3 mt-4 flex items-center justify-between text-xs">
                <span className="text-slate-400">Max Marks: {a.max_marks || 100}</span>
                
                {user?.role === 'student' ? (
                  <button
                    onClick={() => alert('Assignment submitted!')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary-500 text-white font-bold text-xs"
                  >
                    <Upload className="w-3.5 h-3.5" /> Submit Work
                  </button>
                ) : (
                  <span className="text-emerald-500 font-semibold">Active Assignment</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal for Teacher to Publish */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-lg glass-panel p-6 rounded-3xl bg-white dark:bg-darkblue-900 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Publish New Homework/Assignment</h2>
            
            <form onSubmit={handleCreateAssignment} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-500">Assignment Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500">Description / Instructions</label>
                <textarea
                  rows="3"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500">Due Date</label>
                <input
                  type="date"
                  required
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-primary-500 text-white text-xs font-bold shadow-md shadow-primary-500/25"
                >
                  Publish Now
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function GradingPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('queue'); // 'queue' | 'grading' | 'released'
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [score, setScore] = useState(92);
  const [feedback, setFeedback] = useState('Excellent calculus integration proofs! Minor step missing on question 3.');
  const [releasedList, setReleasedList] = useState([]);

  const pendingSubmissions = [
    {
      id: 'sub_1',
      studentName: 'Alex Johnson',
      rollNo: '101',
      assignmentTitle: 'Calculus Chapter 4 - Integration Proofs',
      subject: 'Mathematics',
      submittedAt: 'Today at 09:30 AM',
      status: 'pending_review',
      score: 92,
      maxScore: 100,
      noteSnippet: '∫ f(x)dx = F(b) - F(a) verified using the Fundamental Theorem of Calculus...'
    },
    {
      id: 'sub_2',
      studentName: 'Sarah Connor',
      rollNo: '102',
      assignmentTitle: 'Quantum Optics Lab Report',
      subject: 'Physics',
      submittedAt: 'Yesterday at 04:15 PM',
      status: 'pending_review',
      score: 88,
      maxScore: 100,
      noteSnippet: 'Light wave interference pattern diagrams and refractive index measurement logs...'
    },
    {
      id: 'sub_3',
      studentName: 'David Smith',
      rollNo: '103',
      assignmentTitle: 'Data Structures & Binary Search Trees',
      subject: 'Computer Science',
      submittedAt: '2 days ago',
      status: 'pending_review',
      score: 95,
      maxScore: 100,
      noteSnippet: 'BST insertion, deletion, and in-order traversal C++ code implementation...'
    }
  ];

  const handleStartGrading = (sub) => {
    setSelectedSubmission(sub);
    setScore(sub.score);
    setActiveTab('grading');
  };

  const handlePublishGrade = () => {
    if (!selectedSubmission) return;
    const published = {
      ...selectedSubmission,
      finalScore: score,
      feedback: feedback,
      releasedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setReleasedList([published, ...releasedList]);
    setActiveTab('released');
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans pb-10">
      
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#dfe3e7] dark:border-slate-800">
        <div>
          <h1 className="font-display font-extrabold text-2xl text-[#091426] dark:text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-2xl text-[#835500] dark:text-[#feae2c]">fact_check</span>
            Assignment Grading & Review Queue
          </h1>
          <p className="text-xs text-[#45474c] dark:text-slate-400">Evaluate student notebook submissions, rubric feedback, and score publishing</p>
        </div>

        {/* View Tabs */}
        <div className="flex bg-[#f0f4f8] dark:bg-slate-800 p-1 rounded-full text-xs font-semibold">
          <button
            onClick={() => setActiveTab('queue')}
            className={`px-4 py-2 rounded-full transition-all flex items-center gap-1.5 ${
              activeTab === 'queue'
                ? 'bg-[#091426] text-white dark:bg-[#feae2c] dark:text-[#091426] font-bold shadow-sm'
                : 'text-[#45474c] dark:text-slate-300'
            }`}
          >
            <span className="material-symbols-outlined text-base">rate_review</span>
            Review Queue ({pendingSubmissions.length})
          </button>
          <button
            onClick={() => setActiveTab('released')}
            className={`px-4 py-2 rounded-full transition-all flex items-center gap-1.5 ${
              activeTab === 'released'
                ? 'bg-[#091426] text-white dark:bg-[#feae2c] dark:text-[#091426] font-bold shadow-sm'
                : 'text-[#45474c] dark:text-slate-300'
            }`}
          >
            <span className="material-symbols-outlined text-base">published_with_changes</span>
            Grades Released ({releasedList.length})
          </button>
        </div>
      </div>

      {activeTab === 'queue' && (
        /* Submissions Review Queue Grid */
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {pendingSubmissions.map((sub) => (
              <div
                key={sub.id}
                className="bg-white dark:bg-[#1e293b] p-6 rounded-3xl border border-[#dfe3e7] dark:border-slate-700 shadow-sm hover:border-[#feae2c] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-[#835500] dark:text-[#feae2c]">
                      {sub.subject}
                    </span>
                    <span className="text-[10px] text-slate-400">{sub.submittedAt}</span>
                  </div>

                  <h3 className="font-display font-bold text-base text-[#091426] dark:text-white leading-snug">
                    {sub.assignmentTitle}
                  </h3>

                  <div className="mt-3 p-3 rounded-2xl bg-[#f0f4f8] dark:bg-slate-800/60 border border-[#dfe3e7] dark:border-slate-700 text-xs text-[#45474c] dark:text-slate-300">
                    <p className="font-bold text-[#091426] dark:text-white mb-1">Student: {sub.studentName} (Roll #{sub.rollNo})</p>
                    <p className="line-clamp-2 text-[11px] italic">"{sub.noteSnippet}"</p>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-[#dfe3e7] dark:border-slate-700 flex items-center justify-between">
                  <span className="text-xs font-bold text-[#835500] dark:text-[#feae2c]">Draft Score: {sub.score}/100</span>
                  <button
                    onClick={() => handleStartGrading(sub)}
                    className="px-4 py-2 bg-[#091426] text-white dark:bg-[#feae2c] dark:text-[#091426] font-display font-bold text-xs rounded-full hover:opacity-90 transition-all flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-base">edit_note</span> Grade Submission
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'grading' && selectedSubmission && (
        /* Detailed Interactive Grading Canvas View */
        <div className="bg-white dark:bg-[#1e293b] rounded-3xl border border-[#dfe3e7] dark:border-slate-700 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-3">
          
          {/* Submission Preview Column */}
          <div className="lg:col-span-2 p-6 sm:p-8 border-r border-[#dfe3e7] dark:border-slate-700 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#dfe3e7] dark:border-slate-700">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#feae2c]">{selectedSubmission.subject}</span>
                <h2 className="font-display font-bold text-xl text-[#091426] dark:text-white">{selectedSubmission.assignmentTitle}</h2>
                <p className="text-xs text-[#45474c] dark:text-slate-400 mt-0.5">Submitted by {selectedSubmission.studentName} (Roll #{selectedSubmission.rollNo})</p>
              </div>
              <button
                onClick={() => setActiveTab('queue')}
                className="px-3 py-1.5 rounded-full bg-[#f0f4f8] dark:bg-slate-800 text-xs font-semibold text-slate-500"
              >
                Back to Queue
              </button>
            </div>

            {/* Simulated Handwritten Notebook Submission */}
            <div className="p-6 rounded-2xl bg-[#faf9f5] dark:bg-slate-900 border border-[#dfe3e7] dark:border-slate-800 min-h-[300px] text-xs font-mono leading-relaxed space-y-4">
              <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 text-[#835500] dark:text-[#feae2c]">
                ✍️ Student Handwritten Note Entry:
              </div>
              <p>{selectedSubmission.noteSnippet}</p>
              <p>Step 1: Evaluate ∫ (2x + 5) dx = x² + 5x + C</p>
              <p>Step 2: Apply bounds [0, 4] &rarr; (4² + 5(4)) - (0) = 16 + 20 = 36</p>
            </div>
          </div>

          {/* Rubric Evaluation Panel */}
          <div className="p-6 sm:p-8 space-y-6 bg-[#f8fafc] dark:bg-slate-800/40">
            <h3 className="font-display font-bold text-base text-[#091426] dark:text-white">Grading & Rubric Evaluation</h3>

            {/* Score Input */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#75777d]">Numerical Score (/100)</label>
              <input
                type="number"
                max="100"
                min="0"
                value={score}
                onChange={(e) => setScore(Number(e.target.value))}
                className="w-full mt-2 px-4 py-3 rounded-2xl bg-white dark:bg-slate-800 text-xl font-display font-extrabold text-[#091426] dark:text-white border border-[#dfe3e7] dark:border-slate-700 focus:outline-none focus:border-[#feae2c]"
              />
            </div>

            {/* Feedback Comments */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#75777d]">Teacher Feedback Remarks</label>
              <textarea
                rows="4"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="w-full mt-2 p-3.5 rounded-2xl bg-white dark:bg-slate-800 text-xs text-[#091426] dark:text-white border border-[#dfe3e7] dark:border-slate-700 focus:outline-none focus:border-[#feae2c]"
              />
            </div>

            <button
              onClick={handlePublishGrade}
              className="w-full py-3.5 bg-[#091426] text-white dark:bg-[#feae2c] dark:text-[#091426] font-display font-bold text-xs rounded-full shadow-md hover:opacity-90 transition-all flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-base">send</span>
              Publish Grade & Notify Student
            </button>
          </div>
        </div>
      )}

      {activeTab === 'released' && (
        /* Released Grades Log */
        <div className="bg-white dark:bg-[#1e293b] p-6 rounded-3xl border border-[#dfe3e7] dark:border-slate-700 shadow-sm space-y-4">
          <h2 className="font-display font-bold text-lg text-[#091426] dark:text-white">Published Scorecards</h2>
          {releasedList.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">No grades published in this session yet.</p>
          ) : (
            <div className="space-y-3">
              {releasedList.map((r, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-[#f0f4f8] dark:bg-slate-800/60 border border-[#dfe3e7] dark:border-slate-700 flex items-center justify-between">
                  <div>
                    <h4 className="font-display font-bold text-sm text-[#091426] dark:text-white">{r.studentName} • {r.assignmentTitle}</h4>
                    <p className="text-xs text-[#45474c] dark:text-slate-400 mt-0.5">Remarks: "{r.feedback}"</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 block">{r.finalScore}/100</span>
                    <span className="text-[10px] text-slate-400">Released {r.releasedAt}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
}

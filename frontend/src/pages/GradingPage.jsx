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
      noteSnippet: '∫ f(x)dx = F(b) - F(a) verified using the Fundamental Theorem of Calculus...',
      color: '#8EA8D8'
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
      noteSnippet: 'Light wave interference pattern diagrams and refractive index measurement logs...',
      color: '#E7E1D8'
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
      noteSnippet: 'BST insertion, deletion, and in-order traversal C++ code implementation...',
      color: '#C8CED8'
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
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#D7D4CF]">
        <div>
          <h1 className="font-display font-bold text-2xl text-[#2E2E2E] flex items-center gap-2">
            <span className="material-symbols-outlined text-2xl text-[#6B8FD8]">fact_check</span>
            Assignment Grading & Review Queue
          </h1>
          <p className="text-xs text-[#767676]">Evaluate student notebook submissions, rubric feedback, and score publishing</p>
        </div>

        {/* View Tabs */}
        <div className="flex bg-[#F2F1EE] p-1 rounded-full text-xs font-semibold border border-[#D7D4CF]">
          <button
            onClick={() => setActiveTab('queue')}
            className={`px-4 py-2 rounded-full transition-all flex items-center gap-1.5 ${
              activeTab === 'queue'
                ? 'bg-[#6B8FD8] text-white font-bold shadow-sm'
                : 'text-[#767676]'
            }`}
          >
            <span className="material-symbols-outlined text-base">rate_review</span>
            Review Queue ({pendingSubmissions.length})
          </button>
          <button
            onClick={() => setActiveTab('released')}
            className={`px-4 py-2 rounded-full transition-all flex items-center gap-1.5 ${
              activeTab === 'released'
                ? 'bg-[#6B8FD8] text-white font-bold shadow-sm'
                : 'text-[#767676]'
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
                className="glass-panel p-6 rounded-3xl border border-[#D7D4CF] shadow-sm hover:border-[#6B8FD8] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span
                      className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full text-[#2E2E2E]"
                      style={{ backgroundColor: sub.color }}
                    >
                      {sub.subject}
                    </span>
                    <span className="text-[10px] text-[#B7B7B7]">{sub.submittedAt}</span>
                  </div>

                  <h3 className="font-display font-bold text-base text-[#2E2E2E] leading-snug">
                    {sub.assignmentTitle}
                  </h3>

                  <div className="mt-3 p-3 rounded-2xl bg-[#F2F1EE] border border-[#D7D4CF] text-xs text-[#767676]">
                    <p className="font-bold text-[#2E2E2E] mb-1">Student: {sub.studentName} (Roll #{sub.rollNo})</p>
                    <p className="line-clamp-2 text-[11px] italic">"{sub.noteSnippet}"</p>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-[#D7D4CF] flex items-center justify-between">
                  <span className="text-xs font-bold text-[#6B8FD8]">Draft Score: {sub.score}/100</span>
                  <button
                    onClick={() => handleStartGrading(sub)}
                    className="px-4 py-2 bg-[#6B8FD8] text-white font-display font-semibold text-xs rounded-full hover:bg-[#8FB7F5] transition-all flex items-center gap-1 shadow-sm"
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
        <div className="glass-panel rounded-3xl border border-[#D7D4CF] shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-3">
          
          {/* Submission Preview Column */}
          <div className="lg:col-span-2 p-6 sm:p-8 border-r border-[#D7D4CF] space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#D7D4CF]">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#6B8FD8]">{selectedSubmission.subject}</span>
                <h2 className="font-display font-bold text-xl text-[#2E2E2E]">{selectedSubmission.assignmentTitle}</h2>
                <p className="text-xs text-[#767676] mt-0.5">Submitted by {selectedSubmission.studentName} (Roll #{selectedSubmission.rollNo})</p>
              </div>
              <button
                onClick={() => setActiveTab('queue')}
                className="px-3 py-1.5 rounded-full bg-[#F2F1EE] text-xs font-semibold text-[#767676] border border-[#D7D4CF]"
              >
                Back to Queue
              </button>
            </div>

            {/* Simulated Handwritten Notebook Submission */}
            <div className="p-6 rounded-2xl bg-[#F7F6F3] border border-[#D7D4CF] min-h-[300px] text-xs font-mono leading-relaxed space-y-4 text-[#2E2E2E]">
              <div className="p-3 bg-[#E7E1D8] rounded-xl border border-[#D7D4CF] text-[#2E2E2E] font-bold">
                ✍️ Student Handwritten Note Entry:
              </div>
              <p>{selectedSubmission.noteSnippet}</p>
              <p>Step 1: Evaluate ∫ (2x + 5) dx = x² + 5x + C</p>
              <p>Step 2: Apply bounds [0, 4] &rarr; (4² + 5(4)) - (0) = 16 + 20 = 36</p>
            </div>
          </div>

          {/* Rubric Evaluation Panel */}
          <div className="p-6 sm:p-8 space-y-6 bg-[#F2F1EE]">
            <h3 className="font-display font-bold text-base text-[#2E2E2E]">Grading & Rubric Evaluation</h3>

            {/* Score Input */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-[#767676]">Numerical Score (/100)</label>
              <input
                type="number"
                max="100"
                min="0"
                value={score}
                onChange={(e) => setScore(Number(e.target.value))}
                className="w-full mt-2 px-4 py-3 rounded-2xl bg-white text-xl font-display font-bold text-[#2E2E2E] border border-[#D7D4CF] focus:outline-none focus:border-[#6B8FD8]"
              />
            </div>

            {/* Feedback Comments */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-[#767676]">Teacher Feedback Remarks</label>
              <textarea
                rows="4"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="w-full mt-2 p-3.5 rounded-2xl bg-white text-xs text-[#2E2E2E] border border-[#D7D4CF] focus:outline-none focus:border-[#6B8FD8]"
              />
            </div>

            <button
              onClick={handlePublishGrade}
              className="w-full py-3.5 bg-[#6B8FD8] text-white font-display font-bold text-xs rounded-full shadow-md hover:bg-[#8FB7F5] transition-all flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-base">send</span>
              Publish Grade & Notify Student
            </button>
          </div>
        </div>
      )}

      {activeTab === 'released' && (
        /* Released Grades Log */
        <div className="glass-panel p-6 rounded-3xl border border-[#D7D4CF] shadow-sm space-y-4">
          <h2 className="font-display font-bold text-lg text-[#2E2E2E]">Published Scorecards</h2>
          {releasedList.length === 0 ? (
            <p className="text-xs text-[#767676] py-6 text-center">No grades published in this session yet.</p>
          ) : (
            <div className="space-y-3">
              {releasedList.map((r, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-[#F2F1EE] border border-[#D7D4CF] flex items-center justify-between">
                  <div>
                    <h4 className="font-display font-bold text-sm text-[#2E2E2E]">{r.studentName} • {r.assignmentTitle}</h4>
                    <p className="text-xs text-[#767676] mt-0.5">Remarks: "{r.feedback}"</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-[#A8C8A2] block">{r.finalScore}/100</span>
                    <span className="text-[10px] text-[#B7B7B7]">Released {r.releasedAt}</span>
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

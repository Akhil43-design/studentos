import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function ExamsPage() {
  const { user } = useAuth();
  const [activeExamMode, setActiveExamMode] = useState(false);
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes countdown
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [flaggedQuestions, setFlaggedQuestions] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const sampleQuestions = [
    {
      id: 1,
      text: 'Which of the following represents the Fundamental Theorem of Calculus?',
      options: [
        '∫ f(x)dx = F(b) - F(a)',
        'd/dx [f(x) * g(x)] = f\'(x)g(x) + f(x)g\'(x)',
        'E = mc²',
        'lim x->0 (sin x / x) = 1'
      ],
      correct: 0
    },
    {
      id: 2,
      text: 'What is the derivative of f(x) = sin(x) with respect to x?',
      options: [
        '-cos(x)',
        'cos(x)',
        '-sin(x)',
        'tan(x)'
      ],
      correct: 1
    },
    {
      id: 3,
      text: 'In offline PWA architecture, which API is utilized for local data persistence?',
      options: [
        'Cookies',
        'IndexedDB',
        'Local File System Access',
        'Session Storage Only'
      ],
      correct: 1
    }
  ];

  useEffect(() => {
    let timer;
    if (activeExamMode && timeLeft > 0 && !submitted) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [activeExamMode, timeLeft, submitted]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = (optIdx) => {
    setSelectedAnswers({ ...selectedAnswers, [currentQuestion]: optIdx });
  };

  const toggleFlag = () => {
    setFlaggedQuestions({ ...flaggedQuestions, [currentQuestion]: !flaggedQuestions[currentQuestion] });
  };

  const calculateScore = () => {
    let correct = 0;
    sampleQuestions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correct) correct++;
    });
    return Math.round((correct / sampleQuestions.length) * 100);
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans pb-10">
      
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#dfe3e7] dark:border-slate-800">
        <div>
          <h1 className="font-display font-extrabold text-2xl text-[#091426] dark:text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-2xl text-[#835500] dark:text-[#feae2c]">quiz</span>
            Active Examination Studio
          </h1>
          <p className="text-xs text-[#45474c] dark:text-slate-400">Live timed quizzes, active exams, and automated scorecards</p>
        </div>

        <div>
          {!activeExamMode ? (
            <button
              onClick={() => { setActiveExamMode(true); setSubmitted(false); setTimeLeft(1800); }}
              className="px-5 py-2.5 rounded-full bg-[#091426] text-white dark:bg-[#feae2c] dark:text-[#091426] font-display font-bold text-xs shadow-sm hover:opacity-90 transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-base">play_arrow</span> Start Calculus Active Exam
            </button>
          ) : (
            <button
              onClick={() => setActiveExamMode(false)}
              className="px-4 py-2 rounded-full bg-[#f0f4f8] dark:bg-slate-800 text-[#091426] dark:text-slate-200 text-xs font-semibold hover:bg-slate-200"
            >
              Exit Exam View
            </button>
          )}
        </div>
      </div>

      {activeExamMode ? (
        /* Active Exam Taking Interface (Stitch active_exam) */
        <div className="bg-white dark:bg-[#1e293b] rounded-3xl border border-[#dfe3e7] dark:border-slate-700 shadow-xl overflow-hidden">
          
          {/* Exam Header Bar */}
          <div className="px-6 py-4 bg-[#091426] text-white flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#feae2c]">LIVE EXAM • GRADE 10A</span>
              <h2 className="font-display font-bold text-lg text-white">Mathematics Calculus Mid-Term</h2>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl text-xs font-mono font-bold border border-white/20">
                <span className="material-symbols-outlined text-amber-400 text-base">timer</span>
                <span>{formatTime(timeLeft)}</span>
              </div>
              <button
                onClick={() => setSubmitted(true)}
                className="px-4 py-2 bg-[#feae2c] text-[#091426] font-display font-bold text-xs rounded-xl hover:bg-amber-400 transition-colors"
              >
                Submit Exam
              </button>
            </div>
          </div>

          {!submitted ? (
            <div className="p-6 sm:p-8 space-y-6">
              {/* Question palette dots */}
              <div className="flex items-center justify-between pb-4 border-b border-[#dfe3e7] dark:border-slate-700">
                <span className="text-xs font-bold text-[#75777d]">Question {currentQuestion + 1} of {sampleQuestions.length}</span>
                
                <div className="flex gap-2">
                  {sampleQuestions.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentQuestion(idx)}
                      className={`w-8 h-8 rounded-lg font-bold text-xs transition-all ${
                        currentQuestion === idx
                          ? 'bg-[#091426] text-white dark:bg-[#feae2c] dark:text-[#091426]'
                          : selectedAnswers[idx] !== undefined
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : 'bg-[#f0f4f8] dark:bg-slate-800 text-slate-500'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>
              </div>

              {/* Active Question Box */}
              <div>
                <h3 className="font-display font-bold text-base text-[#091426] dark:text-white leading-snug">
                  {sampleQuestions[currentQuestion].text}
                </h3>

                <div className="mt-5 space-y-3">
                  {sampleQuestions[currentQuestion].options.map((opt, optIdx) => (
                    <button
                      key={optIdx}
                      onClick={() => handleSelectOption(optIdx)}
                      className={`w-full text-left p-4 rounded-2xl border text-xs font-semibold transition-all flex items-center gap-3 ${
                        selectedAnswers[currentQuestion] === optIdx
                          ? 'border-[#feae2c] bg-amber-50 dark:bg-amber-950/30 text-[#091426] dark:text-white'
                          : 'border-[#dfe3e7] dark:border-slate-700 bg-white dark:bg-slate-800/60 text-[#45474c] dark:text-slate-300 hover:border-slate-400'
                      }`}
                    >
                      <span className={`w-6 h-6 rounded-full border flex items-center justify-center font-bold text-[11px] ${
                        selectedAnswers[currentQuestion] === optIdx
                          ? 'bg-[#feae2c] text-[#091426] border-[#feae2c]'
                          : 'border-slate-300 text-slate-500'
                      }`}>
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <span>{opt}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Navigation controls */}
              <div className="flex items-center justify-between pt-4 border-t border-[#dfe3e7] dark:border-slate-700">
                <button
                  onClick={toggleFlag}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 ${
                    flaggedQuestions[currentQuestion] ? 'bg-amber-100 text-[#835500]' : 'text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  <span className="material-symbols-outlined text-base">flag</span>
                  {flaggedQuestions[currentQuestion] ? 'Flagged for Review' : 'Flag Question'}
                </button>

                <div className="flex gap-2">
                  <button
                    disabled={currentQuestion === 0}
                    onClick={() => setCurrentQuestion(prev => prev - 1)}
                    className="px-4 py-2 bg-[#f0f4f8] dark:bg-slate-800 text-xs font-semibold text-[#091426] dark:text-white rounded-xl disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    disabled={currentQuestion === sampleQuestions.length - 1}
                    onClick={() => setCurrentQuestion(prev => prev + 1)}
                    className="px-4 py-2 bg-[#091426] text-white dark:bg-[#feae2c] dark:text-[#091426] text-xs font-bold rounded-xl disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Result Summary View */
            <div className="p-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center mx-auto">
                <span className="material-symbols-outlined text-4xl">verified</span>
              </div>
              <h3 className="font-display font-extrabold text-2xl text-[#091426] dark:text-white">Exam Submitted Successfully!</h3>
              <p className="text-xs text-[#45474c] dark:text-slate-400">Your answers have been graded and logged in your scorecards.</p>
              
              <div className="inline-block p-6 rounded-2xl bg-[#f0f4f8] dark:bg-slate-800 border border-[#dfe3e7] dark:border-slate-700 max-w-xs w-full">
                <p className="text-xs font-semibold text-slate-500">Calculus Exam Score</p>
                <p className="text-4xl font-display font-extrabold text-[#091426] dark:text-white mt-1">{calculateScore()}%</p>
                <p className="text-xs text-emerald-600 font-bold mt-1">Grade A+ (Passed)</p>
              </div>

              <div>
                <button
                  onClick={() => setActiveExamMode(false)}
                  className="px-6 py-2.5 bg-[#091426] text-white dark:bg-[#feae2c] dark:text-[#091426] font-bold text-xs rounded-full shadow-sm"
                >
                  Return to Exam Dashboard
                </button>
              </div>
            </div>
          )}

        </div>
      ) : (
        /* Regular Exams Scorecard Overview */
        <div className="space-y-6">
          <div className="bg-white dark:bg-[#1e293b] p-6 rounded-3xl border border-[#dfe3e7] dark:border-slate-700 shadow-sm flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold text-[#835500] dark:text-[#feae2c] uppercase tracking-wider">Cumulative GPA & Rank</p>
              <p className="text-3xl font-display font-extrabold text-[#091426] dark:text-white mt-1">94.2%</p>
              <p className="text-xs text-[#45474c] dark:text-slate-400 mt-0.5">Rank #2 of 28 in Grade 10A</p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-[#091426] text-white dark:bg-[#feae2c] dark:text-[#091426] flex items-center justify-center font-display font-extrabold text-2xl shadow-md">
              A+
            </div>
          </div>

          <div className="bg-white dark:bg-[#1e293b] p-6 rounded-3xl border border-[#dfe3e7] dark:border-slate-700 shadow-sm space-y-4">
            <h3 className="font-display font-bold text-lg text-[#091426] dark:text-white">Recent Exam Scorecards</h3>
            <div className="space-y-3">
              {[
                { title: 'Mid-Term Calculus & Integration', subject: 'Mathematics', marks: '96 / 100', grade: 'A+' },
                { title: 'Quantum Mechanics Lab Exam', subject: 'Physics', marks: '92 / 100', grade: 'A+' },
                { title: 'Data Structures Practicum', subject: 'Computer Science', marks: '95 / 100', grade: 'A+' },
              ].map((e, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-[#f0f4f8] dark:bg-slate-800/60 border border-[#dfe3e7] dark:border-slate-700 flex items-center justify-between">
                  <div>
                    <h4 className="font-display font-bold text-sm text-[#091426] dark:text-white">{e.title}</h4>
                    <p className="text-xs text-[#45474c] dark:text-slate-400 mt-0.5">{e.subject}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 block">{e.marks}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-[#835500]">{e.grade}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [authMode, setAuthMode] = useState('pin'); // 'pin' or 'password'
  const [username, setUsername] = useState('student');
  const [pin, setPin] = useState('1234');
  const [password, setPassword] = useState('student123');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    const payload = {
      username,
      ...(authMode === 'pin' ? { pin } : { password })
    };

    const res = await login(payload);
    setSubmitting(false);

    if (res.success) {
      const role = res.user.role;
      if (role === 'teacher') navigate('/dashboard/teacher');
      else if (role === 'parent') navigate('/dashboard/parent');
      else if (role === 'admin') navigate('/dashboard/admin');
      else navigate('/dashboard/student');
    } else {
      setError(res.error || 'Invalid credentials');
    }
  };

  const setQuickDemoUser = (role) => {
    if (role === 'student') { setUsername('student'); setPin('1234'); setPassword('student123'); }
    else if (role === 'teacher') { setUsername('teacher'); setPin('1234'); setPassword('teacher123'); }
    else if (role === 'parent') { setUsername('parent'); setPin('1234'); setPassword('parent123'); }
    else if (role === 'admin') { setUsername('admin'); setPin('1234'); setPassword('admin123'); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#f6fafe] dark:bg-[#091426] font-sans transition-colors">
      <div className="w-full max-w-md bg-white dark:bg-[#1e293b] p-8 rounded-3xl border border-[#dfe3e7] dark:border-slate-700 shadow-2xl animate-fade-in relative">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#091426] text-white dark:bg-[#feae2c] dark:text-[#091426] font-display font-extrabold text-2xl flex items-center justify-center mx-auto shadow-sm">
            S
          </div>
          <h1 className="font-display font-extrabold text-2xl text-[#091426] dark:text-white">
            SmartSlate Login
          </h1>
          <p className="text-xs text-[#45474c] dark:text-slate-400">Academic Digital Notebook & LMS Portal</p>
        </div>

        {/* Demo Fast Login Bar */}
        <div className="mt-6 p-3.5 rounded-2xl bg-[#f0f4f8] dark:bg-slate-800/60 border border-[#dfe3e7] dark:border-slate-700">
          <p className="text-[10px] font-bold text-[#75777d] uppercase tracking-wider text-center mb-2">Quick Demo Preset Access</p>
          <div className="grid grid-cols-4 gap-1.5 text-xs font-semibold">
            <button onClick={() => setQuickDemoUser('student')} className="py-1.5 rounded-xl bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300 hover:bg-sky-200">
              Student
            </button>
            <button onClick={() => setQuickDemoUser('teacher')} className="py-1.5 rounded-xl bg-amber-100 text-[#835500] dark:bg-amber-950/60 dark:text-[#feae2c] hover:bg-amber-200">
              Teacher
            </button>
            <button onClick={() => setQuickDemoUser('parent')} className="py-1.5 rounded-xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 hover:bg-emerald-200">
              Parent
            </button>
            <button onClick={() => setQuickDemoUser('admin')} className="py-1.5 rounded-xl bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 hover:bg-rose-200">
              Admin
            </button>
          </div>
        </div>

        {/* Auth Mode Tabs */}
        <div className="mt-6 flex bg-[#f0f4f8] dark:bg-slate-800 p-1 rounded-2xl text-xs font-semibold">
          <button
            onClick={() => setAuthMode('pin')}
            className={`flex-1 py-2.5 rounded-xl transition-all ${
              authMode === 'pin'
                ? 'bg-[#091426] text-white dark:bg-[#feae2c] dark:text-[#091426] shadow-sm font-bold'
                : 'text-[#45474c] dark:text-slate-400'
            }`}
          >
            4-Digit PIN Lock
          </button>
          <button
            onClick={() => setAuthMode('password')}
            className={`flex-1 py-2.5 rounded-xl transition-all ${
              authMode === 'password'
                ? 'bg-[#091426] text-white dark:bg-[#feae2c] dark:text-[#091426] shadow-sm font-bold'
                : 'text-[#45474c] dark:text-slate-400'
            }`}
          >
            Password Sign In
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 text-red-600 dark:text-red-300 text-xs font-semibold text-center">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="text-xs font-semibold text-[#75777d] dark:text-slate-400 block mb-1">Username / Academic Email</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-lg">person</span>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#f0f4f8] dark:bg-slate-800 text-xs text-[#091426] dark:text-white border border-[#dfe3e7] dark:border-slate-700 focus:outline-none focus:border-[#feae2c]"
              />
            </div>
          </div>

          {authMode === 'pin' ? (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-[#75777d] dark:text-slate-400">4-Digit Security PIN</label>
                <Link to="/forgot-pin" className="text-[11px] font-bold text-[#835500] dark:text-[#feae2c] hover:underline">
                  Forgot PIN?
                </Link>
              </div>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-lg">key</span>
                <input
                  type="password"
                  maxLength="4"
                  required
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="1234"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#f0f4f8] dark:bg-slate-800 text-xs font-mono tracking-widest text-[#091426] dark:text-white border border-[#dfe3e7] dark:border-slate-700 focus:outline-none focus:border-[#feae2c]"
                />
              </div>
            </div>
          ) : (
            <div>
              <label className="text-xs font-semibold text-[#75777d] dark:text-slate-400 block mb-1">Account Password</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-lg">lock</span>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#f0f4f8] dark:bg-slate-800 text-xs text-[#091426] dark:text-white border border-[#dfe3e7] dark:border-slate-700 focus:outline-none focus:border-[#feae2c]"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-full bg-[#091426] text-white dark:bg-[#feae2c] dark:text-[#091426] font-display font-bold text-xs shadow-md hover:opacity-90 transition-all flex items-center justify-center gap-2"
          >
            <span>{submitting ? 'Authenticating...' : 'Sign In to SmartSlate'}</span>
            <span className="material-symbols-outlined text-base">arrow_forward</span>
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-[#75777d]">
          New student or teacher?{' '}
          <Link to="/register" className="font-bold text-[#835500] dark:text-[#feae2c] hover:underline">
            Create account
          </Link>
        </div>

      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function ForgotPinPage() {
  const { resetPin } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [newPin, setNewPin] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    const res = await resetPin({ username, email, newPin });
    if (res.success) {
      setMessage(res.message || 'Security PIN reset successfully!');
    } else {
      setError(res.error || 'Failed to reset PIN. Verify username and email.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#f6fafe] dark:bg-[#091426] font-sans transition-colors">
      <div className="w-full max-w-md bg-white dark:bg-[#1e293b] p-8 rounded-3xl border border-[#dfe3e7] dark:border-slate-700 shadow-2xl animate-fade-in space-y-4">
        
        <div className="text-center space-y-1">
          <div className="w-12 h-12 rounded-2xl bg-[#feae2c]/20 text-[#835500] dark:text-[#feae2c] flex items-center justify-center mx-auto mb-2">
            <span className="material-symbols-outlined text-3xl">key</span>
          </div>
          <h1 className="font-display font-extrabold text-2xl text-[#091426] dark:text-white">Reset 4-Digit PIN</h1>
          <p className="text-xs text-[#45474c] dark:text-slate-400">Provide registered account credentials to create a new PIN</p>
        </div>

        {message && (
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 text-emerald-600 dark:text-emerald-300 text-xs font-semibold text-center flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-base">check_circle</span> {message}
          </div>
        )}

        {error && (
          <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 text-red-600 dark:text-red-300 text-xs font-semibold text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="text-xs font-semibold text-[#75777d] dark:text-slate-400 block mb-1">Username</label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. student"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#f0f4f8] dark:bg-slate-800 text-xs text-[#091426] dark:text-white border border-[#dfe3e7] dark:border-slate-700 focus:outline-none focus:border-[#feae2c]"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-[#75777d] dark:text-slate-400 block mb-1">Registered Academic Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="student@smartslate.edu"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#f0f4f8] dark:bg-slate-800 text-xs text-[#091426] dark:text-white border border-[#dfe3e7] dark:border-slate-700 focus:outline-none focus:border-[#feae2c]"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-[#75777d] dark:text-slate-400 block mb-1">New 4-Digit Security PIN</label>
            <input
              type="password"
              maxLength="4"
              required
              value={newPin}
              onChange={(e) => setNewPin(e.target.value)}
              placeholder="1234"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#f0f4f8] dark:bg-slate-800 text-xs font-mono tracking-widest text-[#091426] dark:text-white border border-[#dfe3e7] dark:border-slate-700 focus:outline-none focus:border-[#feae2c]"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-full bg-[#091426] text-white dark:bg-[#feae2c] dark:text-[#091426] font-display font-bold text-xs shadow-md hover:opacity-90 transition-all mt-4"
          >
            Update Security PIN
          </button>
        </form>

        <div className="text-center pt-2">
          <Link to="/login" className="text-xs font-bold text-[#835500] dark:text-[#feae2c] hover:underline inline-flex items-center gap-1">
            <span className="material-symbols-outlined text-base">arrow_back</span> Return to Login
          </Link>
        </div>

      </div>
    </div>
  );
}

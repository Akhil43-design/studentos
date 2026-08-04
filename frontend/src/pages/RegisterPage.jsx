import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pin, setPin] = useState('1234');
  const [role, setRole] = useState('student');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (pin.length !== 4) {
      setError('Security PIN must be exactly 4 digits');
      return;
    }

    setSubmitting(true);
    const res = await register({
      fullName,
      username,
      email,
      password,
      pin,
      role
    });
    setSubmitting(false);

    if (res.success) {
      if (role === 'teacher') navigate('/dashboard/teacher');
      else if (role === 'parent') navigate('/dashboard/parent');
      else if (role === 'admin') navigate('/dashboard/admin');
      else navigate('/dashboard/student');
    } else {
      setError(res.error || 'Failed to create account');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#f6fafe] dark:bg-[#091426] font-sans transition-colors">
      <div className="w-full max-w-md bg-white dark:bg-[#1e293b] p-8 rounded-3xl border border-[#dfe3e7] dark:border-slate-700 shadow-2xl animate-fade-in space-y-4">
        
        <div className="text-center space-y-1">
          <div className="w-10 h-10 rounded-xl bg-[#091426] text-white dark:bg-[#feae2c] dark:text-[#091426] font-display font-extrabold text-xl flex items-center justify-center mx-auto mb-2">
            S
          </div>
          <h1 className="font-display font-extrabold text-2xl text-[#091426] dark:text-white">
            Create SmartSlate Account
          </h1>
          <p className="text-xs text-[#45474c] dark:text-slate-400">Academic Digital Notebook & LMS Registration</p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 text-red-600 dark:text-red-300 text-xs font-semibold text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="text-xs font-semibold text-[#75777d] dark:text-slate-400 block mb-1">Select Academic Role</label>
            <div className="grid grid-cols-4 gap-1 bg-[#f0f4f8] dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
              {['student', 'teacher', 'parent', 'admin'].map(r => (
                <button
                  type="button"
                  key={r}
                  onClick={() => setRole(r)}
                  className={`py-2 rounded-lg capitalize transition-all ${role === r ? 'bg-[#091426] text-white dark:bg-[#feae2c] dark:text-[#091426] font-bold shadow-sm' : 'text-[#45474c] dark:text-slate-400'}`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-[#75777d] dark:text-slate-400 block mb-1">Full Name</label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Alex Johnson"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#f0f4f8] dark:bg-slate-800 text-xs text-[#091426] dark:text-white border border-[#dfe3e7] dark:border-slate-700 focus:outline-none focus:border-[#feae2c]"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-[#75777d] dark:text-slate-400 block mb-1">Username</label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="unique_handle"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#f0f4f8] dark:bg-slate-800 text-xs text-[#091426] dark:text-white border border-[#dfe3e7] dark:border-slate-700 focus:outline-none focus:border-[#feae2c]"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-[#75777d] dark:text-slate-400 block mb-1">Academic Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alex@smartslate.edu"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#f0f4f8] dark:bg-slate-800 text-xs text-[#091426] dark:text-white border border-[#dfe3e7] dark:border-slate-700 focus:outline-none focus:border-[#feae2c]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-[#75777d] dark:text-slate-400 block mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#f0f4f8] dark:bg-slate-800 text-xs text-[#091426] dark:text-white border border-[#dfe3e7] dark:border-slate-700 focus:outline-none focus:border-[#feae2c]"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#75777d] dark:text-slate-400 block mb-1">4-Digit PIN</label>
              <input
                type="password"
                maxLength="4"
                required
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="1234"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#f0f4f8] dark:bg-slate-800 text-xs font-mono tracking-widest text-[#091426] dark:text-white border border-[#dfe3e7] dark:border-slate-700 focus:outline-none focus:border-[#feae2c]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-full bg-[#091426] text-white dark:bg-[#feae2c] dark:text-[#091426] font-display font-bold text-xs shadow-md hover:opacity-90 transition-all mt-4"
          >
            {submitting ? 'Creating Account...' : 'Complete Sign Up'}
          </button>
        </form>

        <div className="text-center text-xs text-[#75777d]">
          Already registered?{' '}
          <Link to="/login" className="font-bold text-[#835500] dark:text-[#feae2c] hover:underline">
            Login here
          </Link>
        </div>

      </div>
    </div>
  );
}

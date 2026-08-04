import React, { useState } from 'react';

export default function PinSetupModal({ isOpen, onClose, onSavePin }) {
  const [pin, setPin] = useState(['', '', '', '']);
  const [confirmPin, setConfirmPin] = useState(['', '', '', '']);
  const [step, setStep] = useState('create'); // 'create' | 'confirm'
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleKeyPress = (num) => {
    setError('');
    const current = step === 'create' ? [...pin] : [...confirmPin];
    const emptyIndex = current.findIndex(val => val === '');

    if (emptyIndex !== -1) {
      current[emptyIndex] = num.toString();
      if (step === 'create') {
        setPin(current);
        if (emptyIndex === 3) {
          setTimeout(() => setStep('confirm'), 200);
        }
      } else {
        setConfirmPin(current);
        if (emptyIndex === 3) {
          const pinStr = pin.join('');
          const confirmStr = current.join('');
          if (pinStr !== confirmStr) {
            setError('PINs do not match. Please try again.');
            setConfirmPin(['', '', '', '']);
          } else {
            setSuccess(true);
            setTimeout(() => {
              if (onSavePin) onSavePin(pinStr);
              onClose();
            }, 800);
          }
        }
      }
    }
  };

  const handleDelete = () => {
    setError('');
    const current = step === 'create' ? [...pin] : [...confirmPin];
    const lastFilled = current.map(val => val !== '').lastIndexOf(true);
    if (lastFilled !== -1) {
      current[lastFilled] = '';
      step === 'create' ? setPin(current) : setConfirmPin(current);
    }
  };

  const handleReset = () => {
    setPin(['', '', '', '']);
    setConfirmPin(['', '', '', '']);
    setStep('create');
    setError('');
    setSuccess(false);
  };

  const activeDigits = step === 'create' ? pin : confirmPin;

  return (
    <div className="fixed inset-0 z-50 bg-[#091426]/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#1e293b] rounded-3xl p-8 max-w-sm w-full shadow-2xl border border-[#dfe3e7] dark:border-slate-700 animate-fade-in relative text-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        {/* Security Shield Icon */}
        <div className="w-14 h-14 rounded-2xl bg-[#feae2c]/20 text-[#835500] dark:text-[#feae2c] flex items-center justify-center mx-auto mb-4">
          <span className="material-symbols-outlined text-3xl">lock_reset</span>
        </div>

        <h3 className="font-display font-bold text-xl text-[#091426] dark:text-white">
          {success ? 'Security PIN Set!' : step === 'create' ? 'Create Security PIN' : 'Confirm Security PIN'}
        </h3>
        <p className="text-xs text-[#45474c] dark:text-slate-300 mt-1">
          {success
            ? 'Your 4-digit PIN has been configured.'
            : step === 'create'
            ? 'Set a 4-digit PIN to lock your private notebooks'
            : 'Re-enter your 4-digit PIN to verify'}
        </p>

        {/* 4 Digit Indicators */}
        <div className="flex justify-center gap-3 my-6">
          {activeDigits.map((digit, idx) => (
            <div
              key={idx}
              className={`w-12 h-14 rounded-xl border-2 flex items-center justify-center text-2xl font-bold transition-all ${
                digit !== ''
                  ? 'border-[#feae2c] bg-amber-50 dark:bg-amber-950/30 text-[#091426] dark:text-white'
                  : 'border-[#dfe3e7] dark:border-slate-700 text-transparent'
              }`}
            >
              {digit ? '•' : ''}
            </div>
          ))}
        </div>

        {error && (
          <p className="text-xs text-red-500 font-semibold mb-4 animate-shake">{error}</p>
        )}

        {/* Numeric Keypad Grid */}
        <div className="grid grid-cols-3 gap-3 max-w-[240px] mx-auto">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              onClick={() => handleKeyPress(num)}
              className="h-12 rounded-xl bg-[#f0f4f8] dark:bg-slate-800 text-[#091426] dark:text-white font-display font-semibold text-lg hover:bg-[#feae2c] hover:text-[#091426] dark:hover:bg-[#feae2c] dark:hover:text-[#091426] transition-colors shadow-sm active:scale-95"
            >
              {num}
            </button>
          ))}
          <button
            onClick={handleReset}
            className="h-12 rounded-xl bg-[#f0f4f8] dark:bg-slate-800 text-slate-500 hover:text-slate-800 text-xs font-semibold uppercase tracking-wider transition-colors"
          >
            Clear
          </button>
          <button
            onClick={() => handleKeyPress(0)}
            className="h-12 rounded-xl bg-[#f0f4f8] dark:bg-slate-800 text-[#091426] dark:text-white font-display font-semibold text-lg hover:bg-[#feae2c] hover:text-[#091426] dark:hover:bg-[#feae2c] dark:hover:text-[#091426] transition-colors shadow-sm active:scale-95"
          >
            0
          </button>
          <button
            onClick={handleDelete}
            className="h-12 rounded-xl bg-[#f0f4f8] dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-red-100 hover:text-red-600 transition-colors flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-xl">backspace</span>
          </button>
        </div>
      </div>
    </div>
  );
}

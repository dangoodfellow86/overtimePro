"use client";

import React, { useState } from 'react';
import { PoundSterling, ArrowRight } from 'lucide-react';

interface OnboardingProps {
  onSetRate: (rate: number) => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onSetRate }) => {
  const [rate, setRate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numRate = parseFloat(rate);
    if (!isNaN(numRate) && numRate > 0) {
      onSetRate(numRate);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4 transition-colors duration-300">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-8 text-center border border-slate-100 dark:border-slate-800">
        <div className="bg-indigo-100 dark:bg-indigo-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
          <PoundSterling className="text-indigo-600 dark:text-indigo-400" size={32} />
        </div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Welcome to OvertimePro</h1>
        <p className="text-slate-500 dark:text-slate-400 mb-8">To get started, please enter your standard hourly rate of pay.</p>
        
        <form onSubmit={handleSubmit}>
          <div className="relative mb-6">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">£</span>
            <input 
              type="number" 
              step="0.01"
              required
              autoFocus
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              className="w-full bg-white dark:bg-slate-800 text-slate-900 dark:text-white pl-10 pr-4 py-4 text-lg border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-0 outline-none transition-all placeholder:text-slate-400"
              placeholder="0.00"
            />
          </div>
          <button 
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            Get Started <ArrowRight size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};
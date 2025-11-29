"use client";

import React, { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { ShiftResult, AiAnalysis } from '../types';
import { analyzeShifts } from '../services/aiService';

interface AiInsightProps {
  shifts: ShiftResult[];
}

export const AiInsight: React.FC<AiInsightProps> = ({ shifts }) => {
  const [analysis, setAnalysis] = useState<AiAnalysis | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    const result = await analyzeShifts(shifts);
    setAnalysis(result);
    setLoading(false);
  };

  return (
    <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-xl shadow-lg p-6 text-white mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="text-yellow-300" size={24} />
          <h2 className="text-xl font-bold">AI Pay Analyst</h2>
        </div>
        <button
          onClick={handleAnalyze}
          disabled={loading || shifts.length === 0}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-sm font-medium backdrop-blur-sm transition-colors flex items-center gap-2"
        >
          {loading ? <Loader2 className="animate-spin" size={16} /> : null}
          {analysis ? 'Refresh Analysis' : 'Analyze Earnings'}
        </button>
      </div>

      {!analysis && (
        <p className="text-indigo-100 text-sm">
          Use Gemini AI to break down your complex overtime premiums and find out how to maximize your earnings.
        </p>
      )}

      {analysis && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-200 mb-1">Summary</h3>
            <p className="text-white/90 leading-relaxed">{analysis.summary}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {analysis.tips.map((tip, idx) => (
              <div key={idx} className="bg-white/5 border border-white/10 rounded-lg p-3">
                <span className="text-xs font-bold text-yellow-300 mb-1 block">Insight {idx + 1}</span>
                <p className="text-sm text-indigo-100">{tip}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
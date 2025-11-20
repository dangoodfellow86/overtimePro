import React from 'react';
import { PoundSterling, Clock, Calendar, Zap } from 'lucide-react';

interface StatsCardsProps {
  totalPay: number;
  totalHours: number;
  shiftCount: number;
  avgHourlyRate: number;
}

export const StatsCards: React.FC<StatsCardsProps> = ({ totalPay, totalHours, shiftCount, avgHourlyRate }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors duration-300">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Total Earnings</p>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white">£{totalPay.toFixed(2)}</h3>
          </div>
          <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full text-green-600 dark:text-green-400">
            <PoundSterling size={20} />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors duration-300">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Total Hours</p>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white">{totalHours.toFixed(1)}h</h3>
          </div>
          <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-600 dark:text-blue-400">
            <Clock size={20} />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors duration-300">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Shifts Logged</p>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white">{shiftCount}</h3>
          </div>
          <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full text-purple-600 dark:text-purple-400">
            <Calendar size={20} />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors duration-300">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Avg. Eff. Rate</p>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white">£{isNaN(avgHourlyRate) ? '0.00' : avgHourlyRate.toFixed(2)}/h</h3>
          </div>
          <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-full text-orange-600 dark:text-orange-400">
            <Zap size={20} />
          </div>
        </div>
      </div>
    </div>
  );
};
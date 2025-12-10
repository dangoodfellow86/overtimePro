import React from 'react';
import { Calendar, Filter, X } from 'lucide-react';

interface DateRangeFilterProps {
  startDate: string;
  endDate: string;
  onRangeChange: (start: string, end: string) => void;
}

export const DateRangeFilter: React.FC<DateRangeFilterProps> = ({ startDate, endDate, onRangeChange }) => {
  
  const handleQuickSelect = (range: 'thisMonth' | 'lastMonth' | 'allTime') => {
    const now = new Date();
    let start = '';
    let end = '';

    if (range === 'thisMonth') {
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      start = firstDay.toISOString().split('T')[0];
      end = lastDay.toISOString().split('T')[0];
    } else if (range === 'lastMonth') {
      const firstDay = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const lastDay = new Date(now.getFullYear(), now.getMonth(), 0);
      start = firstDay.toISOString().split('T')[0];
      end = lastDay.toISOString().split('T')[0];
    } else {
      // All Time - we'll use empty strings to signify no filter
      start = '';
      end = '';
    }

    onRangeChange(start, end);
  };

  const isAllTime = startDate === '' && endDate === '';

  return (
    <div className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 mb-6 transition-colors duration-300">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        
        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200 font-medium">
          <Filter size={20} className="text-indigo-600 dark:text-indigo-400" />
          <span>Filter Range</span>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
            <input 
              type="date" 
              value={startDate} 
              onChange={(e) => onRangeChange(e.target.value, endDate)}
              className="bg-transparent border-none text-sm text-slate-600 dark:text-slate-300 focus:ring-0 p-1"
            />
            <span className="text-slate-400">-</span>
            <input 
              type="date" 
              value={endDate} 
              onChange={(e) => onRangeChange(startDate, e.target.value)}
              className="bg-transparent border-none text-sm text-slate-600 dark:text-slate-300 focus:ring-0 p-1"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleQuickSelect('thisMonth')}
              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-300 dark:hover:bg-indigo-900/50 transition-colors"
            >
              This Month
            </button>
            <button
              onClick={() => handleQuickSelect('lastMonth')}
              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors"
            >
              Last Month
            </button>
            {!isAllTime && (
              <button
                onClick={() => handleQuickSelect('allTime')}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-900/50 transition-colors"
              >
                <X size={14} /> Clear
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
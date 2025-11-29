<<<<<<< HEAD
"use client";

=======
>>>>>>> 0b1b55a5f3bb67b38c528286b7ef3f43f149a5bd
import React from 'react';
import { ShiftResult } from '../types';
import { Calendar, Trash2, Phone, Clock } from 'lucide-react';

interface ShiftListProps {
  shifts: ShiftResult[];
  onDelete: (id: string) => void;
}

export const ShiftList: React.FC<ShiftListProps> = ({ shifts, onDelete }) => {
  if (shifts.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 p-12 flex flex-col items-center text-center transition-colors duration-300">
        <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-full mb-4">
          <Calendar size={32} className="text-slate-400" />
        </div>
        <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300">No Shifts Recorded</h3>
        <p className="text-slate-500 dark:text-slate-400 max-w-xs mt-2">
          Use the form to add your overtime or on-call hours. We'll calculate your earnings automatically.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden transition-colors duration-300">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Date & Type</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Time</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Rate / Base</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Premiums</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Total</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {shifts.map((shift) => (
              <tr key={shift.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="font-medium text-slate-800 dark:text-slate-200">{shift.date}</span>
                    <div className="flex items-center gap-2 mt-1">
                       {shift.type === 'on-call' ? (
                         <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 flex items-center gap-1 w-fit">
                           <Phone size={10} /> On Call
                         </span>
                       ) : (
                         <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center gap-1 w-fit">
                           <Clock size={10} /> Overtime
                         </span>
                       )}
                       
                       <span className={`text-xs px-2 py-0.5 rounded-full ${
                        shift.dayType === 'Weekday' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' :
                        shift.dayType === 'Weekend' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300' :
                        'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                      }`}>
                        {shift.dayType}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col text-sm text-slate-600 dark:text-slate-400">
                    <span>{shift.startTime} - {shift.endTime}</span>
                    <span className="text-xs text-slate-400 dark:text-slate-500">{shift.totalHours.toFixed(2)} hrs</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  {shift.type === 'on-call' ? (
                    <span className="text-xs text-slate-500 dark:text-slate-400">Fixed @ £{shift.baseRate.toFixed(2)}/h</span>
                  ) : (
                    <span className="text-slate-700 dark:text-slate-300 font-medium">£{shift.baseOvertimePay.toFixed(2)}</span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex flex-col items-end gap-1">
                    {shift.hours15 > 0 && (
                      <span className="text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded-md">
                        15%: +£{shift.unsociablePay15.toFixed(2)}
                      </span>
                    )}
                    {shift.hours30 > 0 && (
                      <span className="text-xs text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-0.5 rounded-md">
                        30%: +£{shift.unsociablePay30.toFixed(2)}
                      </span>
                    )}
                    {shift.hours15 === 0 && shift.hours30 === 0 && (
                      <span className="text-xs text-slate-400 dark:text-slate-600">-</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="text-indigo-600 dark:text-indigo-400 font-bold text-lg">£{shift.totalPay.toFixed(2)}</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => onDelete(shift.id)}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-full transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
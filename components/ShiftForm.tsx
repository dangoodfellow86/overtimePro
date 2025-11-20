import React, { useState, useEffect } from 'react';
import { Plus, Save, CalendarCheck, Phone, Clock, Loader2 } from 'lucide-react';
import { ShiftInput, ShiftType } from '../types';
import { isUKBankHoliday } from '../services/bankHolidayService';

interface ShiftFormProps {
  onAddShift: (shift: Omit<ShiftInput, 'id'>) => Promise<void>;
  defaultRate: number;
}

export const ShiftForm: React.FC<ShiftFormProps> = ({ onAddShift, defaultRate }) => {
  const [shiftType, setShiftType] = useState<ShiftType>('overtime');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState<string>('09:00');
  const [endTime, setEndTime] = useState<string>('17:00');
  const [baseRate, setBaseRate] = useState<string>(defaultRate.toString());
  const [isBankHoliday, setIsBankHoliday] = useState<boolean>(false);
  const [isAutoDetected, setIsAutoDetected] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-detect Bank Holiday when date changes
  useEffect(() => {
    const isHoliday = isUKBankHoliday(date);
    setIsBankHoliday(isHoliday);
    setIsAutoDetected(isHoliday);
  }, [date]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const rateValue = parseFloat(baseRate);
    if (isNaN(rateValue)) {
      alert("Please enter a valid numeric base rate.");
      return;
    }

    setIsSubmitting(true);

    try {
      await onAddShift({
        type: shiftType,
        date,
        startTime,
        endTime,
        baseRate: rateValue,
        isBankHoliday,
      });
      // Optional: Show success feedback or reset specific fields here
    } catch (error) {
      console.error("Error saving shift:", error);
      alert("Failed to save shift. Please ensure you are logged in and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper to get current On Call rate for display
  const getOnCallRateDisplay = () => {
    if (isBankHoliday) return "£2.00 (Bank Holiday)";
    const day = new Date(date).getDay();
    if (day === 0 || day === 6) return "£1.25 (Weekend)";
    return "£1.00 (Weekday)";
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden h-fit transition-colors duration-300">
      {/* Tabs */}
      <div className="flex border-b border-slate-100 dark:border-slate-800">
        <button
          type="button"
          onClick={() => setShiftType('overtime')}
          className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
            shiftType === 'overtime' 
              ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400' 
              : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          <Clock size={16} /> Overtime
        </button>
        <button
          type="button"
          onClick={() => setShiftType('on-call')}
          className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
            shiftType === 'on-call' 
              ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400' 
              : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          <Phone size={16} /> On Call
        </button>
      </div>

      <div className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <div className="p-2 bg-indigo-600 rounded-lg text-white">
            <Plus size={18} />
          </div>
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
            {shiftType === 'overtime' ? 'Log Overtime Shift' : 'Log On Call Shift'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Date</label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-white dark:bg-slate-800 dark:text-white dark:border-slate-700 rounded-lg border border-slate-200 px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Start Time</label>
              <input
                type="time"
                required
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full bg-white dark:bg-slate-800 dark:text-white dark:border-slate-700 rounded-lg border border-slate-200 px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">End Time</label>
              <input
                type="time"
                required
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full bg-white dark:bg-slate-800 dark:text-white dark:border-slate-700 rounded-lg border border-slate-200 px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
              />
            </div>
          </div>

          {shiftType === 'overtime' ? (
            <div>
              <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Base Rate (£/hr)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">£</span>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={baseRate}
                  onChange={(e) => setBaseRate(e.target.value)}
                  className="w-full bg-white dark:bg-slate-800 dark:text-white dark:border-slate-700 rounded-lg border border-slate-200 pl-8 pr-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                />
              </div>
            </div>
          ) : (
             <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3 border border-slate-200 dark:border-slate-700">
               <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Applied On Call Rate</p>
               <p className="text-slate-800 dark:text-white font-medium">{getOnCallRateDisplay()}/hr</p>
               <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                 Rates: Mon-Fri £1, Sat-Sun £1.25, Bank Holiday £2
               </p>
             </div>
          )}

          <div className="space-y-2">
            <div className="flex items-center gap-3 py-2">
              <input
                type="checkbox"
                id="bankHoliday"
                checked={isBankHoliday}
                onChange={(e) => {
                  setIsBankHoliday(e.target.checked);
                  if (!e.target.checked) setIsAutoDetected(false);
                }}
                className="w-5 h-5 rounded border-slate-300 dark:border-slate-600 dark:bg-slate-800 text-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-400 dark:focus:ring-offset-slate-900"
              />
              <label htmlFor="bankHoliday" className="text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                Is this a Bank Holiday?
              </label>
            </div>
            
            {isAutoDetected && isBankHoliday && (
              <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 p-2 rounded-lg border border-emerald-100 dark:border-emerald-800 animate-in fade-in duration-300">
                <CalendarCheck size={14} />
                <span>UK Bank Holiday detected automatically</span>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-medium py-2.5 rounded-lg transition-colors"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={18} className="animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Save size={18} /> Calculate & Save
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
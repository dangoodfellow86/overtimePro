import React, { useState, useMemo, useEffect } from 'react';
import { ShiftInput, ShiftResult } from './types';
import { calculateShift } from './utils/calculator';
import { ShiftForm } from './components/ShiftForm';
import { ShiftList } from './components/ShiftList';
import { StatsCards } from './components/StatsCards';
import { AiInsight } from './components/AiInsight';
import { Onboarding } from './components/Onboarding';
import { Auth } from './components/Auth';
import { useAuth } from './contexts/AuthContext';
import { subscribeToShifts, addShiftToDb, deleteShiftFromDb, subscribeToSettings, updateStandardRate } from './services/db';
import { auth } from './services/firebase';
import { signOut } from 'firebase/auth';
import { Clock, Moon, Sun, LogOut, Loader2, Settings } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

function App() {
  const { user, loading: authLoading } = useAuth();
  const [shifts, setShifts] = useState<ShiftResult[]>([]);
  const [standardRate, setStandardRate] = useState<number | null>(null);
  const [dataLoading, setDataLoading] = useState(false);
  
  // Dark Mode State
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('theme') === 'dark' ||
        (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  // Apply dark mode class
  useEffect(() => {
    if (isDarkMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
    } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  // Subscribe to Data (Shifts & Settings)
  useEffect(() => {
    if (user) {
      setDataLoading(true);
      
      // Subscribe to Shifts
      const unsubscribeShifts = subscribeToShifts(user.uid, (data) => {
        // Calculate results on the fly from DB data
        const calculatedShifts = data.map(input => calculateShift(input));
        setShifts(calculatedShifts);
        setDataLoading(false);
      });

      // Subscribe to Settings
      const unsubscribeSettings = subscribeToSettings(user.uid, (rate) => {
        setStandardRate(rate);
      });

      return () => {
        unsubscribeShifts();
        unsubscribeSettings();
      };
    } else {
      setShifts([]);
      setStandardRate(null);
    }
  }, [user]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const handleAddShift = async (input: Omit<ShiftInput, 'id'>) => {
    if (user) {
      await addShiftToDb(user.uid, input);
    }
  };

  const handleDeleteShift = async (id: string) => {
    if (user) {
      await deleteShiftFromDb(user.uid, id);
    }
  };

  const handleSetRate = async (rate: number) => {
    if (user) {
      await updateStandardRate(user.uid, rate);
    }
  };

  const handleLogout = async () => {
    if (auth) await signOut(auth);
  };

  // Derived stats
  const stats = useMemo(() => {
    const totalPay = shifts.reduce((acc, s) => acc + s.totalPay, 0);
    const totalHours = shifts.reduce((acc, s) => acc + s.totalHours, 0);
    const shiftCount = shifts.length;
    const avgHourlyRate = totalHours > 0 ? totalPay / totalHours : 0;
    return { totalPay, totalHours, shiftCount, avgHourlyRate };
  }, [shifts]);

  const chartData = useMemo(() => {
    return [...shifts].reverse().map(s => ({
      date: s.date,
      Base: parseFloat(s.baseOvertimePay.toFixed(2)),
      Premiums: parseFloat((s.unsociablePay15 + s.unsociablePay30).toFixed(2)),
    }));
  }, [shifts]);

  // --- RENDER LOGIC ---

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center transition-colors">
        <Loader2 className="animate-spin text-indigo-600 dark:text-indigo-400" size={32} />
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <div className="absolute top-4 right-4">
          <button 
              onClick={toggleTheme}
              className="p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 rounded-full transition-colors"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
        <Auth />
      </>
    );
  }

  if (standardRate === null && !dataLoading) {
    return <Onboarding onSetRate={handleSetRate} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-12 transition-colors duration-300">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="bg-indigo-600 p-2 rounded-lg text-white">
                <Clock size={20} />
              </div>
              <h1 className="text-xl font-bold text-slate-800 dark:text-white hidden sm:block">Overtime<span className="text-indigo-600 dark:text-indigo-400">Pro</span></h1>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800">
                <span className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[150px]">{user.email}</span>
              </div>
              <button 
                onClick={toggleTheme}
                className="p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 rounded-full transition-colors"
                title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <div className="text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
                Rate: £{standardRate?.toFixed(2)}
              </div>
              <button 
                onClick={() => setStandardRate(null)}
                className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 px-2 py-1"
              >
                <Settings size={16} />
                <span className="hidden sm:inline">Settings</span>
              </button>
              <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-1"></div>
              <button 
                onClick={handleLogout}
                className="text-sm flex items-center gap-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
              >
                <LogOut size={16} />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <AiInsight shifts={shifts} />
        
        <StatsCards {...stats} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Form */}
          <div className="lg:col-span-1">
            <ShiftForm onAddShift={handleAddShift} defaultRate={standardRate || 0} />
          </div>

          {/* Right Column: List and Charts */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Chart Section */}
            {shifts.length > 0 && (
              <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 h-80 transition-colors duration-300">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">Earnings Breakdown</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? "#334155" : "#f1f5f9"} />
                    <XAxis dataKey="date" tick={{fontSize: 12, fill: isDarkMode ? '#94a3b8' : '#64748b'}} axisLine={false} tickLine={false} />
                    <YAxis tick={{fontSize: 12, fill: isDarkMode ? '#94a3b8' : '#64748b'}} axisLine={false} tickLine={false} tickFormatter={(val) => `£${val}`} />
                    <Tooltip 
                      cursor={{fill: isDarkMode ? '#1e293b' : '#f8fafc'}}
                      contentStyle={{
                        backgroundColor: isDarkMode ? '#1e293b' : '#fff', 
                        borderColor: isDarkMode ? '#334155' : '#e2e8f0',
                        color: isDarkMode ? '#f1f5f9' : '#0f172a',
                        borderRadius: '8px', 
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                      }}
                      itemStyle={{ color: isDarkMode ? '#e2e8f0' : '#1e293b' }}
                    />
                    <Legend wrapperStyle={{paddingTop: '20px'}} />
                    <Bar dataKey="Base" stackId="a" fill="#6366f1" radius={[0, 0, 4, 4]} name="Base / On Call" />
                    <Bar dataKey="Premiums" stackId="a" fill="#10b981" radius={[4, 4, 0, 0]} name="Shift Premiums" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            <ShiftList shifts={shifts} onDelete={handleDeleteShift} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
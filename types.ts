export type ShiftType = 'overtime' | 'on-call';

export interface ShiftInput {
  id: string;
  type: ShiftType;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  baseRate: number;
  isBankHoliday: boolean;
}

export interface ShiftResult extends ShiftInput {
  totalHours: number;
  dayType: 'Weekday' | 'Weekend' | 'Bank Holiday';
  overtimeMultiplier: number;
  
  // Earnings breakdown
  baseOvertimePay: number; // (Hours * Rate * Multiplier)
  unsociablePay15: number; // Premium for 20:00 - 23:00
  unsociablePay30: number; // Premium for 23:00 - 06:00
  
  totalPay: number;
  
  hours15: number; // Number of hours in 15% zone
  hours30: number; // Number of hours in 30% zone
}

export interface AiAnalysis {
  summary: string;
  tips: string[];
}
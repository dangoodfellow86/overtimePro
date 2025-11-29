import { ShiftInput, ShiftResult } from '../types';

// Helper to convert HH:mm to minutes from start of day
const getMinutes = (timeStr: string): number => {
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
};

export const calculateShift = (input: ShiftInput): ShiftResult => {
  const startMin = getMinutes(input.startTime);
  let endMin = getMinutes(input.endTime);
  
  // Handle crossing midnight
  if (endMin < startMin) {
    endMin += 24 * 60;
  }

  const totalMinutes = endMin - startMin;
  const totalHours = totalMinutes / 60;

  // Determine Day Type
  const dateObj = new Date(input.date);
  const dayOfWeek = dateObj.getDay(); // 0 = Sun, 6 = Sat
  
  let dayType: ShiftResult['dayType'] = 'Weekday';
  
  if (input.isBankHoliday) {
    dayType = 'Bank Holiday';
  } else if (dayOfWeek === 0 || dayOfWeek === 6) {
    dayType = 'Weekend';
  }

  // --- ON CALL CALCULATION ---
  if (input.type === 'on-call') {
    // Rules: Mon-Fri £1, Sat-Sun £1.25, Bank Holiday £2
    let hourlyRate = 1.00;
    
    if (input.isBankHoliday) {
      hourlyRate = 2.00;
    } else if (dayType === 'Weekend') {
      hourlyRate = 1.25;
    }

    const totalPay = totalHours * hourlyRate;

    return {
      ...input,
      totalHours,
      dayType,
      overtimeMultiplier: 1, // Not applicable in the same way
      baseRate: hourlyRate, // Override base rate with the effective on-call rate for display
      baseOvertimePay: totalPay, // Put all pay in base for on-call
      unsociablePay15: 0,
      unsociablePay30: 0,
      totalPay,
      hours15: 0,
      hours30: 0
    };
  }

  // --- OVERTIME CALCULATION ---
  
  let overtimeMultiplier = 1.5; // Default Mon-Fri

  if (input.isBankHoliday) {
    overtimeMultiplier = 2.0;
  } else if (dayType === 'Weekend') {
    overtimeMultiplier = 1.75;
  }

  const baseOvertimePay = totalHours * input.baseRate * overtimeMultiplier;

  // Calculate Unsociable Hours Premiums
  let mins15 = 0;
  let mins30 = 0;

  for (let m = startMin; m < endMin; m++) {
    const currentM = m % 1440;

    // Check 15% zone (20:00 - 23:00) -> 1200 to 1380
    if (currentM >= 1200 && currentM < 1380) {
      mins15++;
    }
    // Check 30% zone (23:00 - 06:00) -> 1380 to 1440 OR 0 to 360
    else if (currentM >= 1380 || currentM < 360) {
      mins30++;
    }
  }

  const hours15 = mins15 / 60;
  const hours30 = mins30 / 60;

  const unsociablePay15 = hours15 * input.baseRate * 0.15;
  const unsociablePay30 = hours30 * input.baseRate * 0.30;

  const totalPay = baseOvertimePay + unsociablePay15 + unsociablePay30;

  return {
    ...input,
    totalHours,
    dayType,
    overtimeMultiplier,
    baseOvertimePay,
    unsociablePay15,
    unsociablePay30,
    totalPay,
    hours15,
    hours30
  };
};
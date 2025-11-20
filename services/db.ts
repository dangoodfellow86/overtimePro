import { db } from './firebase';
import { 
  collection, 
  addDoc, 
  deleteDoc, 
  doc, 
  onSnapshot, 
  query, 
  orderBy, 
  setDoc, 
  getDoc 
} from 'firebase/firestore';
import { ShiftInput } from '../types';

// --- SHIFTS ---

export const subscribeToShifts = (userId: string, callback: (shifts: ShiftInput[]) => void) => {
  if (!db) return () => {};

  const shiftsRef = collection(db, 'users', userId, 'shifts');
  const q = query(shiftsRef, orderBy('date', 'desc'));

  return onSnapshot(q, (snapshot) => {
    const shifts = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as ShiftInput[];
    callback(shifts);
  });
};

export const addShiftToDb = async (userId: string, shift: Omit<ShiftInput, 'id'>) => {
  if (!db) {
    console.error("Firestore DB not initialized. Cannot save shift.");
    return;
  }
  const shiftsRef = collection(db, 'users', userId, 'shifts');
  await addDoc(shiftsRef, shift);
};

export const deleteShiftFromDb = async (userId: string, shiftId: string) => {
  if (!db) return;
  const shiftRef = doc(db, 'users', userId, 'shifts', shiftId);
  await deleteDoc(shiftRef);
};

// --- SETTINGS (Standard Rate) ---

export const subscribeToSettings = (userId: string, callback: (rate: number | null) => void) => {
  if (!db) return () => {};

  const settingsRef = doc(db, 'users', userId, 'settings', 'preferences');
  
  return onSnapshot(settingsRef, (docSnap) => {
    if (docSnap.exists()) {
      callback(docSnap.data().standardRate);
    } else {
      callback(null);
    }
  });
};

export const updateStandardRate = async (userId: string, rate: number) => {
  if (!db) return;
  const settingsRef = doc(db, 'users', userId, 'settings', 'preferences');
  await setDoc(settingsRef, { standardRate: rate }, { merge: true });
};
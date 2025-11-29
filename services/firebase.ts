import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
<<<<<<< HEAD
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
=======
  apiKey: process.env.WEBAPP_FIREBASE_API_KEY,
  authDomain: process.env.WEBAPP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.WEB_FIREBASE_PROJECT_ID,
  storageBucket: process.env.WEB_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.WEB_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.WEB_FIREBASE_APP_ID,
  measurementId: process.env.WEB_FIREBASE_MEASUREMENT_ID
>>>>>>> 0b1b55a5f3bb67b38c528286b7ef3f43f149a5bd
};

// Initialize Firebase
let app;
<<<<<<< HEAD
let auth: any;
let db: any;

try {
  // Check if we are in a browser environment or if config is available
  if (typeof window !== 'undefined' && firebaseConfig.apiKey) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
  }
=======
let auth;
let db;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
>>>>>>> 0b1b55a5f3bb67b38c528286b7ef3f43f149a5bd
} catch (error) {
  console.error("Firebase initialization error.", error);
}

export { auth, db };
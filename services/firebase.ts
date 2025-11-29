import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.WEBAPP_FIREBASE_API_KEY,
  authDomain: process.env.WEBAPP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.WEB_FIREBASE_PROJECT_ID,
  storageBucket: process.env.WEB_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.WEB_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.WEB_FIREBASE_APP_ID,
  measurementId: process.env.WEB_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
let app;
let auth;
let db;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
} catch (error) {
  console.error("Firebase initialization error.", error);
}

export { auth, db };
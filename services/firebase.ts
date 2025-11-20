import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCirR55-4RVyzg9XWk7tU4XyhQg5UVZJSs",
  authDomain: "overtimepro-46e43.firebaseapp.com",
  projectId: "overtimepro-46e43",
  storageBucket: "overtimepro-46e43.firebasestorage.app",
  messagingSenderId: "620748527670",
  appId: "1:620748527670:web:41120445eb4a1003776097",
  measurementId: "G-H49DH5K7KM"
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
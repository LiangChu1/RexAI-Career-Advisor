// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration (replace this if you want to point to a separate project)
const firebaseConfig = {
  apiKey: "AIzaSyAxH86EQsB7i9mSZZjWJNhY3SQcJdyBRoo",
  authDomain: "rex-chatbot-c1051.firebaseapp.com",
  projectId: "rex-chatbot-c1051",
  storageBucket: "rex-chatbot-c1051.appspot.com",
  messagingSenderId: "303369026482",
  appId: "1:303369026482:web:ec3bf95876da1da84802ab",
  measurementId: "G-MTNF6GKR5S"
};
//End of replacement

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const functions = getFunctions(app);
const auth = getAuth(app);

// Export firebase functionality
export { auth, db, functions, httpsCallable };

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCs573Rk0oULruJB8CILpna5Wwy-3sJh1c",
  authDomain: "quickaplit.firebaseapp.com",
  projectId: "quickaplit",
  storageBucket: "quickaplit.appspot.com",
  messagingSenderId: "260281931669",
  appId: "1:260281931669:web:93876d4a6738246de5089c",
  measurementId: "G-ZDK67E5VK1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
setPersistence(auth, browserLocalPersistence);
export const storage = getStorage(app);




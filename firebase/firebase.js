
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'; // ADD THIS
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = { 
  apiKey: "AIzaSyCPpRTZdm7zhWz5yD2VeRQuzqh05Re4cfk", 
  authDomain: "tunedive-30a85.firebaseapp.com", 
  projectId: "tunedive-30a85", 
  storageBucket: "tunedive-30a85.firebasestorage.app", 
  messagingSenderId: "779134173522", 
  appId: "1:779134173522:web:752db7d7a01fe24463fa8b", };

const app = initializeApp(firebaseConfig);

// Initialize Auth with Persistence (fixes your terminal warning)
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

// Initialize and Export Firestore (fixes your collection error)
export const db = getFirestore(app);

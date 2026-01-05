import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCPpRTZdm7zhWz5yD2VeRQuzqh05Re4cfk",
  authDomain: "tunedive-30a85.firebaseapp.com",
  projectId: "tunedive-30a85",
  storageBucket: "tunedive-30a85.firebasestorage.app",
  messagingSenderId: "779134173522",
  appId: "1:779134173522:web:752db7d7a01fe24463fa8b",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

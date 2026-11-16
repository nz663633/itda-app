import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: "itda-1a07d.firebaseapp.com",
  projectId: "itda-1a07d",
  storageBucket: "itda-1a07d.firebasestorage.app",
  messagingSenderId: "438336496525",
  appId: "1:438336496525:web:fdd148633fac05be1013c4",
};

export const app = initializeApp(firebaseConfig);

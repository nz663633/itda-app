import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: "itda-1a07d.firebaseapp.com",
  projectId: "itda-1a07d",
  storageBucket: "itda-1a07d.firebasestorage.app",
  messagingSenderId: "여기에 콘솔의 실제 값",
  appId: "여기에 콘솔의 실제 값",
};

export const app = initializeApp(firebaseConfig);

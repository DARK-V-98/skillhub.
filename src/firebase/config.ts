
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';

export const firebaseConfig = {
  apiKey: "AIzaSyBhXESdlpF8wCVPh7Z2LDbjXWJiDeqpdAg",
  authDomain: "studio-2634168358-5e9d6.firebaseapp.com",
  projectId: "studio-2634168358-5e9d6",
  storageBucket: "studio-2634168358-5e9d6.firebasestorage.app",
  messagingSenderId: "348605322351",
  appId: "1:348605322351:web:b7d0f7c6163fdaa942e99a"
};

function initializeFirebase(): FirebaseApp {
    if (getApps().length) {
        return getApp();
    }
    return initializeApp(firebaseConfig);
}

export const app = initializeFirebase();

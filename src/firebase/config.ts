
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';

export const firebaseConfig = {"apiKey":"AIzaSyA888y9b31GS3tF9aC2t3yT1QWy2c4AW3A","authDomain":"fir-studio-demos.firebaseapp.com","projectId":"fir-studio-demos","storageBucket":"fir-studio-demos.appspot.com","messagingSenderId":"981055254921","appId":"1:981055254921:web:4e701c6291fd2196d44a85","measurementId":"G-56VFEBEG4G"};

function initializeFirebase(): FirebaseApp {
    if (getApps().length) {
        return getApp();
    }
    return initializeApp(firebaseConfig);
}

export const app = initializeFirebase();

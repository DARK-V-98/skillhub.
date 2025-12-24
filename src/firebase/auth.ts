
'use client';
import {
  getAuth,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  createUserWithEmailAndPassword as firebaseCreateUserWithEmailAndPassword,
  signInWithEmailAndPassword as firebaseSignInWithEmailAndPassword,
  sendPasswordResetEmail,
  type User,
} from 'firebase/auth';
import { app } from './config';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

export const signInWithGoogle = async (): Promise<User> => {
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google: ", error);
    throw error;
  }
};

export const signUpWithEmailAndPassword = async (email: string, password: string): Promise<User> => {
    const auth = getAuth(app);
    const userCredential = await firebaseCreateUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Save user to Firestore
    const firestore = getFirestore(app);
    const userRef = doc(firestore, 'users', user.uid);
    await setDoc(userRef, {
        name: user.email?.split('@')[0] || 'New User',
        email: user.email,
        avatar: user.photoURL || `https://i.pravatar.cc/150?u=${user.uid}`,
        role: 'student'
    }, { merge: true });

    return user;
};

export const signInWithEmailAndPassword = async (email: string, password: string): Promise<User> => {
    const auth = getAuth(app);
    const userCredential = await firebaseSignInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
};


export const signOut = async () => {
  const auth = getAuth(app);
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error("Error signing out: ", error);
  }
};

export const sendPasswordReset = async (email: string): Promise<void> => {
    const auth = getAuth(app);
    await sendPasswordResetEmail(auth, email);
};

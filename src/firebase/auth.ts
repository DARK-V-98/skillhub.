
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
  updateProfile,
  type User,
} from 'firebase/auth';
import { app } from './config';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

export const signInWithGoogle = async (): Promise<User> => {
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Save or update user in Firestore, ensuring a role exists
    const firestore = getFirestore(app);
    const userRef = doc(firestore, 'users', user.uid);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists() || !userDoc.data()?.role) {
      // If user is new OR an existing user is missing a role, set it.
      await setDoc(userRef, {
          name: user.displayName,
          username: user.email?.split('@')[0],
          email: user.email,
          avatar: user.photoURL,
          role: 'user' // Default role
      }, { merge: true });
    }
    
    return user;
  } catch (error) {
    console.error("Error signing in with Google: ", error);
    throw error;
  }
};

export const signUpWithEmailAndPassword = async (email: string, password: string, username: string): Promise<User> => {
    const auth = getAuth(app);
    const userCredential = await firebaseCreateUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await updateProfile(user, { displayName: username });
    
    // Save user to Firestore with a default role
    const firestore = getFirestore(app);
    const userRef = doc(firestore, 'users', user.uid);
    await setDoc(userRef, {
        name: username,
        username: username,
        email: user.email,
        avatar: user.photoURL || `https://i.pravatar.cc/150?u=${user.uid}`,
        role: 'user' // Default role for new sign-ups
    });

    return user;
};

export const signInWithEmailAndPassword = async (email: string, password: string): Promise<User> => {
    const auth = getAuth(app);
    const userCredential = await firebaseSignInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Ensure user data is in Firestore and has a role
    const firestore = getFirestore(app);
    const userRef = doc(firestore, 'users', user.uid);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists() || !userDoc.data()?.role) {
       await setDoc(userRef, {
            name: user.displayName || user.email?.split('@')[0],
            username: user.displayName || user.email?.split('@')[0],
            email: user.email,
            avatar: user.photoURL || `https://i.pravatar.cc/150?u=${user.uid}`,
            role: 'user'
        }, { merge: true });
    }

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

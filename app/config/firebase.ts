// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyAFfCTws8322JJC2t8I3cXCeNORuyFH7ek',
  authDomain: 'yesik-gym.firebaseapp.com',
  projectId: 'yesik-gym',
  storageBucket: 'yesik-gym.appspot.com',
  messagingSenderId: '827136110919',
  appId: '1:827136110919:web:ed9eba3f1c190998359c62',
  measurementId: 'G-FYH10D7TQB',
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize services (Auth with persistence and Firestore)
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage), 
});

export const firestore = getFirestore(app);

export default app;

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyARlfKRxET2UaiIMe4t7zDapYxwcXqpmtg",
  authDomain: "effichat-4f6c6.firebaseapp.com",
  projectId: "effichat-4f6c6",
  storageBucket: "effichat-4f6c6.firebasestorage.app",
  messagingSenderId: "64940294634",
  appId: "1:64940294634:web:caad0f45e1445aea4bf293"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app, "gs://effichat-4f6c6.firebasestorage.app");
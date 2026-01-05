import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, browserLocalPersistence, setPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyA6m3A92d29iO4F7szFX04vf8Lh5oRapfM",
  authDomain: "ba14-dcddb.firebaseapp.com",
  projectId: "ba14-dcddb",
  storageBucket: "ba14-dcddb.firebasestorage.app",
  messagingSenderId: "785275492010",
  appId: "1:785275492010:web:b6bc2ef94d4832eb51a2d3",
  measurementId: "G-33X2W9E7VS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Set persistence to LOCAL for cross-browser compatibility
setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.error("Error setting persistence:", error);
});

export const googleProvider = new GoogleAuthProvider();
// Force account selection and ensure fresh login
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export const db = getFirestore(app);
export const storage = getStorage(app);

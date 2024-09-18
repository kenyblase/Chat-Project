import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "chit-chat10.firebaseapp.com",
  projectId: "chit-chat10",
  storageBucket: "chit-chat10.appspot.com",
  messagingSenderId: "70204433963",
  appId: "1:70204433963:web:58ec65073f01cd70c4ec6e"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth()
export const db = getFirestore()
export const storage = getStorage()
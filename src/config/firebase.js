import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Safe and secure production config using your direct variables
const firebaseConfig = {
  apiKey: "AIzaSyATzBfqFmakxDy_lrDIyAhzJgjNrA5pPZM", 
  authDomain: "blood-bank-network-7c157.firebaseapp.com",
  projectId: "blood-bank-network-7c157",
  storageBucket: "blood-bank-network-7c157.firebasestorage.app",
  messagingSenderId: "412621646334",
  appId: "1:412621646334:web:63f299d720d692eb4ff8af"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
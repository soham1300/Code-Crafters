import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB080oWM6DiVwNtZFBYSMtHH1XD9RHFgsA",
  authDomain: "codecrafters-6d4fe.firebaseapp.com",
  projectId: "codecrafters-6d4fe",
  storageBucket: "codecrafters-6d4fe.appspot.com",
  messagingSenderId: "861798300457",
  appId: "1:861798300457:web:81d42fdafec1a4de9e1538",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore(app);

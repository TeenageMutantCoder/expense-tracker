// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBX_ZRfQATFLlqG39YT2trRGue6jafLPTc",
  authDomain: "expense-tracker---dev.firebaseapp.com",
  projectId: "expense-tracker---dev",
  storageBucket: "expense-tracker---dev.appspot.com",
  messagingSenderId: "658687320199",
  appId: "1:658687320199:web:8ac39830eb1fdc075d1822",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);

export default app;

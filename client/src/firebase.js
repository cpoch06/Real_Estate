// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "real-estate-1e4c9.firebaseapp.com",
  projectId: "real-estate-1e4c9",
  storageBucket: "real-estate-1e4c9.appspot.com",
  messagingSenderId: "208039387712",
  appId: "1:208039387712:web:053820e6da79d9c20db5a5"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
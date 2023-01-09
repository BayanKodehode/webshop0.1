// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAAcupZAtYV2NYEktfgiTNs2AMJFnci4BE",
  authDomain: "webshop-e5ac6.firebaseapp.com",
  projectId: "webshop-e5ac6",
  storageBucket: "webshop-e5ac6.appspot.com",
  messagingSenderId: "921850630951",
  appId: "1:921850630951:web:5ac7ae267155239b0a8f02",
  measurementId: "G-LR2HML1C3D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const firestore = getFirestore(app);

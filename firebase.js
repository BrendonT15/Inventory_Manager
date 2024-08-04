// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAkwj6hpgukmzUOLgUHzgrwwp9xn5PN5A8",
  authDomain: "inventory-management-18b50.firebaseapp.com",
  projectId: "inventory-management-18b50",
  storageBucket: "inventory-management-18b50.appspot.com",
  messagingSenderId: "636232720206",
  appId: "1:636232720206:web:e04083c13ea37332d2c81f",
  measurementId: "G-V4EJSPDTBG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export {firestore};
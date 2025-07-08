import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAB3Mtrp0OWwOB7dqiusIdRANQ1g_1dZjc",
  authDomain: "quizz-partner.firebaseapp.com",
  databaseURL: "https://quizz-partner-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "quizz-partner",
  storageBucket: "quizz-partner.firebasestorage.app",
  messagingSenderId: "422199884480",
  appId: "1:422199884480:web:7b6bf83e86e59268370b25",
  measurementId: "G-03SV4TWPL2"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
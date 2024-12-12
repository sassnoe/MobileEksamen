// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD9b9EgclwfLm22ioQ57osvY1_7b1DvP9s",
  authDomain: "mobileexam-5b805.firebaseapp.com",
  projectId: "mobileexam-5b805",
  storageBucket: "mobileexam-5b805.firebasestorage.app",
  messagingSenderId: "405771523804",
  appId: "1:405771523804:web:18126287097028c8894619",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export const database = firebase.database();
export { auth };

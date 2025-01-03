import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD9b9EgclwfLm22ioQ57osvY1_7b1DvP9s",
  authDomain: "mobileexam-5b805.firebaseapp.com",
  projectId: "mobileexam-5b805",
  storageBucket: "mobileexam-5b805.appspot.com",
  messagingSenderId: "405771523804",
  appId: "1:405771523804:web:18126287097028c8894619",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore and Authentication
const auth = getAuth(app);
const firestore = getFirestore(app);

export { auth, firestore };

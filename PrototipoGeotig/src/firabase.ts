import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAwm4ZKltZJ58JfektILt4kH93X9SNGfqE",
  authDomain: "geotiguni.firebaseapp.com",
  projectId: "geotiguni",
  storageBucket: "geotiguni.firebasestorage.app",
  messagingSenderId: "30686846206",
  appId: "1:30686846206:web:67578966efcd63eff419af",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

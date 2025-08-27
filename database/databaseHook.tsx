import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import {apiKey, appId, measurementId, messagingSenderId} from "../env";
const firebaseConfig = {
  apiKey: apiKey,
  authDomain: "resturantprojectapp.firebaseapp.com",
  projectId: "resturantprojectapp",
  storageBucket: "resturantprojectapp.firebasestorage.app",
  messagingSenderId: messagingSenderId,
  appId: appId,
  measurementId: measurementId
};
const app = initializeApp(firebaseConfig);
const auth =getAuth(app);
const db= getFirestore(app);
export {auth ,db};
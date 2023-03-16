import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { firebaseConfig } from "./config";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const userAuth = getAuth(app);
export const fbFunctions = getFunctions(app, "europe-central2");
connectFunctionsEmulator(fbFunctions, "localhost", 5001);

import { initializeApp } from "firebase/app";
import { getAuth} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { firebaseConfig } from "./config";

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const userAuth = getAuth(app);
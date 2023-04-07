import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { callWithTimeout } from "../../../utils";
import { userAuth } from "../firebase";

export const logIn = async (email: string, password: string) => {
  let signInAttempt = signInWithEmailAndPassword(userAuth, email, password);
  await callWithTimeout(signInAttempt, 1000, "Sign-in timed out");
};

export const logOut = async () => {
  let signOutAttempt = signOut(userAuth);
  await callWithTimeout(signOutAttempt, 1000, "Sign-out timed out");
};

import { signInWithEmailAndPassword, signOut, User } from "firebase/auth";
import { callWithTimeout } from "../../../utils";
import { userAuth } from "../firebase";

export const logIn = async (email: string, password: string) => {
  try {
    let signInAttempt = signInWithEmailAndPassword(userAuth, email, password);
    await callWithTimeout(signInAttempt, 1000, "Sign-in timed out");
  } catch (error) {
    console.error(error);
  }
};

export const logOut = async () => {
  try {
    let signOutAttempt = signOut(userAuth);
    await callWithTimeout(signOutAttempt, 1000, "Sign-out timed out");
  } catch (error) {
    console.error(error);
  }
};

export const getCurrentUser = (): User | null => {
  try {
    const user = userAuth.currentUser;
    return user;
  } catch (error) {
    console.error(error);
  }
};

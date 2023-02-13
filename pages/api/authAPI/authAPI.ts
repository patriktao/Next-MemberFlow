import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { userAuth } from "../firebase";

export const logIn = async (email: string, password: string) => {
  return new Promise((resolve, reject) => {
    let signInAttempt = signInWithEmailAndPassword(userAuth, email, password);

    let timeoutId = setTimeout(() => {
      reject(new Error("Sign-in timed out"));
    }, 3000);

    signInAttempt
      .then((user) => {
        clearTimeout(timeoutId);
        resolve(user);
      })
      .catch((error) => {
        clearTimeout(timeoutId);
        reject(error);
      });
  });
};

export const logOut = async () => {
  return new Promise((resolve, reject) => {
    let signOutAttempt = signOut(userAuth);

    let timeoutId = setTimeout(() => {
      reject(new Error("Sign-out timed out"));
    }, 1000);

    signOutAttempt
      .then((user) => {
        clearTimeout(timeoutId);
        resolve(user);
      })
      .catch((error) => {
        clearTimeout(timeoutId);
        reject(error);
      });
  });
};



import { signInWithEmailAndPassword } from "firebase/auth";
import { userAuth } from "../firebase";

export const signIn = async (email: string, password: string) => {
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
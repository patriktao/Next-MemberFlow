import { httpsCallable } from "firebase/functions";
import { fbFunctions } from "../firebase";

export const addAdmin = (email: string) => {
  const addAdmin = httpsCallable(fbFunctions, "addAdmin");
  return addAdmin({
    email: email,
  });
};

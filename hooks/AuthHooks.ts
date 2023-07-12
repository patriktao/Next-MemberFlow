import { CreateToastFnReturn, useToast } from "@chakra-ui/react";
import {
  setPersistence,
  browserLocalPersistence,
  getAuth,
} from "firebase/auth";
import { logIn, getCurrentUser } from "../pages/api/authAPI/authAPI";
import { defaultToastProps } from "../utils";

interface authenticateProps {
  setLoading: Function;
  email: string;
  password: string;
  setErrorMessage: Function;
  setAuthUser: Function;
  pushUrl: Function;
  toast: CreateToastFnReturn;
}

export function authenticateHook({
  setLoading,
  email,
  password,
  setErrorMessage,
  setAuthUser,
  pushUrl,
  toast,
}: authenticateProps) {
  const auth = getAuth();

  setLoading(true);
  setPersistence(auth, browserLocalPersistence)
    .then(() =>
      logIn(email, password)
        .then(async () => {
          try {
            toast({
              title: "Successfully logged in.",
              status: "success",
              ...defaultToastProps,
            });
            localStorage.setItem(
              "authToken",
              await getCurrentUser().getIdToken()
            );
            setAuthUser(getCurrentUser().email);
            pushUrl("/home");
            setLoading(false);
          } catch (error) {
            setErrorMessage(error.message);
            console.error("Error signing in:", error);
            setLoading(false);
          }
        })
        .catch((error) => {
          setErrorMessage(error.message);
          console.error("Error signing in:", error);
          setLoading(false);
        })
    )
    .catch((error) => {
      console.log(error.code);
      console.log(error.message);
    });
}

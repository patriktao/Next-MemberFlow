import { useState } from "react";
import { useRouter } from "next/router";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Stack,
  useToast,
} from "@chakra-ui/react";

import { getCurrentUser, logIn } from "../../pages/api/authAPI/authAPI";
import displayToast from "../ui_components/Toast";
import InputEmail from "../ui_components/InputEmail";
import InputPassword from "../ui_components/InputPassword";
import LoadingButton from "../ui_components/LoadingButton";
import {
  getAuth,
  setPersistence,
  browserSessionPersistence,
  signInWithEmailAndPassword,
  browserLocalPersistence,
} from "firebase/auth";

type Props = {};

const AuthForm: React.FC<Props> = (props: Props) => {
  /* States */
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setLoading] = useState(false);

  /* Conditions */
  const emailError = email === "";
  const passwordError = password === "";

  /* Functions */
  const router = useRouter();
  const toast = useToast();

  const auth = getAuth();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    setLoading(true);
    //SetPersistance is used to persist a user's session
    setPersistence(auth, browserLocalPersistence)
      .then(() => {
        return logIn(email, password)
          .then(async () => {
            displayToast({
              toast: toast,
              title: "Successfully logged in.",
              status: "success",
            });
            localStorage.setItem(
              "authToken",
              await getCurrentUser().getIdToken()
            );
            router.push("/home");
            console.log(getCurrentUser());
            setLoading(false);
          })
          .catch((error) => {
            setErrorMessage(error.message);
            console.error("Error signing in:", error);
            setLoading(false);
          });
      })
      .catch((error) => {
        console.log(error.code);
        console.log(error.message);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing="4">
        <InputEmail
          errorMessage={errorMessage}
          setEmail={(e) => {
            setEmail(e.target.value);
            setErrorMessage("");
          }}
          emailError={emailError}
          value={email}
          id="email"
        />
        <InputPassword
          errorMessage={errorMessage}
          setPassword={(e) => {
            setPassword(e.target.value);
            setErrorMessage("");
          }}
          passwordError={passwordError}
          value={password}
          id="password"
        />
        {errorMessage && (
          <Alert status="error">
            <AlertIcon />
            <AlertTitle>Wrong login credentials</AlertTitle>
            <AlertDescription>
              Either wrong email or password, or user doesn't exist
            </AlertDescription>
          </Alert>
        )}
        <LoadingButton color="blue" isLoading={isLoading}>
          Login
        </LoadingButton>
      </Stack>
    </form>
  );
};

export default AuthForm;

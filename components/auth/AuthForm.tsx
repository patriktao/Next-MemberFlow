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

import { logIn } from "../../pages/api/authAPI/authAPI";
import displayToast from "../ui_components/Toast";
import InputEmail from "../ui_components/InputEmail";
import InputPassword from "../ui_components/InputPassword";
import LoadingButton from "../ui_components/LoadingButton";

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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    setLoading(true);
    logIn(email, password)
      .then(() => {
        displayToast({
          toast: toast,
          title: "Successfully logged in.",
          status: "success",
        });
        router.push("/dashboard");
        setLoading(false);
      })
      .catch((error) => {
        setErrorMessage(error.message);
        console.error("Error signing in:", error);
        setLoading(false);
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

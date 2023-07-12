import { useContext, useState } from "react";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Stack,
  useToast,
} from "@chakra-ui/react";
import InputEmail from "../ui_components/InputEmail";
import InputPassword from "../ui_components/InputPassword";
import LoadingSubmitButton from "../ui_components/LoadingSubmitButton";
import { authenticateHook } from "../../hooks/AuthHooks";
import { AuthContext } from "../../pages/contexts/AuthContext";
import { useRouter } from "next/router";

type Props = {};

const AuthForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setLoading] = useState(false);

  const emailError = email === "";
  const passwordError = password === "";
  const toast = useToast();
  const { setAuthUser } = useContext(AuthContext);
  const router = useRouter();

  /* Functions */
  function pushUrl(url: string) {
    router.push(url);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    authenticateHook({
      setLoading: setLoading,
      email: email,
      password: password,
      setErrorMessage: setErrorMessage,
      setAuthUser: setAuthUser,
      pushUrl: pushUrl,
      toast: toast,
    });
  }

  /* Render */
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
        <LoadingSubmitButton color="blue" isLoading={isLoading}>
          Login
        </LoadingSubmitButton>
      </Stack>
    </form>
  );
};

export default AuthForm;

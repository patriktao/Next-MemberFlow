import { useState } from "react";
import { useRouter } from "next/router";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Spinner,
  Stack,
  useToast,
} from "@chakra-ui/react";

import { logIn } from "../../pages/api/authAPI/authAPI";
import displayToast from "../ui_components/Toast";

type Props = {};

const AuthForm = (props: Props) => {
  /* States */
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setLoading] = useState(false);

  /* Function Retrieval */
  const router = useRouter();
  const toast = useToast();

  /* Conditions */
  const emailError = email === "";
  const passwordError = password === "";

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      logIn(email, password)
        .then((user) => {
          console.log("Signed in as:", user);
          setErrorMessage("");
          setEmail("");
          setPassword("");
          displayToast({
            toast: toast,
            title: "Successfully logged in!",
            status: "success",
          });
          router.push("/dashboard");
        })
        .catch((error) => {
          setErrorMessage(error.message);
          console.error("Error signing in:", error);
        });
      setLoading(false);
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing="4">
        <FormControl id="email" isInvalid={Boolean(errorMessage)}>
          <FormLabel>Email address</FormLabel>
          <Input
            type="email"
            placeholder="Enter your email..."
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErrorMessage("");
            }}
            isRequired
          />
          {!emailError ? (
            ""
          ) : (
            <FormErrorMessage> Email is required </FormErrorMessage>
          )}
        </FormControl>
        <FormControl id="password" isInvalid={Boolean(errorMessage)}>
          <FormLabel>Password</FormLabel>
          <Input
            type="password"
            value={password}
            placeholder="Enter your password..."
            onChange={(e) => {
              setPassword(e.target.value);
              setErrorMessage("");
            }}
            isRequired
          />
          {!passwordError ? (
            ""
          ) : (
            <FormErrorMessage> Password is required </FormErrorMessage>
          )}
        </FormControl>
        {errorMessage && (
          <Alert status="error">
            <AlertIcon />
            <AlertTitle>Wrong login credentials</AlertTitle>
            <AlertDescription>
              Either wrong email or password, or user doesn't exist
            </AlertDescription>
          </Alert>
        )}
        <Button
          type="submit"
          colorScheme="blue"
          size="lg"
          isLoading={isLoading}
          spinnerPlacement={"start"}
          spinner={
            <Spinner
              style={{ marginLeft: "0.5rem" }}
              thickness="4px"
              speed="0.65s"
              emptyColor="gray.200"
              color="blue.500"
              size="md"
            />
          }
        >
          Login
        </Button>
      </Stack>
    </form>
  );
};

export default AuthForm;

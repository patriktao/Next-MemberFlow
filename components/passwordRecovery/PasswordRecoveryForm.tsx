import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Button,
  Spinner,
  Stack,
} from "@chakra-ui/react";
import {
  ChangeEvent,
  useState,
} from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { userAuth } from "../../pages/api/firebase";
import InputEmail from "../ui_components/InputEmail";

type Props = {};

const PasswordRecoveryForm: React.FC<Props> = (props: Props) => {
  const [email, setEmail] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isLoading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  const emailError = email === "";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      await sendPasswordResetEmail(userAuth, email);
      setSuccess(true);
      setEmail("");
    } catch (err) {
      setSuccess(false);
      console.error(err);
      setErrorMessage(err.message);
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing="4">
        <InputEmail
          errorMessage={errorMessage}
          setEmail={(e: ChangeEvent<HTMLInputElement>) => {
            setEmail(e.target.value);
            setErrorMessage("");
          }}
          emailError={emailError}
          value={email}
        ></InputEmail>
        {success && (
          <Alert status="success">
            <AlertIcon />
            <AlertTitle>An email has been sent to your inbox!</AlertTitle>
          </Alert>
        )}
        {errorMessage && (
          <Alert status="error">
            <AlertIcon />
            <AlertTitle>User is not found.</AlertTitle>
            <AlertDescription>
              Maybe your email is wrong, or it doesn't exist.
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
          Reset Password
        </Button>
      </Stack>
    </form>
  );
};

export default PasswordRecoveryForm;

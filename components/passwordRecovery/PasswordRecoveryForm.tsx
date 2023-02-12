import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Spinner,
  Stack,
} from "@chakra-ui/react";
import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { userAuth } from "../../pages/api/firebase";

type Props = {};

const PasswordRecoveryForm = (props: Props) => {
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const emailError = email === "";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await sendPasswordResetEmail(userAuth, email);
      setSuccess(true);
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  return (
    <Box>
      <form onSubmit={handleSubmit}>
        <Stack spacing="4">
          <FormControl id="email" isInvalid={Boolean(errorMessage)}>
            <FormLabel>Email address</FormLabel>
            <Input
              type="email"
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
    </Box>
  );
};

export default PasswordRecoveryForm;

import { LockIcon } from "@chakra-ui/icons";
import {
  FormControl,
  FormLabel,
  InputGroup,
  InputLeftElement,
  Input,
  FormErrorMessage,
} from "@chakra-ui/react";
import React from "react";

interface Props {
  errorMessage: string;
  setPassword: Function;
  setErrorMessage: Function;
  passwordError: boolean;
  value: string;
}

const InputPassword = (props: Props) => {
  return (
    <FormControl id="password" isInvalid={Boolean(props.errorMessage)}>
      <FormLabel>Password</FormLabel>
      <InputGroup>
        <InputLeftElement
          pointerEvents="none"
          children={<LockIcon color="gray.300" />}
        />
        <Input
          type="password"
          value={props.value}
          placeholder="Enter password..."
          onChange={(e) => {
            props.setPassword(e.target.value);
            props.setErrorMessage("");
          }}
          isRequired
        />
      </InputGroup>
      {props.passwordError && (
        <FormErrorMessage> Password is required </FormErrorMessage>
      )}
    </FormControl>
  );
};

export default InputPassword;

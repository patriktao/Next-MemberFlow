import { EmailIcon } from "@chakra-ui/icons";
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
  setEmail: Function;
  setErrorMessage: Function;
  emailError: boolean;
  value: string;
}

const InputEmail = (props: Props) => {
  return (
    <FormControl id="email" isInvalid={Boolean(props.errorMessage)}>
      <FormLabel>Email address</FormLabel>
      <InputGroup>
        <InputLeftElement
          pointerEvents="none"
          children={<EmailIcon color="gray.300" />}
        />
        <Input
          type="email"
          placeholder="Enter email..."
          value={props.value}
          onChange={(e) => {
            props.setEmail(e.target.value);
            props.setErrorMessage("");
          }}
          isRequired
        />
      </InputGroup>
      {props.emailError && (
        <FormErrorMessage> Email is required </FormErrorMessage>
      )}
    </FormControl>
  );
};

export default InputEmail;

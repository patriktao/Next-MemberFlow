import { LockIcon } from "@chakra-ui/icons";
import {
  FormControl,
  FormLabel,
  InputGroup,
  InputLeftElement,
  Input,
  FormErrorMessage,
} from "@chakra-ui/react";
import React, { ChangeEvent, FunctionComponent } from "react";

interface Props {
  errorMessage: string;
  setPassword: Function;
  passwordError: boolean;
  value: string;
  id?: string;
}

const InputPassword: React.FC<Props> = (props: Props) => {
  return (
    <FormControl id="password" isInvalid={Boolean(props.errorMessage)}>
      <FormLabel>Password</FormLabel>
      <InputGroup>
        <InputLeftElement
          pointerEvents="none"
          children={<LockIcon color="gray.300" />}
        />
        <Input
          id={props.id || ""}
          type="password"
          value={props.value}
          placeholder="Enter password..."
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            props.setPassword(e);
          }}
          isRequired
          autoComplete="current-password"
        />
      </InputGroup>
      {props.passwordError && (
        <FormErrorMessage> Password is required </FormErrorMessage>
      )}
    </FormControl>
  );
};

export default InputPassword;

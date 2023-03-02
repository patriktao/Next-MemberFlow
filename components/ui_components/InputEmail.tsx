import { EmailIcon } from "@chakra-ui/icons";
import {
  FormControl,
  FormLabel,
  InputGroup,
  InputLeftElement,
  Input,
  FormErrorMessage,
} from "@chakra-ui/react";
import { ChangeEvent } from "react";

interface Props {
  errorMessage: string;
  setEmail: Function;
  emailError: boolean;
  value: string;
}

const InputEmail: React.FC<Props> = (props: Props) => {
  return (
    <FormControl id="email" isInvalid={Boolean(props.errorMessage)}>
      <FormLabel>Email address</FormLabel>
      <InputGroup>
        <InputLeftElement
          pointerEvents="none"
          children={<EmailIcon color="gray.300" />}
        />
        <Input
          name="email"
          type="email"
          placeholder="Enter email..."
          value={props.value}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            props.setEmail(e);
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

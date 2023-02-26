import React, { ReactNode } from "react";
import { FormControl, FormLabel, Input as ChakraInput } from "@chakra-ui/react";

interface Props {
  value?: string;
  name?: string;
  placeholder?: string;
  isRequired?: boolean;
  onChange: Function;
  size?: string;
  type?: string;
  label?: ReactNode | string;
  maxLength?: number;
}

const Input: React.FC<Props> = (props: Props) => {
  return (
    <FormControl>
      <FormLabel>{props.label || ""}</FormLabel>
      <ChakraInput
        maxLength={props.maxLength || 50}
        value={props.value || ""}
        name={props.name || ""}
        placeholder={props.placeholder || ""}
        isRequired={props.isRequired || false}
        onChange={(e) => props.onChange(e)}
        size={props.size || "md"}
        type={props.type || ""}
      />
    </FormControl>
  );
};

export default Input;

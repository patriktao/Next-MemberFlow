import { FormControl, FormLabel } from "@chakra-ui/react";
import React, { ChangeEvent, ReactNode } from "react";
import { Select as ChakraSelect } from "@chakra-ui/react";

interface Props {
  value?: string | number;
  onChange: Function;
  name?: string;
  children?: ReactNode;
  label?: ReactNode | string;
}

const Select: React.FC<Props> = ({
  value,
  onChange,
  name,
  children,
  label,
}: Props) => {
  return (
    <FormControl>
      <FormLabel>{label || ""}</FormLabel>
      <ChakraSelect
        name={name || ""}
        value={value || ""}
        onChange={(e) => onChange(e)}
      >
        {children}
      </ChakraSelect>
    </FormControl>
  );
};

export default Select;

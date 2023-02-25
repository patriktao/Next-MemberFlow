import React from "react";
import { DatePicker } from "@orange_digital/chakra-datepicker";
import { FormControl, FormLabel } from "@chakra-ui/react";

interface Props {
  date?: string;
  onChange?: Function;
  label?: string;
}

const Datepicker: React.FC<Props> = ({ date, onChange, label }: Props) => {
  return (
    <FormControl>
      <FormLabel>{label || ""}</FormLabel>
      <DatePicker
        initialValue={Boolean(date) ? new Date(date) : new Date()}
        onDateChange={(value) => onChange(value)}
      />
    </FormControl>
  );
};

export default Datepicker;

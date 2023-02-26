import React from "react";
import { FormControl, FormLabel } from "@chakra-ui/react";
import { SingleDatepicker } from "chakra-dayzed-datepicker";

interface Props {
  date?: string;
  onChange?: Function;
  label?: string;
  name?: string;
}

const Datepicker: React.FC<Props> = ({
  date,
  onChange,
  label,
  name,
}: Props) => {
  return (
    <FormControl>
      <FormLabel>{label || ""}</FormLabel>
      <SingleDatepicker
        name={name || ""}
        date={Boolean(date) ? new Date(date) : new Date()}
        onDateChange={(e) => onChange(e)}
      />
    </FormControl>
  );
};

export default Datepicker;

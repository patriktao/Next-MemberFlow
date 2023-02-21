import React from "react";
import { DatePicker } from "@orange_digital/chakra-datepicker";

interface Props {
  date?: string;
  onChange?: Function;
}

const Datepicker = (props: Props) => {
  return (
    <DatePicker
      initialValue={Boolean(props.date) ? new Date(props.date) : new Date()}
      onDateChange={(value) => props.onChange(value)}
    />
  );
};

export default Datepicker;

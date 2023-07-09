import { Box, Checkbox } from "@chakra-ui/react";
import { HTMLProps, useRef, useEffect } from "react";

const TableRowCheckbox = ({
  indeterminate,
  className = "",
  ...rest
}: { indeterminate?: boolean } & HTMLProps<HTMLInputElement>) => {
  const ref = useRef<HTMLInputElement>(null!);

  useEffect(() => {
    if (typeof indeterminate === "boolean") {
      ref.current.indeterminate = !rest.checked && indeterminate;
    }
  }, [ref, indeterminate]);

  return (
    <Box display="grid" py="0">
      <Checkbox
        colorScheme={"teal"}
        ref={ref}
        isChecked={rest.checked}
        onChange={rest.onChange}
      />
    </Box>
  );
};

export default TableRowCheckbox;

import { Box, Checkbox } from "@chakra-ui/react";
import { createColumnHelper } from "@tanstack/react-table";
import { DocumentData } from "firebase/firestore";
import { HTMLProps, useEffect, useRef } from "react";
import { getTimestamp } from "../../utils/date-utils";

const columnHelper = createColumnHelper<DocumentData>();

const IndeterminateCheckbox = ({
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
    <Box display="grid">
      <Checkbox ref={ref} isChecked={rest.checked} onChange={rest.onChange} />
    </Box>
  );
};

export const RequestTableColumns = [
  {
    id: "select",
    header: ({ table }) => (
      <Box display="flex">
        <IndeterminateCheckbox
          {...{
            checked: table.getIsAllRowsSelected(),
            indeterminate: table.getIsSomeRowsSelected(),
            onChange: table.getToggleAllRowsSelectedHandler(),
          }}
        />
      </Box>
    ),
    cell: ({ row }) => (
      <IndeterminateCheckbox
        {...{
          checked: row.getIsSelected(),
          disabled: !row.getCanSelect(),
          indeterminate: row.getIsSomeSelected(),
          onChange: row.getToggleSelectedHandler(),
        }}
      />
    ),
  },
  columnHelper.accessor("name", {
    cell: (info) => info.getValue(),
    header: "Name",
  }),
  columnHelper.accessor("email", {
    cell: (info) => info.getValue(),
    header: "Email",
    meta: {
      isNumeric: true,
    },
  }),
  columnHelper.accessor("ssn", {
    cell: (info) => info.getValue(),
    header: "SSN",
  }),
  columnHelper.accessor("gender", {
    cell: (info) => info.getValue(),
    header: "Gender",
  }),
  columnHelper.accessor("reg_date", {
    cell: (info) => getTimestamp(info.getValue()),
    header: "Reg Date",
  }),
  columnHelper.accessor("period", {
    cell: (info) => info.getValue(),
    header: "Period",
  }),
  columnHelper.accessor("afMember", {
    cell: (info) => info.getValue(),
    header: "AF Member?",
  }),
  columnHelper.accessor("payMethod", {
    cell: (info) => info.getValue(),
    header: "Payment Method",
  }),
  columnHelper.accessor("hasPaid", {
    cell: (info) => info.getValue(),
    header: "Has Paid",
  }),
];

export default RequestTableColumns;
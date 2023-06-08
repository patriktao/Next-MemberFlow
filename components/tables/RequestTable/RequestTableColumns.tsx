import { EditIcon } from "@chakra-ui/icons";
import { Box, Button, Checkbox } from "@chakra-ui/react";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { DocumentData } from "firebase/firestore";
import { HTMLProps, useEffect, useRef } from "react";
import { RequestTypes } from "../../../types";
import { getTimestamp } from "../../../utils/date-utils";

export const IndeterminateCheckbox = ({
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

const RequestTableColumns = (
  editRow: Function
): ColumnDef<DocumentData, any>[] => {
  const columnHelper = createColumnHelper<DocumentData>();

  return [
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
    columnHelper.accessor(RequestTypes.name, {
      cell: (info) => info.getValue(),
      header: "Name",
    }),
    columnHelper.accessor(RequestTypes.email, {
      header: "Email",
      cell: (info) => info.getValue(),
      meta: {
        isNumeric: true,
      },
    }),
    columnHelper.accessor(RequestTypes.ssn, {
      cell: (info) => info.getValue(),
      header: "SSN",
      enableResizing: true,
    }),
    columnHelper.accessor(RequestTypes.gender, {
      cell: (info) => info.getValue(),
      header: "Gender",
      enableResizing: true,
    }),
    columnHelper.accessor(RequestTypes.regDate, {
      cell: (info) => getTimestamp(info.getValue()),
      header: "Reg Date",
    }),
    columnHelper.accessor(RequestTypes.period, {
      cell: (info) => info.getValue(),
      header: "Period",
    }),
    columnHelper.accessor(RequestTypes.afMember, {
      cell: (info) => info.getValue(),
      header: "AF Member?",
    }),
    columnHelper.accessor(RequestTypes.payMethod, {
      cell: (info) => info.getValue(),
      header: "Payment Method",
    }),
    columnHelper.accessor(RequestTypes.hasPaid, {
      cell: (info) => info.getValue(),
      header: "Has Paid",
    }),
    {
      header: "Edit",
      cell: ({ row }) => (
        <Button
          id={row.id}
          variant="outline"
          size="sm"
          onClick={() => editRow(row)}
          colorScheme="teal"
        >
          <EditIcon fontSize={"20px"} />
        </Button>
      ),
    },
  ];
};

export default RequestTableColumns;

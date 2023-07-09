import { EditIcon } from "@chakra-ui/icons";
import { Box, Button } from "@chakra-ui/react";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { DocumentData } from "firebase/firestore";
import { MemberTypes } from "../../../types";
import { getTimestamp } from "../../../utils/date-utils";
import TableRowCheckbox from "../../ui_components/TableRowCheckbox";

const columnHelper = createColumnHelper<DocumentData>();

const MemberTableColumns = (
  editRow: Function
): ColumnDef<DocumentData, any>[] => {
  const columnHelper = createColumnHelper<DocumentData>();

  return [
    {
      id: "select",
      header: ({ table }) => (
        <Box display="flex">
          <TableRowCheckbox
            {...{
              checked: table.getIsAllRowsSelected(),
              indeterminate: table.getIsSomeRowsSelected(),
              onChange: table.getToggleAllRowsSelectedHandler(),
            }}
          />
        </Box>
      ),
      cell: ({ row }) => (
        <TableRowCheckbox
          {...{
            checked: row.getIsSelected(),
            disabled: !row.getCanSelect(),
            indeterminate: row.getIsSomeSelected(),
            onChange: row.getToggleSelectedHandler(),
          }}
        />
      ),
    },
    columnHelper.accessor(MemberTypes.name, {
      cell: (info) => info.getValue(),
      header: "Name",
    }),
    columnHelper.accessor(MemberTypes.ssn, {
      cell: (info) => info.getValue(),
      header: "SSN",
    }),
    columnHelper.accessor(MemberTypes.email, {
      cell: (info) => info.getValue(),
      header: "Email",
      meta: {
        isNumeric: true,
      },
    }),
    columnHelper.accessor(MemberTypes.gender, {
      cell: (info) => info.getValue(),
      header: "Gender",
    }),
    columnHelper.accessor(MemberTypes.reg_date, {
      cell: (info) => getTimestamp(info.getValue()),
      header: "Reg Date",
    }),
    columnHelper.accessor(MemberTypes.exp_date, {
      cell: (info) => getTimestamp(info.getValue()),
      header: "Exp Date",
    }),
    columnHelper.accessor(MemberTypes.period, {
      cell: (info) => info.getValue(),
      header: "Period",
    }),
    columnHelper.accessor(MemberTypes.status, {
      cell: (info) => info.getValue(),
      header: "Status",
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
          <EditIcon fontSize={"15px"} />
        </Button>
      ),
    },
  ];
};

export default MemberTableColumns;

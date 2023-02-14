import { createColumnHelper } from "@tanstack/react-table";
import type { DocumentData } from "firebase/firestore";
import React from "react";
import { getTimestamp } from "../../utils/date-utils";
import Indetermine

const columnHelper = createColumnHelper<DocumentData>();

const requestTableColumns = [
  {
    id: "select",
    header: ({ table }) => (
      <IndeterminateCheckbox
        {...{
          checked: table.getIsAllRowsSelected(),
          indeterminate: table.getIsSomeRowsSelected(),
          onChange: table.getToggleAllRowsSelectedHandler(),
        }}
      />
    ),
    cell: ({ row }) => (
      <div className="px-1">
        <IndeterminateCheckbox
          {...{
            checked: row.getIsSelected(),
            disabled: !row.getCanSelect(),
            indeterminate: row.getIsSomeSelected(),
            onChange: row.getToggleSelectedHandler(),
          }}
        />
      </div>
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

export default requestTableColumns;

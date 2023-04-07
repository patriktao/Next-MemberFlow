import { createColumnHelper } from "@tanstack/react-table";
import { DocumentData } from "firebase/firestore";
import { getTimestamp } from "../../../utils/date-utils";

const columnHelper = createColumnHelper<DocumentData>();

export const columns = [
  columnHelper.accessor("name", {
    cell: (info) => info.getValue(),
    header: "Name",
  }),
  columnHelper.accessor("ssn", {
    cell: (info) => info.getValue(),
    header: "SSN",
  }),
  columnHelper.accessor("email", {
    cell: (info) => info.getValue(),
    header: "Email",
    meta: {
      isNumeric: true,
    },
  }),
  columnHelper.accessor("gender", {
    cell: (info) => info.getValue(),
    header: "Gender",
  }),
  columnHelper.accessor("reg_date", {
    cell: (info) => getTimestamp(info.getValue()),
    header: "Reg Date",
  }),
  columnHelper.accessor("exp_date", {
    cell: (info) => getTimestamp(info.getValue()),
    header: "Exp Date",
  }),
  columnHelper.accessor("period", {
    cell: (info) => info.getValue(),
    header: "Period",
  }),
  columnHelper.accessor("status", {
    cell: (info) => info.getValue(),
    header: "Status",
  }),
];

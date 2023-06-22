import { createColumnHelper } from "@tanstack/react-table";
import { DocumentData } from "firebase/firestore";
import { MemberTypes } from "../../../types";
import { getTimestamp } from "../../../utils/date-utils";

const columnHelper = createColumnHelper<DocumentData>();

export const MemberTableColumns = [
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
    header: "Reg Date2",
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
];

import { Box, Checkbox } from "@chakra-ui/react";
import { createColumnHelper } from "@tanstack/react-table";
import { DocumentData } from "firebase/firestore";
import { HTMLProps, useEffect, useRef } from "react";

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

const columnHelper = createColumnHelper<DocumentData>();

const AdminTableColumns = [
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
  columnHelper.accessor("email", {
    header: "Email",
    cell: (info) => info.getValue(),
    meta: {
      isNumeric: true,
    },
  }),
];

export default AdminTableColumns;

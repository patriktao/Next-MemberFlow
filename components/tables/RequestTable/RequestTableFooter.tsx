import { Flex, ButtonGroup, Button, Box, Text } from "@chakra-ui/react";
import { Row, Table } from "@tanstack/react-table";
import { DocumentData } from "firebase/firestore";
import { IndeterminateCheckbox } from "./RequestTableColumns";

interface Props {
  selectedRows: Row<DocumentData>[];
  table: Table<DocumentData>;
}

const RequestTableFooter = ({ selectedRows, table }: Props) => {
  return (
    <Flex
      gap={"1rem"}
      flexDirection="row"
      justifyContent="space-between"
      alignItems={"center"}
      className="css-r10se1"
    >
      <Flex gap={"1rem"}>
        <IndeterminateCheckbox
          {...{
            checked: table.getIsAllPageRowsSelected(),
            indeterminate: table.getIsSomePageRowsSelected(),
            onChange: table.getToggleAllPageRowsSelectedHandler(),
          }}
        />
        <Box>Selected: {selectedRows.length}</Box>
      </Flex>
      <Flex gridAutoFlow={"column"} columnGap="1rem">
        <Box flexDirection="row">
          Page
          <Text fontWeight={700}>
            {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </Text>
        </Box>
        <ButtonGroup>
          <Button
            size="sm"
            onClick={() => table.setPageIndex(0)}
            disabled={table.getCanPreviousPage()}
          >
            {"<<"}
          </Button>
          <Button
            size="sm"
            onClick={() => table.previousPage()}
            disabled={table.getCanPreviousPage()}
          >
            {"<"}
          </Button>
          <Button
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            {">"}
          </Button>
          <Button
            size="sm"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            {">>"}
          </Button>
        </ButtonGroup>
      </Flex>
    </Flex>
  );
};

export default RequestTableFooter;

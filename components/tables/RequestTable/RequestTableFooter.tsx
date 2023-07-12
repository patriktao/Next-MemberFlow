import {
  Flex,
  ButtonGroup,
  Button,
  Box,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { Row, Table } from "@tanstack/react-table";
import { DocumentData } from "firebase/firestore";
import { useState } from "react";
import Alert from "../../ui_components/Alert";
import Select from "../../ui_components/Select";
import TableRowCheckbox from "../../ui_components/TableRowCheckbox";
import { acceptRequestHook } from "../../../hooks/RequestHooks";

interface Props {
  selectedRows: Row<DocumentData>[];
  table: Table<DocumentData>;
}

const RequestTableFooter = ({ selectedRows, table }: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [isLoading, setLoading] = useState(false);

  function acceptRequests(): void {
    acceptRequestHook({
      setLoading: setLoading,
      onClose: onClose,
      resetRowSelection: () => table.resetRowSelection(),
      selectedRows: selectedRows,
      toast: toast,
    });
  }

  return (
    <Flex
      padding="12px"
      flexDirection="row"
      justifyContent="space-between"
      alignItems={"center"}
      className="css-r10se1"
    >
      <Flex gap={"8px"} flexDir="column">
        <Flex gap="8px">
          Select Current Page
          <TableRowCheckbox
            {...{
              checked: table.getIsAllPageRowsSelected(),
              indeterminate: table.getIsSomePageRowsSelected(),
              onChange: table.getToggleAllPageRowsSelectedHandler(),
            }}
          />
        </Flex>
        Selected: {selectedRows.length}
      </Flex>
      <Flex gridAutoFlow={"column"} columnGap="1rem" alignItems="center">
        <Flex flexDir={"row"} alignItems="center">
          Page Count
          <Select
            value={table.getState().pagination.pageSize}
            onChange={(e) => {
              table.setPageSize(Number(e.target.value));
            }}
          >
            <option value={10}>10</option>
            <option value={15}>15</option>
            <option value={20}>20</option>
            <option value={25}>25</option>
          </Select>
        </Flex>
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
            isDisabled={!table.getCanPreviousPage()}
          >
            {"<<"}
          </Button>
          <Button
            size="sm"
            onClick={() => table.previousPage()}
            isDisabled={!table.getCanPreviousPage()}
          >
            {"<"}
          </Button>
          <Button
            size="sm"
            onClick={() => table.nextPage()}
            isDisabled={!table.getCanNextPage()}
          >
            {">"}
          </Button>
          <Button
            size="sm"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            isDisabled={!table.getCanNextPage()}
          >
            {">>"}
          </Button>
        </ButtonGroup>
        <Button
          colorScheme="teal"
          isDisabled={selectedRows.length === 0}
          onClick={onOpen}
        >
          accept
        </Button>
        <Alert
          isLoading={isLoading}
          isOpen={isOpen}
          onClose={onClose}
          onClick={() => acceptRequests}
          header={"Accept Requests"}
          body={"Are you sure? You can't undo this action afterwards."}
        />
      </Flex>
    </Flex>
  );
};

export default RequestTableFooter;

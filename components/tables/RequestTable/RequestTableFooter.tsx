import {
  Flex,
  ButtonGroup,
  Button,
  Box,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { PaginationState, Row, Table } from "@tanstack/react-table";
import { DocumentData } from "firebase/firestore";
import { useState } from "react";
import { createMember } from "../../../pages/api/memberAPI/memberAPI";
import { deleteRequest } from "../../../pages/api/requestAPI/requestAPI";
import Alert from "../../ui_components/Alert";
import Select from "../../ui_components/Select";
import displayToast from "../../ui_components/Toast";
import TableRowCheckbox from "../../ui_components/TableRowCheckbox";

interface Props {
  selectedRows: Row<DocumentData>[];
  table: Table<DocumentData>;
}

const RequestTableFooter = ({ selectedRows, table }: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoading, setLoading] = useState(false);

  const toast = useToast();

  function acceptRequests(): void {
    setLoading(true);
    const createPromise = new Promise(async (resolve, reject) => {
      const promises = selectedRows.flatMap((row) => {
        return new Promise((resolve, reject) => {
          createMember(row.original)
            .then((res) => {
              deleteRequest(row.original.requestId)
                .then((res) => resolve(res))
                .catch((error) => reject(error));
              resolve(res);
            })
            .catch((error) => reject(error));
        });
      });

      try {
        const results = await Promise.all(promises); //waiting until all promises fulfilled
        resolve(results); //then we are done
      } catch (error) {
        setLoading(false);
        reject(error); //otherwise reject and error.
      }
    });

    createPromise.then(
      (res) => {
        displayToast({
          toast: toast,
          title: "Successfully accepted requests",
          status: "success",
        });
        table.resetRowSelection();
        onClose();
        setLoading(false);
      },
      (error) => {
        console.log(error);
        displayToast({
          toast: toast,
          title: "Error accepting requests",
          status: "error",
        });
        setLoading(false);
      }
    );
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
          onClick={acceptRequests}
          header={"Accept Requests"}
          body={"Are you sure? You can't undo this action afterwards."}
        />
      </Flex>
    </Flex>
  );
};

export default RequestTableFooter;

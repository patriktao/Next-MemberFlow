import * as React from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  chakra,
  Flex,
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useDisclosure,
  useToast,
  Box,
  ButtonGroup,
  Icon,
} from "@chakra-ui/react";
import {
  ChevronDownIcon,
  TriangleDownIcon,
  TriangleUpIcon,
} from "@chakra-ui/icons";
import {
  useReactTable,
  flexRender,
  getCoreRowModel,
  SortingState,
  getSortedRowModel,
  Row,
  PaginationState,
  getPaginationRowModel,
} from "@tanstack/react-table";
import { useCallback, useEffect, useRef, useState } from "react";
import { collection, DocumentData, onSnapshot } from "firebase/firestore";
import AddRequestModal from "./AddRequestModal";
import { hover_color } from "../../../styles/colors";
import DeleteRowPopover from "../../ui_components/DeleteRowPopover";
import RequestTableColumns from "./RequestTableColumns";
import EditRowForm from "../EditRowForm/EditRowForm";
import FormModal from "../../ui_components/FormModal";
import RequestTableFooter from "./RequestTableFooter";
import deleteRequestHandler from "./DeleteRequestHandler";
import TableOptions from "../TableOptions";
import { db } from "../../../pages/api/firebase";
import ExportCSV from "../../csv/ExportCSV";
import CSVImport from "../../csv/CSVImport";

const RequestTable: React.FC = () => {
  const [fetchedData, setFetchedData] = useState<DocumentData[]>([]);
  const prevData = useRef<DocumentData[]>([]);
  const [tableData, setTableData] = useState<DocumentData[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState<DocumentData>([]);
  const [editingRow, setEditingRow] = useState<Row<DocumentData>>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const pagination = React.useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize]
  );

  const unsub = useCallback((isMounting) => {
    if (isMounting) {
      onSnapshot(collection(db, "requests"), (snapshot) => {
        let requests = prevData.current.map((x) => x);
        snapshot.docChanges().forEach(({ doc, type }) => {
          const personData = doc.data();
          switch (type) {
            case "added":
              if (
                !requests.some(
                  (member) => member.requestId === personData.requestId
                )
              ) {
                requests.push(personData);
              }
              break;
            case "removed":
              requests = requests.filter(
                (member: DocumentData) =>
                  member.requestId !== personData.requestId
              );
              break;
            case "modified":
              requests = requests.filter(
                (member: DocumentData) =>
                  member.requestId !== personData.requestId
              );
              requests.push(personData);
              break;
            default:
              break;
          }
        });
        prevData.current = requests;
        requests.sort((a, b) => a.name.localeCompare(b.name));
        setFetchedData(requests);
        3;
        setTableData(requests);
      });
    }
  }, []);

  useEffect(() => {
    let isMounting = true;
    unsub(isMounting);
    return () => {
      isMounting = false;
    };
  }, [unsub]);

  /* EDIT */
  const editRow = useCallback(
    (row: Row<DocumentData>): void => {
      setEditingRow(row);
    },
    [editingRow]
  );

  const closeEdit = useCallback((): void => {
    setEditingRow(null);
  }, [editingRow]);

  /* TABLE */
  const table = useReactTable({
    columns: RequestTableColumns(editRow),
    data: tableData,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      rowSelection,
      pagination,
    },
  });

  /* Conditions */
  const selectedRows: Row<DocumentData>[] =
    table.getSelectedRowModel().flatRows;

  const rowsSelected: boolean = selectedRows.length > 0;

  function isRowSelected(selected: Row<DocumentData>): Boolean {
    return Boolean(
      selectedRows.find(
        (row) => row.original.requestId === selected.original.requestId
      )
    );
  }

  function formatData(searchTerm: string): void {
    let filteredData = fetchedData;
    if (searchTerm.length !== 0) {
      filteredData = fetchedData.filter(
        (document: DocumentData) =>
          document.name.toLowerCase().includes(searchTerm) ||
          document.email.toLowerCase().includes(searchTerm) ||
          document.ssn.toLowerCase().includes(searchTerm)
      );
    }
    setTableData(filteredData);
  }

  const TableOptionButtons = (
    <ButtonGroup>
      <Button colorScheme="teal" onClick={onOpen}>
        add
      </Button>
      <AddRequestModal isOpen={isOpen} onClose={onClose} />
      <DeleteRowPopover
        isDisabled={!rowsSelected}
        header="Delete selected requests"
        selectedRows={selectedRows}
        resetRowSelection={() => table.resetRowSelection()}
      >
        delete
      </DeleteRowPopover>
      <Menu>
        <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
          actions
        </MenuButton>
        <MenuList>
          <MenuItem>
            <CSVImport />
          </MenuItem>
          <MenuItem>
            <ExportCSV
              data={
                selectedRows.length == 0
                  ? tableData
                  : selectedRows.flatMap((row) => row.original)
              }
              fileName="requests"
            />
          </MenuItem>
        </MenuList>
      </Menu>
    </ButtonGroup>
  );

  const TableComponent = (
    <Table size="sm" overflow={"auto"}>
      <Thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <Tr key={headerGroup.id} >
            {headerGroup.headers.map((header) => {
              const meta: any = header.column.columnDef.meta;
              return (
                <Th
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                  isNumeric={meta?.isNumeric}
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                  <chakra.span pl="0">
                    {header.column.getIsSorted() ? (
                      header.column.getIsSorted() === "desc" ? (
                        <TriangleDownIcon aria-label="sorted descending" />
                      ) : (
                        <TriangleUpIcon aria-label="sorted ascending" />
                      )
                    ) : null}
                  </chakra.span>
                </Th>
              );
            })}
          </Tr>
        ))}
      </Thead>
      <Tbody>
        {table.getRowModel().rows.map((row) => (
          <>
            <Tr key={row.id} _hover={{ background: hover_color }}>
              {row.getVisibleCells().map((cell) => {
                const meta: any = cell.column.columnDef.meta;
                return (
                  <>
                    <Td
                      key={cell.id}
                      isNumeric={meta?.isNumeric}
                      background={isRowSelected(row) ? hover_color : ""}
                      py="1.5"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </Td>
                  </>
                );
              })}
            </Tr>
            {editingRow &&
              editingRow.original.requestId === row.original.requestId && (
                <FormModal
                  isOpen={Boolean(editingRow)}
                  onClose={closeEdit}
                  title={"Edit Request"}
                  size="3xl"
                >
                  <EditRowForm row={editingRow} onClose={closeEdit} />
                </FormModal>
              )}
          </>
        ))}
      </Tbody>
    </Table>
  );

  return (
    <Flex direction="column" overflow="auto">
      <TableOptions
        table={table}
        formatData={formatData}
        tableData={tableData}
        rowsSelected={rowsSelected}
        buttons={TableOptionButtons}
      />
      <Box h="100%" overflow="auto">
        {TableComponent}
      </Box>
      <RequestTableFooter table={table} selectedRows={selectedRows} />
    </Flex>
  );
};

export default RequestTable;

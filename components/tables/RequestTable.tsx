import * as React from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  chakra,
  Box,
  Heading,
  Flex,
  Button,
  Spacer,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  ButtonGroup,
  useDisclosure,
  Input,
  FormControl,
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
} from "@tanstack/react-table";
import { useEffect, useRef, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import type { DocumentData } from "firebase/firestore";
import { db } from "../../pages/api/firebase";
import AddRequestModal from "../request/AddRequestModal";
import requestTableColumns from "./RequestTableColumns";

export function RequestTable() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [data, setData] = useState<DocumentData[]>([]);
  const prevData = useRef<DocumentData[]>([]);
  const [tableData, setTableData] = useState<DocumentData[]>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const unsub = async () =>
      await onSnapshot(collection(db, "requests"), (snapshot) => {
        let requests = prevData.current.map((x) => x);
        snapshot.docChanges().forEach((change) => {
          const personData = change.doc.data();
          const personId = personData.requestId;
          switch (change.type) {
            case "added":
              if (
                !requests.find(
                  (member: DocumentData) => member.requestId === personId
                )
              ) {
                requests.push(personData);
              }
              break;
            case "removed":
              requests = requests.filter(
                (member: DocumentData) => member.requestId !== personId
              );
              break;
            case "modified":
              requests = requests.filter(
                (member: DocumentData) => member.requestId !== personId
              );
              requests.push(personData);
              break;
            default:
              break;
          }
        });
        prevData.current = requests;
        setData(prevData.current);
        setTableData(prevData.current);
        console.log(prevData.current);
      });

    unsub();
  }, []);

  const table = useReactTable({
    columns: requestTableColumns,
    data: tableData,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
      rowSelection,
    },
    enableRowSelection: true, //enable row selection for all rows
    // enableRowSelection: row => row.original.age > 18, // or enable row selection conditionally per row
    onRowSelectionChange: setRowSelection,
  });

  const { isOpen, onOpen, onClose } = useDisclosure();

  function formatData(searchTerm: string) {
    console.log(searchTerm);
    let filteredData = data;
    if (searchTerm.length !== 0) {
      filteredData = data.filter(
        (document: DocumentData) =>
          document.name.toLowerCase().includes(searchTerm) ||
          document.email.toLowerCase().includes(searchTerm) ||
          document.ssn.toLowerCase().includes(searchTerm)
      );
    }
    console.log(filteredData);
    setTableData(filteredData);
  }

  return (
    <Box>
      <Flex marginBottom={"8px"}>
        <Box>
          <Heading as="h3" size="md">
            requests ({tableData.length ?? 0})
          </Heading>
        </Box>
        <Spacer />
        <Flex columnGap={"0.5rem"}>
          <Input
            placeholder="search here..."
            w="300px"
            onChange={(e) => {
              formatData(e.target.value.toLowerCase());
            }}
          />
          <ButtonGroup>
            <Button colorScheme="teal" onClick={onOpen}>
              add
            </Button>
            <AddRequestModal isOpen={isOpen} onClose={onClose} />
            <Button isDisabled={true}>delete</Button>
            <Menu>
              <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                actions
              </MenuButton>
              <MenuList>
                <MenuItem>Import CSV</MenuItem>
                <MenuItem>Export to CSV</MenuItem>
              </MenuList>
            </Menu>
          </ButtonGroup>
        </Flex>
      </Flex>
      <Table size="md">
        <Thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <Tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                // see https://tanstack.com/table/v8/docs/api/core/column-def#meta to type this correctly
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

                    <chakra.span pl="4">
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
            <Tr key={row.id}>
              {row.getVisibleCells().map((cell) => {
                // see https://tanstack.com/table/v8/docs/api/core/column-def#meta to type this correctly
                const meta: any = cell.column.columnDef.meta;
                return (
                  <Td key={cell.id} isNumeric={meta?.isNumeric}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Td>
                );
              })}
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
}

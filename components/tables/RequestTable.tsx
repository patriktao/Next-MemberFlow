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
import { createColumnHelper } from "@tanstack/react-table";
import { useEffect, useRef, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import type { DocumentData } from "firebase/firestore";
import { getTimestamp } from "../../utils/date-utils";
import { db } from "../../pages/api/firebase";
import AddRequestModal from "../request/AddRequestModal";

export function RequestTable() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const columnHelper = createColumnHelper<DocumentData>();
  const [data, setData] = useState<DocumentData[]>([]);
  const prevData = useRef<DocumentData[]>([]);

  useEffect(() => {
    const unsub = async () =>
      await onSnapshot(collection(db, "requests"), (snapshot) => {
        let requests = prevData.current.map((x) => x);
        snapshot.docChanges().forEach((change) => {
          const personData = change.doc.data();
          const personID = personData.id;
          switch (change.type) {
            case "added":
              if (
                !requests.find((member: DocumentData) => member.id === personID)
              ) {
                requests.push(personData);
              }
              break;
            case "removed":
              requests = requests.filter(
                (member: DocumentData) => member.id !== personID
              );
              break;
            case "modified":
              requests = requests.filter(
                (member: DocumentData) => member.id !== personID
              );
              requests.push(personData);
              break;
            default:
              break;
          }
        });
        prevData.current = requests;
        setData(prevData.current);
        console.log(prevData.current);
      });

    unsub();
  }, []);

  const columns = [
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
    columnHelper.accessor("period", {
      cell: (info) => info.getValue(),
      header: "Period",
    }),
    columnHelper.accessor("afMember", {
      cell: (info) => info.getValue(),
      header: "AF Member?",
    }),
    columnHelper.accessor("payment_method", {
      cell: (info) => info.getValue(),
      header: "Payment Method",
    }),
    columnHelper.accessor("has_paid", {
      cell: (info) => info.getValue(),
      header: "Has Paid",
    }),
  ];

  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box>
      <Flex marginBottom={"8px"}>
        <Box>
          <Heading as="h3" size="md">
            requests ({data.length})
          </Heading>
        </Box>
        <Spacer />
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
      <Table size="sm">
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

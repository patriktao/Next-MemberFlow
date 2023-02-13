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

export function MemberTable() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const columnHelper = createColumnHelper<DocumentData>();
  const [data, setData] = useState<DocumentData[]>([]);
  const prevData = useRef<DocumentData[]>([]);

  useEffect(() => {
    const unsub = async () =>
      await onSnapshot(collection(db, "members"), (snapshot) => {
        let members = prevData.current.map((x) => x);
        snapshot.docChanges().forEach((change) => {
          const memberData = change.doc.data();
          const memberId = memberData.id;
          switch (change.type) {
            case "added":
              if (
                !members.find((member: DocumentData) => member.id === memberId)
              ) {
                members.push(memberData);
              }
              break;
            case "removed":
              members = members.filter(
                (member: DocumentData) => member.id !== memberId
              );
              break;
            case "modified":
              members = members.filter(
                (member: DocumentData) => member.id !== memberId
              );
              members.push(memberData);
              break;
            default:
              break;
          }
        });
        prevData.current = members;
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

  return (
    <Box>
      <Flex marginBottom={"8px"}>
        <Box>
          <Heading as="h1" size="lg" paddingBottom="1rem">
            members.
          </Heading>
        </Box>
        <Spacer />
        <Box>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              actions
            </MenuButton>
            <MenuList>
              <MenuItem>Download to CSV</MenuItem>
              <MenuItem>Import to CSV</MenuItem>
              <MenuItem>Delete</MenuItem>
            </MenuList>
          </Menu>
        </Box>
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

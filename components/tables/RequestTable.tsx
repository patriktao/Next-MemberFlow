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
  Text,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  ButtonGroup,
  useDisclosure,
  Input,
  Checkbox,
  useToast,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  PopoverFooter,
  Tfoot,
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
  createColumnHelper,
  Row,
} from "@tanstack/react-table";
import { HTMLProps, useEffect, useRef, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import type { DocumentData } from "firebase/firestore";
import { db } from "../../pages/api/firebase";
import AddRequestModal from "../request/AddRequestModal";
import { hover_color } from "../../styles/colors";
import { getTimestamp } from "../../utils/date-utils";
import { deleteRequest } from "../../pages/api/requestAPI/requestAPI";
import displayToast from "../ui_components/Toast";
import Spinner from "../ui_components/Spinner";

export function RequestTable() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [data, setData] = useState<DocumentData[]>([]);
  const prevData = useRef<DocumentData[]>([]);
  const [tableData, setTableData] = useState<DocumentData[]>([]);
  const [rowSelection, setRowSelection] = useState<DocumentData>([]);
  const [isDeleting, setDeleting] = useState(false);

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
      });

    unsub();
  }, []);

  /* Components */

  const DeleteConfirmation = ({ children }) => {
    return (
      <Popover closeOnBlur={false}>
        <PopoverTrigger>{children}</PopoverTrigger>
        <PopoverContent>
          <PopoverArrow />
          <PopoverCloseButton />
          <PopoverHeader pt={4} fontWeight="bold" border="0">
            Delete selected requests
          </PopoverHeader>
          <PopoverArrow />
          <PopoverBody>
            Are you sure you want to delete the following selected requests?
          </PopoverBody>
          <PopoverFooter border="0" textAlign={"right"} pb={4}>
            <Button
              color="red"
              background="red.100"
              _hover={{ background: "red.50" }}
              onClick={() => {
                handleDelete(selectedRows);
              }}
            >
              delete
            </Button>
          </PopoverFooter>
        </PopoverContent>
      </Popover>
    );
  };

  const columnHelper = createColumnHelper<DocumentData>();

  const requestTableColumns = [
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
    columnHelper.accessor("name", {
      cell: (info) => info.getValue(),
      header: "Name",
    }),
    columnHelper.accessor("email", {
      cell: (info) => info.getValue(),
      header: "Email",
      meta: {
        isNumeric: true,
      },
    }),
    columnHelper.accessor("ssn", {
      cell: (info) => info.getValue(),
      header: "SSN",
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
    columnHelper.accessor("payMethod", {
      cell: (info) => info.getValue(),
      header: "Payment Method",
    }),
    columnHelper.accessor("hasPaid", {
      cell: (info) => info.getValue(),
      header: "Has Paid",
    }),
  ];

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

  const IndeterminateCheckbox = ({
    indeterminate,
    className = "",
    ...rest
  }: { indeterminate?: boolean } & HTMLProps<HTMLInputElement>) => {
    const ref = React.useRef<HTMLInputElement>(null!);

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

  /* Conditions */
  const selectedRows = table.getSelectedRowModel().flatRows;
  const isDeletable = selectedRows.length > 0;

  /* Functions */
  const { isOpen, onOpen, onClose } = useDisclosure();

  function formatData(searchTerm: string) {
    let filteredData = data;
    if (searchTerm.length !== 0) {
      filteredData = data.filter(
        (document: DocumentData) =>
          document.name.toLowerCase().includes(searchTerm) ||
          document.email.toLowerCase().includes(searchTerm) ||
          document.ssn.toLowerCase().includes(searchTerm)
      );
    }
    setTableData(filteredData);
  }

  const toast = useToast();

  function handleDelete(selectedRows: Row<DocumentData>[]) {
    const deletePromise = new Promise((resolve, reject) => {
      setDeleting(true);
      selectedRows.flatMap((e) => {
        setTimeout(() => {
          deleteRequest(e.original.requestId)
            .then(resolve)
            .catch((error) => {
              console.error(error);
              reject();
            });
        }, 1000);
      });
    });
    deletePromise
      .then((result) => {
        displayToast({
          toast: toast,
          title: "Successfully removed requests.",
          status: "success",
          position: "top-right",
        });
        table.resetRowSelection();
        setDeleting(false);
      })
      .catch((error) => {
        console.error(error);
        displayToast({
          toast: toast,
          title: "Error removing requests.",
          status: "error",
          position: "top-right",
        });
        setDeleting(false);
      });
  }

  /* Render */
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
            <DeleteConfirmation>
              <Button
                isDisabled={!isDeletable}
                variant="outline"
                borderColor={isDeleting ? "red" : "gray"}
                isLoading={isDeleting}
                spinner={<Spinner outerColor="red.200" innerColor="red.500" />}
              >
                delete
              </Button>
            </DeleteConfirmation>
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
            <Tr key={row.id} _hover={{ background: hover_color }}>
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
        <Tfoot>
          <Tr>
            <Th colSpan={10}>Selected: {selectedRows.length}</Th>
          </Tr>
        </Tfoot>
      </Table>
    </Box>
  );
}

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
  useToast,
  Tfoot,
  FormControl,
  IconButton,
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
  createColumnHelper,
} from "@tanstack/react-table";
import { useCallback, useEffect, useRef, useState } from "react";
import { collection, DocumentData, onSnapshot } from "firebase/firestore";
import AddRequestModal from "../request/AddRequestModal";
import { hover_color } from "../../styles/colors";
import {
  deleteRequest,
  fetchRequests,
} from "../../pages/api/requestAPI/requestAPI";
import displayToast from "../ui_components/Toast";
import DeleteRowPopover from "./DeleteRowPopover";
import { db } from "../../pages/api/firebase";
import { getTimestamp } from "../../utils/date-utils";
import { IndeterminateCheckbox } from "./RequestTableColumns";

const RequestTable = () => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [data, setData] = useState<DocumentData[]>([]);
  const prevData = useRef<DocumentData[]>([]);
  const [tableData, setTableData] = useState<DocumentData[]>([]);
  const [rowSelection, setRowSelection] = useState<DocumentData>([]);
  const [isDeleting, setDeleting] = useState(false);
  const [isEditing, setEditing] = useState(false);

  const columnHelper = createColumnHelper<DocumentData>();

  const unsub = useCallback(async (isMounting) => {
    if (isMounting) {
      await onSnapshot(collection(db, "requests"), (snapshot) => {
        let requests = prevData.current.map((x) => x);
        snapshot.docChanges().forEach(
          (change) => {
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
          },
          (error) => {
            console.error(error);
          }
        );
        prevData.current = requests;
        setData(prevData.current);
        setTableData(prevData.current);
        console.log(prevData.current);
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

  const RequestTableColumns = [
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
      header: "Email",
      cell: (info) =>
        isEditing ? (
          <FormControl>
            <Input size="sm" defaultValue={info.getValue()} />
          </FormControl>
        ) : (
          info.getValue()
        ),
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
    columns: RequestTableColumns,
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

  /* Conditions */
  const selectedRows: Row<DocumentData>[] =
    table.getSelectedRowModel().flatRows;

  const isDeletable: boolean = selectedRows.length > 0;

  /* Functions */

  function isRowSelected(selected: Row<DocumentData>): Boolean {
    return Boolean(
      selectedRows.find(
        (row) => row.original.requestId === selected.original.requestId
      )
    );
  }

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isPopoverOpen, setPopoverOpen] = useState<boolean>(false);

  function formatData(searchTerm: string): void {
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

  const handleDelete = useCallback(
    (selectedRows: Row<DocumentData>[]): void => {
      const deletePromise = new Promise((resolve, reject) => {
        setDeleting(true);
        selectedRows.flatMap((e) => {
          setTimeout(() => {
            deleteRequest(e.original.requestId)
              .then(resolve)
              .catch((error) => {
                console.error(error);
                setDeleting(false);
                reject();
              });
          }, 1000);
        });
      });

      deletePromise
        .then(() => {
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
    },
    [selectedRows]
  );

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
            <DeleteRowPopover
              selectedRows={selectedRows}
              handleDelete={handleDelete}
              isDisabled={!isDeletable}
              isLoading={isDeleting}
              isOpen={isPopoverOpen}
              setOpen={setPopoverOpen}
            >
              delete
            </DeleteRowPopover>
            <Button
              onClick={() => setEditing(!isEditing)}
              variant={isEditing ? "outline" : "solid"}
            >
              {isEditing ? "unedit" : "edit"}
            </Button>
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
                const meta: any = cell.column.columnDef.meta;
                return (
                  <Td
                    key={cell.id}
                    isNumeric={meta?.isNumeric}
                    background={isRowSelected(row) ? hover_color : "white"}
                  >
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
};

export default RequestTable;

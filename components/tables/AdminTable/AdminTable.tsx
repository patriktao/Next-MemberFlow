import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Table,
  TableContainer,
  Thead,
  TableCaption,
  Tr,
  Th,
  Td,
  Tbody,
  Tfoot,
  Heading,
  Flex,
  Box,
  Spacer,
  Input,
  Button,
  ButtonGroup,
  useToast,
  useDisclosure,
} from "@chakra-ui/react";
import {
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  Row,
  flexRender,
} from "@tanstack/react-table";
import { useReactTable } from "@tanstack/react-table";
import { collection, DocumentData, onSnapshot } from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import { useCallback, useState, useRef, useEffect } from "react";
import { db, fbFunctions } from "../../../pages/api/firebase";
import { hover_color } from "../../../styles/colors";
import { defaultToastProps } from "../../../utils";
import AddAdminModal from "../../admin/AddAdminModal";
import DeleteRowPopover from "../../ui_components/DeleteRowPopover";
import AdminTableColumns from "./AdminTableColumns";

const AdminTable = () => {
  const [tableData, setTableData] = useState<DocumentData[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const prevData = useRef<DocumentData[]>([]);
  const [rowSelection, setRowSelection] = useState<DocumentData>([]);
  const [data, setData] = useState<DocumentData[]>([]);
  const [isDeleting, setDeleting] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isPopoverOpen, setPopoverOpen] = useState<boolean>(false);

  const unsub = useCallback(async (isMounting) => {
    if (isMounting) {
      await onSnapshot(collection(db, "admins"), (snapshot) => {
        let admins = prevData.current.map((x) => x);
        snapshot.docChanges().forEach(
          (change) => {
            const personData = change.doc.data();
            switch (change.type) {
              case "added":
                if (
                  !admins.find((member: DocumentData) => {
                    member.adminID === personData.adminID;
                  })
                ) {
                  admins.push(personData);
                }
                break;
              case "removed":
                admins = admins.filter(
                  (member: DocumentData) => member.email !== personData.email
                );
                break;
              case "modified":
                admins = admins.filter(
                  (member: DocumentData) => member.email !== personData.email
                );
                admins.push(personData);
                break;
              default:
                console.log("DEFAULT");
                break;
            }
          },
          (error) => {
            console.error(error);
          }
        );
        prevData.current = admins;
        setData(prevData.current);
        setTableData(prevData.current);
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

  const table = useReactTable({
    columns: AdminTableColumns,
    data: tableData,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
      rowSelection,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
  });

  /* Conditions */
  const selectedRows: Row<DocumentData>[] =
    table.getSelectedRowModel().flatRows;
  const rowsSelected: boolean = selectedRows.length > 0;

  /* Checks if Row is Selected */
  function isRowSelected(selected: Row<DocumentData>): Boolean {
    return Boolean(
      selectedRows.find(
        (row) => row.original.adminID === selected.original.adminID
      )
    );
  }

  /* FORMAT and SEARCH */
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

  /* DELETE */
  // handleDelete only updates when the selectedRows variable is changed.
  const handleDelete = useCallback(
    (selectedRows: Row<DocumentData>[]): void => {
      const deletePromise = new Promise((resolve, reject) => {
        setDeleting(true);
        selectedRows.flatMap((e) => {
          setTimeout(() => {
            const removeAdmin = httpsCallable(fbFunctions, "removeAdmin");
            removeAdmin({
              email: e.original.email,
              adminID: e.original.adminID,
            })
              .then(() => {
                toast({
                  title: "Successfully removed admin.",
                  status: "success",
                  ...defaultToastProps,
                });
                setDeleting(false);
              })
              .catch((error) => {
                console.log(error);
                toast({
                  title: "Error removing admin.",
                  description: error.message,
                  status: "error",
                  ...defaultToastProps,
                });
                setDeleting(false);
              });
          }, 1000);
        });
      });

      deletePromise
        .then(() => {
          toast({
            title: "Successfully removed admin.",
            status: "success",
            ...defaultToastProps,
          });
          table.resetRowSelection();
          setDeleting(false);
        })
        .catch((error) => {
          console.error(error);
          toast({
            title: "Error removing admin.",
            status: "error",
            ...defaultToastProps,
          });
          setDeleting(false);
        });
    },
    [selectedRows]
  );

  const TableView = (
    <TableContainer>
      <Heading as="h1" size="lg" paddingBottom="1rem">
        list of admins.
      </Heading>
      <Table variant="simple">
        <Tbody>
          {table.getRowModel().rows.map((row) => (
            <>
              <Tr
                key={row.original.adminID}
                _hover={{ background: hover_color }}
              >
                {row.getVisibleCells().map((cell) => {
                  const meta: any = cell.column.columnDef.meta;
                  return (
                    <>
                      <Td
                        key={cell.id}
                        isNumeric={meta?.isNumeric}
                        background={isRowSelected(row) ? hover_color : ""}
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
            </>
          ))}
        </Tbody>
        <Tfoot>
          <Tr>
            <Th colSpan={10}>Selected: {selectedRows.length}</Th>
          </Tr>
        </Tfoot>
      </Table>
    </TableContainer>
  );

  return (
    <Box>
      <Flex marginBottom={"8px"}>
        <Box>
          <Heading as="h3" size="md">
            admins ({tableData.length ?? 0})
          </Heading>
        </Box>
        <Spacer />
        <Flex columnGap={"0.5rem"}>
          <Button
            variant="outline"
            colorScheme="teal"
            isDisabled={!rowsSelected}
            onClick={() => {
              table.resetRowSelection();
              setDeleting(false);
            }}
          >
            deselect
          </Button>
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
            <AddAdminModal
              isOpen={isOpen}
              onClose={onClose}
              toast={toast}
              table={table}
            />
            <DeleteRowPopover
              selectedRows={selectedRows}
              handleDelete={handleDelete}
              isDisabled={!rowsSelected}
              isLoading={isDeleting}
              isOpen={isPopoverOpen}
              setOpen={setPopoverOpen}
            >
              delete
            </DeleteRowPopover>
          </ButtonGroup>
        </Flex>
      </Flex>
      {TableView}
    </Box>
  );
};

export default AdminTable;

import * as React from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  chakra,
  useDisclosure,
} from "@chakra-ui/react";
import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";
import {
  useReactTable,
  flexRender,
  getCoreRowModel,
  SortingState,
  getSortedRowModel,
  isRowSelected,
  Row,
  PaginationState,
  getPaginationRowModel,
} from "@tanstack/react-table";
import { useCallback, useEffect, useRef, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import type { DocumentData } from "firebase/firestore";
import { db } from "../../../pages/api/firebase";
import { MemberTableColumns } from "./MemberTableColumns";
import { hover_color } from "../../../styles/colors";
import FormModal from "../../ui_components/FormModal";
import EditRowForm from "../EditRowForm/EditRowForm";
import RequestTableColumns from "../RequestTable/RequestTableColumns";
import TableOptions from "../TableOptions";
import { memberImport } from "../../csv/ImportHandlers";

export function MemberTable() {
  const [fetchedData, setFetchedData] = useState<DocumentData[]>([]);
  const prevData = useRef<DocumentData[]>([]);
  const [tableData, setTableData] = useState<DocumentData[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState<DocumentData>([]);
  const [isDeleting, setDeleting] = useState(false);
  const [editingRow, setEditingRow] = useState<Row<DocumentData>>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isPopoverOpen, setPopoverOpen] = useState<boolean>(false);

  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 15,
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
      onSnapshot(collection(db, "members"), (snapshot) => {
        let members = prevData.current.map((x) => x);
        snapshot.docChanges().forEach(({ doc, type }) => {
          const data = doc.data();
          switch (type) {
            case "added":
              if (
                !members.find((member: DocumentData) => member.id === doc.id)
              ) {
                members.push(data);
              }
              break;
            case "removed":
              members = members.filter(
                (member: DocumentData) => member.id !== doc.id
              );
              break;
            case "modified":
              members = members.filter(
                (member: DocumentData) => member.id !== doc.id
              );
              members.push(data.id);
              break;
            default:
              break;
          }
        });
        prevData.current = members;
        setFetchedData(members);
        setTableData(members);
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

  /* TABLE */
  const table = useReactTable({
    columns: MemberTableColumns,
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

  const areRowsSelected: boolean = selectedRows.length > 0;

  function isRowSelected(selected: Row<DocumentData>): Boolean {
    return Boolean(
      selectedRows.find(
        (row) => row.original.requestId === selected.original.requestId
      )
    );
  }

  const closeEdit = useCallback((): void => {
    setEditingRow(null);
  }, [editingRow]);

  const tableComponent = (
    <Table size={{ base: "sm" }} overflow={"auto"}>
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

  return (
    <>
      <TableOptions
        formatData={formatData}
        tableData={tableData}
        areRowsSelected={areRowsSelected}
        table={table}
        selectedRows={selectedRows}
        CSVImportFunction={memberImport}
      />
      {tableComponent}
    </>
  );
}

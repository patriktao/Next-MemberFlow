import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Flex,
  Heading,
  ButtonGroup,
  Button,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { Row, Table } from "@tanstack/react-table";
import { DocumentData } from "firebase/firestore";
import { ChangeEvent, ReactNode } from "react";
import CSVImport from "../csv/CSVImport";
import ExportCSV from "../csv/ExportCSV";

interface Props {
  formatData: Function;
  tableData: DocumentData[];
  areRowsSelected: boolean;
  table: Table<DocumentData>;
  extraOptions?: ReactNode;
  selectedRows: Row<DocumentData>[];
  CSVImportFunction: Function;
}

const TableOptions = (props: Props) => {
  return (
    <Flex
      justifyContent="space-between"
      alignItems="center"
      flexFlow="wrap"
      marginBottom="1rem"
    >
      <Heading as="h3" size="md" fontWeight={400}>
        total: {props.tableData.length ?? 0}
      </Heading>
      <Flex columnGap="0.5rem">
        <ButtonGroup>
          <Button
            variant="outline"
            colorScheme="teal"
            isDisabled={!props.areRowsSelected}
            onClick={() => props.table.resetRowSelection()}
          >
            deselect
          </Button>
          <Input
            placeholder="search name, email, ssn etc..."
            w={{ base: "300px", lg: "400px" }}
            maxW={{ base: "300px", lg: "400px" }}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              props.formatData(e.target.value.toLowerCase());
            }}
          />
        </ButtonGroup>
        {props.extraOptions}
        <Menu>
          <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
            actions
          </MenuButton>
          <MenuList>
            <MenuItem>
              <CSVImport onSubmit={props.CSVImportFunction} />
            </MenuItem>
            <MenuItem>
              <ExportCSV
                data={
                  props.selectedRows.length == 0
                    ? props.tableData
                    : props.selectedRows.flatMap((row) => row.original)
                }
                fileName="requests"
              />
            </MenuItem>
          </MenuList>
        </Menu>
      </Flex>
    </Flex>
  );
};

export default TableOptions;

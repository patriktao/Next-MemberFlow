import { Flex, Heading, ButtonGroup, Button, Input } from "@chakra-ui/react";
import { Table } from "@tanstack/react-table";
import { DocumentData } from "firebase/firestore";
import { ChangeEvent, ReactNode } from "react";

interface Props {
  formatData: Function;
  tableData: DocumentData[];
  rowsSelected: boolean;
  table: Table<DocumentData>;
  buttons: ReactNode;
}

const RequestTableOptions = (props: Props) => {
  return (
    <Flex id="request-table-options" justifyContent="space-between" flexFlow="wrap" marginBottom="1rem">
      <Heading as="h3" size="md">
        requests ({props.tableData.length ?? 0})
      </Heading>
      <Flex columnGap="0.5rem">
        <ButtonGroup>
          <Button
            variant="outline"
            colorScheme="teal"
            isDisabled={!props.rowsSelected}
            onClick={() => props.table.resetRowSelection()}
          >
            deselect
          </Button>
          <Input
            placeholder="search here..."
            maxW="300px"
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              props.formatData(e.target.value.toLowerCase());
            }}
          />
        </ButtonGroup>
        {props.buttons}
      </Flex>
    </Flex>
  );
};

export default RequestTableOptions;

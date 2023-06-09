import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  Button,
  Box,
  useToast,
} from "@chakra-ui/react";
import { Row } from "@tanstack/react-table";
import { DocumentData } from "firebase/firestore";
import React, { useCallback, useState } from "react";
import { ReactNode } from "react";
import deleteRequestHandler from "../tables/RequestTable/DeleteRequestHandler";
import Spinner from "./Spinner";

type Props = {
  children?: ReactNode;
  isDisabled?: boolean;
  variant?: string;
  header?: string;
  resetRowSelection: (() => void);
  selectedRows: Row<DocumentData>[];
};

const DeleteRowPopover: React.FC<Props> = (props: Props) => {
  const toast = useToast();
  const [open, setOpen] = useState<boolean>(false);
  const [isDeleting, setDeleting] = useState(false);

  const handleDelete = useCallback(() => {
    deleteRequestHandler({
      selectedRows: props.selectedRows,
      resetRowSelection: () => props.resetRowSelection(),
      toast: toast,
      setDeleting: setDeleting,
    });
  }, [props.selectedRows]);

  return (
    <Box>
      <Popover isOpen={open}>
        <PopoverTrigger>
          <Button
            onClick={() => setOpen(!open)}
            isDisabled={props.isDisabled || false}
            variant={props.variant ?? "outline"}
            colorScheme={isDeleting || !props.isDisabled ? "red" : "gray"}
            isLoading={isDeleting || false}
            spinner={<Spinner outerColor="red.200" innerColor="red.500" />}
          >
            {props.children}
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <PopoverArrow />
          <PopoverCloseButton onClick={() => setOpen(!open)} />
          <PopoverHeader pt={4} fontWeight="bold" border="0">
            {props.header}
          </PopoverHeader>
          <PopoverArrow />
          <PopoverBody>Are you sure you want to delete?</PopoverBody>
          <PopoverFooter border="0" textAlign={"right"} pb={4}>
            <Button
              color="red"
              background="red.100"
              _hover={{ background: "red.50" }}
              onClick={() => {
                setOpen(false);
                handleDelete();
              }}
            >
              delete
            </Button>
          </PopoverFooter>
        </PopoverContent>
      </Popover>
    </Box>
  );
};

export default DeleteRowPopover;

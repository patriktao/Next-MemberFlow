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
} from "@chakra-ui/react";
import { Row } from "@tanstack/react-table";
import { DocumentData } from "firebase/firestore";
import React, { useCallback, useState } from "react";
import { ReactNode } from "react";
import Spinner from "./Spinner";

type Props = {
  children?: ReactNode;
  isDisabled?: boolean;
  variant?: string;
  header?: string;
  handleDelete: Function;
  isDeleting: boolean;
};

const DeleteRowPopover: React.FC<Props> = (props: Props) => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <Box>
      <Popover isOpen={open}>
        <PopoverTrigger>
          <Button
            size="sm"
            onClick={() => setOpen(!open)}
            isDisabled={props.isDisabled || false}
            variant={props.isDisabled ? "outline" : props.variant ?? "solid"}
            colorScheme={"red"}
            isLoading={props.isDeleting || false}
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
                props.handleDelete();
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

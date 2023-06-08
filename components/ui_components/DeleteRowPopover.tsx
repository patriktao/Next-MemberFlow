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
import React, { useCallback, useState } from "react";
import { ReactNode } from "react";
import Spinner from "./Spinner";

type Props = {
  children?: ReactNode;
  handleDelete: Function;
  isDisabled?: boolean;
  isDeleting?: boolean;
  variant?: string;
  isOpen: boolean;
  setOpen: Function;
  header?: string;
};

const DeleteRowPopover: React.FC<Props> = (props: Props) => {
  return (
    <Box>
      <Popover isOpen={props.isOpen}>
        <PopoverTrigger>
          <Button
            onClick={() => props.setOpen(!props.isOpen)}
            isDisabled={props.isDisabled || false}
            variant={props.variant ?? "outline"}
            colorScheme={props.isDeleting || !props.isDisabled ? "red" : "gray"}
            isLoading={props.isDeleting || false}
            spinner={<Spinner outerColor="red.200" innerColor="red.500" />}
          >
            {props.children}
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <PopoverArrow />
          <PopoverCloseButton onClick={() => props.setOpen(!props.isOpen)} />
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
                props.setOpen(false);
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

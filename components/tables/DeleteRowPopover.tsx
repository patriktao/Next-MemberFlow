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
} from "@chakra-ui/react";
import React, { ReactNode } from "react";
import Spinner from "../ui_components/Spinner";

type Props = {
  children?: ReactNode;
  handleDelete: Function;
  isDisabled: boolean;
  isDeleting: boolean;
  variant?: string;
  isOpen: boolean;
  setOpen: Function;
};

const DeleteRowPopover: React.FC<Props> = (props: Props) => {
  return (
    <Popover isOpen={props.isOpen}>
      <PopoverTrigger>
        <Button
          onClick={() => props.setOpen(!props.isOpen)}
          isDisabled={props.isDisabled}
          variant={props.variant ?? "outline"}
          colorScheme={props.isDeleting || !props.isDisabled ? "red" : "gray"}
          isLoading={props.isDeleting}
          spinner={<Spinner outerColor="red.200" innerColor="red.500" />}
        >
          {props.children}
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverCloseButton onClick={() => props.setOpen(!props.isOpen)} />
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
              props.setOpen(false);
              props.handleDelete();
            }}
          >
            delete
          </Button>
        </PopoverFooter>
      </PopoverContent>
    </Popover>
  );
};

export default DeleteRowPopover;

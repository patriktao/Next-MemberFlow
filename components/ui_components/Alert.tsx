import {
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Button,
} from "@chakra-ui/react";
import React from "react";
import LoadingClickButton from "./LoadingClickButton";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  header: string;
  body: string;
  isLoading: boolean;
  onClick: () => void;
}

const Alert = ({ isOpen, onClose, header, body, isLoading, onClick }: Props) => {
  const cancelRef = React.useRef();

  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
      isCentered={true}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            {header}
          </AlertDialogHeader>

          <AlertDialogBody>{body}</AlertDialogBody>

          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose} mr={3}>
              Cancel
            </Button>
            <LoadingClickButton
              isLoading={isLoading}
              color="teal"
              onClick={onClick}
            >
              Proceed
            </LoadingClickButton>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

export default Alert;

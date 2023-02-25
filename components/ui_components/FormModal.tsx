import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  ButtonGroup,
} from "@chakra-ui/react";
import React, { ReactNode } from "react";

interface Props {
  isOpen: boolean;
  onClose: Function;
  onSave: Function;
  children?: ReactNode;
  title: string;
  scrollBehavior?: "inside" | "outside";
  size?:
    | "4xl"
    | "sm"
    | "md"
    | "lg"
    | "xl"
    | "2xl"
    | (string & {})
    | "xs"
    | "3xl"
    | "5xl"
    | "6xl"
    | "full";
}

const FormModal: React.FC<Props> = (props: Props) => {
  return (
    <Modal
      isOpen={props.isOpen}
      onClose={() => props.onClose()}
      size={props.size}
      scrollBehavior={props.scrollBehavior || "outside"}
      closeOnOverlayClick={false}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{props.title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>{props.children}</ModalBody>
        <ModalFooter>
          <ButtonGroup display="flex" justifyContent="flex-end">
            <Button variant="outline" onClick={() => props.onClose()}>
              Cancel
            </Button>
            <Button colorScheme="teal" mr={3} onClick={() => props.onSave()}>
              Save
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default FormModal;

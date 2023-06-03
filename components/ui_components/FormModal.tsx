import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
} from "@chakra-ui/react";
import React, { ReactNode } from "react";

interface Props {
  isOpen: boolean;
  onClose: Function;
  children?: ReactNode;
  title: string;
  id?: string;
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
      scrollBehavior={props.scrollBehavior || "inside"}
      closeOnOverlayClick={false}
      id={props.id || ""}
      isCentered
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{props.title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody overflowY="auto">{props.children}</ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default FormModal;

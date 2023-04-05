import {
  ModalOverlay,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  Modal,
} from "@chakra-ui/react";
import { DocumentData } from "firebase/firestore";
import { Table } from "@tanstack/react-table";
import AddAdmin from "./AddAdmin";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  toast: Function;
  table: Table<DocumentData>;
};

const AddAdminModal = (props: Props) => {
  return (
    <>
      <Modal
        closeOnOverlayClick={false}
        isOpen={props.isOpen}
        onClose={props.onClose}
        size="4xl"
        scrollBehavior="inside"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add a new admin</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <AddAdmin toast={props.toast} table={props.table} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AddAdminModal;

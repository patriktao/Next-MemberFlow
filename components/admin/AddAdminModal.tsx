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
import FormModal from "../ui_components/FormModal";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  toast: Function;
  table: Table<DocumentData>;
};

const AddAdminModal = (props: Props) => {
  return (
    <>
      <FormModal
        isOpen={props.isOpen}
        onClose={props.onClose}
        title="Add a new admin"
        children={<AddAdmin toast={props.toast} table={props.table} />}
      ></FormModal>
    </>
  );
};

export default AddAdminModal;

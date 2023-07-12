import { CreateToastFnReturn, useToast } from "@chakra-ui/react";
import { Row } from "@tanstack/react-table";
import { DocumentData } from "firebase/firestore";
import { State } from "../components/tables/EditRowForm/EditRowForm";
import { RequestForm } from "../interfaces";
import { createMember } from "../pages/api/memberAPI/memberAPI";
import {
  createNewRequest,
  deleteRequest,
  updateRequest,
} from "../pages/api/requestAPI/requestAPI";
import { defaultToastProps } from "../utils";

interface createProps {
  requestForm: RequestForm;
  onCancel: Function;
  reset: Function;
  setErrorMessage: Function;
  toast: CreateToastFnReturn;
}

export function createRequestHook({
  requestForm,
  onCancel,
  reset,
  setErrorMessage,
  toast,
}: createProps) {
  return createNewRequest(requestForm)
    .then(() => {
      toast({
        title: "Successfully added a new request.",
        status: "success",
        ...defaultToastProps,
      });
      onCancel();
      reset();
    })
    .catch((error) => {
      setErrorMessage(error.message);
      toast({
        title: "Error adding a new request.",
        description: error.message,
        status: "error",
        ...defaultToastProps,
      });
    });
}

interface deleteProps {
  selectedRows: Row<DocumentData>[];
  setDeleting: Function;
  resetRowSelection: Function;
  toast: CreateToastFnReturn;
}

export function deleteRequestHook({
  selectedRows,
  setDeleting,
  resetRowSelection,
  toast, 
}: deleteProps): void {
  const deletePromise = new Promise(async (resolve, reject) => {
    setDeleting(true);
    const promises = selectedRows.flatMap((e) => {
      return new Promise((resolve, reject) => {
        deleteRequest(e.original.requestId)
          .then((res) => resolve(res))
          .catch((error) => reject(error));
      });
    });

    try {
      const results = await Promise.all(promises);
      resolve(results);
    } catch (error) {
      reject(error);
    }

    deletePromise.then(
      (res) => {
        toast({
          title: "Successfully removed requests.",
          status: "success",
          ...defaultToastProps,
        });
        resetRowSelection();
        setDeleting(false);
      },
      (error) => {
        console.error(error);
        toast({
          title: "Error removing requests.",
          status: "error",
          ...defaultToastProps,
        });
        setDeleting(false);
      }
    );
  });
}

interface editProps {
  setLoading: Function;
  row: Row<DocumentData>;
  onClose: Function;
  setErrorMessage: (string) => void;
  state: State;
  toast: CreateToastFnReturn;
}

export const editRequestHook = ({
  setLoading,
  row,
  onClose,
  setErrorMessage,
  state,
  toast,
}: editProps) => {
  setLoading(true);
  updateRequest(state)
    .then(() => {
      console.log("Edited request");
      toast({
        title: "Successfully edit the request.",
        status: "success",
        ...defaultToastProps,
      });
      row.original = state;
      onClose();
    })
    .catch((error) => {
      setErrorMessage(error.message);
      toast({
        title: "Error editing the request.",
        description: error.message,
        status: "error",
        ...defaultToastProps,
      });
    });
  setLoading(false);
};

interface acceptProps {
  setLoading: Function;
  onClose: Function;
  resetRowSelection: () => void;
  selectedRows: Row<DocumentData>[];
  toast: CreateToastFnReturn;
}

export function acceptRequestHook({
  setLoading,
  onClose,
  resetRowSelection,
  selectedRows,
  toast,
}: acceptProps) {
  setLoading(true);
  const createPromise = new Promise(async (resolve, reject) => {
    const promises = selectedRows.flatMap((row) => {
      return new Promise((resolve, reject) => {
        createMember(row.original)
          .then((res) => {
            deleteRequest(row.original.requestId)
              .then((res) => resolve(res))
              .catch((error) => reject(error));
            resolve(res);
          })
          .catch((error) => reject(error));
      });
    });

    try {
      const results = await Promise.all(promises);
      resolve(results);
    } catch (error) {
      setLoading(false);
      reject(error);
    }
  });

  createPromise.then(
    (res) => {
      toast({
        title: "Successfully accepted requests",
        status: "success",
      });
      resetRowSelection();
      onClose();
      setLoading(false);
    },
    (error) => {
      console.log(error);
      toast({
        title: "Error accepting requests",
        status: "error",
      });
      setLoading(false);
    }
  );
}

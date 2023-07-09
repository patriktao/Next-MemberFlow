import { ToastProps, useToast } from "@chakra-ui/react";
import { Row } from "@tanstack/react-table";
import { DocumentData } from "firebase/firestore";
import { ReactNode } from "react";
import displayToast from "../components/ui_components/Toast";
import { RequestForm } from "../interfaces";
import {
  createNewRequest,
  deleteRequest,
} from "../pages/api/requestAPI/requestAPI";

interface deleteProps {
  selectedRows: Row<DocumentData>[];
  setDeleting: Function;
  resetRowSelection: Function;
}

interface createProps {
  requestForm: RequestForm;
  onCancel: Function;
  reset: Function;
  setErrorMessage: Function;
}

export function createRequestHook({
  requestForm,
  onCancel,
  reset,
  setErrorMessage,
}: createProps) {
  createNewRequest(requestForm)
    .then(() => {
      displayToast({
        title: "Successfully added a new request.",
        status: "success",
      });
      onCancel();
      reset();
    })
    .catch((error) => {
      setErrorMessage(error.message);
      displayToast({
        title: "Error adding a new request.",
        description: error.message,
        status: "error",
      });
    });
}

export function deleteRequestHook({
  selectedRows,
  setDeleting,
  resetRowSelection,
}: deleteProps): void {
  const deletePromise = new Promise(async (resolve, reject) => {
    setDeleting(true);
    console.log(selectedRows);

    const promises = selectedRows.flatMap((e) => {
      //Promise for every delete
      return new Promise((resolve, reject) => {
        deleteRequest(e.original.requestId)
          .then((res) => resolve(res))
          .catch((error) => reject(error));
      });
    });

    try {
      const results = await Promise.all(promises); //waiting until all promises fulfilled
      resolve(results); //then we are done
    } catch (error) {
      reject(error); //otherwise reject and error.p
    }

    deletePromise.then(
      (res) => {
        displayToast({
          title: "Successfully removed requests.",
          status: "success",
        });
        resetRowSelection();
        setDeleting(false);
      },
      (error) => {
        console.log(error);
        displayToast({
          title: "Error removing requests.",
          status: "error",
        });
        setDeleting(false);
      }
    );
  });
}

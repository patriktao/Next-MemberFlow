import { useToast } from "@chakra-ui/react";
import { Row } from "@tanstack/react-table";
import { DocumentData } from "firebase/firestore";
import displayToast from "../components/ui_components/Toast";
import { deleteMember } from "../pages/api/memberAPI/memberAPI";

interface deleteProps {
  selectedRows: Row<DocumentData>[];
  setDeleting: Function;
  resetRowSelection: Function;
}

export function deleteMemberHook({
  selectedRows,
  setDeleting,
  resetRowSelection,
}: deleteProps): void {
  const deletePromise = new Promise(async (resolve, reject) => {
    setDeleting(true);

    const promises = selectedRows.flatMap((e) => {
      //Promise for every delete
      return new Promise((resolve, reject) => {
        deleteMember(e.original.memberId)
          .then((res) => resolve(res))
          .catch((error) => reject(error));
      });
    });

    try {
      const results = await Promise.all(promises); //waiting until all promises fulfilled
      resolve(results); //then we are done
    } catch (error) {
      reject(error); //otherwise reject and error.
    }
  });

  const toast = useToast();

  deletePromise.then(
    (res) => {
      displayToast({
        toast: toast,
        title: "Successfully removed member.",
        status: "success",
      });
      resetRowSelection();
      setDeleting(false);
    },
    (error) => {
      console.log(error);
      displayToast({
        toast: toast,
        title: "Error removing member.",
        status: "error",
      });
      setDeleting(false);
    }
  );
}

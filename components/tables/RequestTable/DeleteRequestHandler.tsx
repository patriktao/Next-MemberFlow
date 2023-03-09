import { Row } from "@tanstack/react-table";
import { DocumentData } from "firebase/firestore";
import { deleteRequest } from "../../../pages/api/requestAPI/requestAPI";
import displayToast from "../../ui_components/Toast";

interface Props {
  selectedRows: Row<DocumentData>[];
  setDeleting: Function;
  resetRowSelection: Function;
  toast: Function;
}

function deleteRequestHandler({
  selectedRows,
  setDeleting,
  resetRowSelection,
  toast,
}: Props): void {
  const deletePromise = new Promise(async (resolve, reject) => {
    setDeleting(true);

    const promises = selectedRows.flatMap((e) => {
      //Promise for every delete
      return new Promise(async (resolve, reject) => {
        setTimeout(async () => {
          await deleteRequest(e.original.requestId)
            .then((res) => resolve(res))
            .catch((error) => reject(error));
        }, 1000);
      });
    });

    try {
      const results = await Promise.all(promises); //waiting until all promises fulfilled
      resolve(results); //then we are done
    } catch (error) {
      reject(error); //otherwise reject and error.
    }
  });

  deletePromise.then(
    (res) => {
      console.log(res);
      displayToast({
        toast: toast,
        title: "Successfully removed requests.",
        status: "success",
        position: "top-right",
      });
      resetRowSelection();
      setDeleting(false);
    },
    (error) => {
      console.log(error);
      displayToast({
        toast: toast,
        title: "Error removing requests.",
        status: "error",
        position: "top-right",
      });
      setDeleting(false);
    }
  );
}

export default deleteRequestHandler;

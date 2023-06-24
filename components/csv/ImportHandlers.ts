import { useToast } from "@chakra-ui/react";
import { MemberForm, RequestForm } from "../../interfaces";
import { createNewRequest } from "../../pages/api/requestAPI/requestAPI";
import { toTimestamp } from "../../utils/date-utils";
import displayToast from "../ui_components/Toast";
import { v4 } from "uuid";
import { Result } from "react-spreadsheet-import/types/types";
import { addExistingMember } from "../../pages/api/memberAPI/memberAPI";

export function isInvalid(data: Result<string>) {
  const toast = useToast();
  if (data == undefined || data == null) {
    console.log("result is undefined or null");
    return true;
  } else if (data.validData.length === 0) {
    displayToast({
      toast: toast,
      title: "No valid data has been submitted.",
      description: "Try again",
      status: "error",
      position: "top",
    });
    console.log("invalid data:");
    console.log(data.invalidData);
    return true;
  }
  return false;
}

export function requestImport(data: Result<string>) {
  const toast = useToast();
  if (isInvalid(data)) {
    return;
  }

  const createRequestPromise = new Promise(async (resolve, reject) => {
    const promises = data.validData.flatMap((e) => {
      //Promise for every delete
      const uid = v4();
      const requestForm: RequestForm = {
        email: e.email as string,
        name: e.name as string,
        ssn: e.ssn as string,
        gender: e.gender as string,
        afMember: e.afMember as string,
        payMethod: e.payMethod as string,
        period: e.period as string,
        regDate: toTimestamp(new Date(e.regDate as string)),
        hasPaid: e.hasPaid as string,
        requestId: uid,
      };

      return new Promise((resolve, reject) => {
        createNewRequest(requestForm)
          .then((res) => resolve(res))
          .catch((error) => reject(error));
      });
    });

    try {
      const results = await Promise.all(promises); //waiting until all promises fulfilled
      resolve(results);
    } catch (error) {
      reject(error);
    }
  });

  createRequestPromise.then(
    (res) => {
      displayToast({
        toast: toast,
        title: "Successfully added a new request.",
        status: "success",
        position: "top",
      });
    },
    (error) => {
      console.log(error);
      displayToast({
        toast: toast,
        title: "Error adding a new request.",
        description: error.message,
        status: "error",
        position: "top",
      });
    }
  );
}

export const memberImport: (data: Result<string>) => void = (data) => {
  const toast = useToast();
  
  if (isInvalid(data)) {
    return;
  }

  const createRequestPromise = new Promise(async (resolve, reject) => {
    const promises = data.validData.flatMap((e) => {
      //Promise for every delete
      const memberForm: MemberForm = {
        email: e.email as string,
        name: e.name as string,
        ssn: e.ssn as string,
        gender: e.gender as string,
        period: e.period as string,
        reg_date: toTimestamp(new Date(e.regDate as string)),
        status: "active",
      };

      return new Promise((resolve, reject) => {
        addExistingMember(memberForm)
          .then((res) => resolve(res))
          .catch((error) => reject(error));
      });
    });

    try {
      const results = await Promise.all(promises); //waiting until all promises fulfilled
      resolve(results);
    } catch (error) {
      reject(error);
    }
  });

  createRequestPromise.then(
    (res) => {
      displayToast({
        toast: toast,
        title: "Successfully added new members.",
        status: "success",
        position: "top",
      });
    },
    (error) => {
      console.log(error);
      displayToast({
        toast: toast,
        title: "Error adding new members.",
        description: error.message,
        status: "error",
        position: "top",
      });
    }
  );
};

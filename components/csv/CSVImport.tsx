import { Box, Text, useDisclosure, useToast } from "@chakra-ui/react";
import React, { useState } from "react";
import { ReactSpreadsheetImport } from "react-spreadsheet-import";
import { createNewRequest } from "../../pages/api/requestAPI/requestAPI";
import {
  genderOptions,
  paymentOptions,
  periodOptions,
  yesNoOptions,
} from "../../types";
import FormModal from "../ui_components/FormModal";
import displayToast from "../ui_components/Toast";
import { v4 } from "uuid";
import { toTimestamp } from "../../utils/date-utils";
import { RequestForm } from "../../interfaces";
import { Result } from "../../node_modules/react-spreadsheet-import/types/types.js";

const fields = [
  {
    // Visible in table header and when matching columns.
    label: "name",
    // This is the key used for this field when we call onSubmit.
    key: "name",
    // Allows for better automatic column matching. Optional.
    alternateMatches: ["first name", "first"],
    // Used when editing and validating information.
    fieldType: {
      // There are 3 types - "input" / "checkbox" / "input".
      type: "input",
    },
    // Used in the first step to provide an example of what data is expected in this field. Optional.
    example: "John",
    // Can have multiple validations that are visible in Validation Step table.
    validations: [
      {
        // Can be "required" / "unique" / "regex"
        rule: "required",
        errorMessage: "Name is required",
        // There can be "info" / "warning" / "error" levels. Optional. Default "error".
        level: "error",
      },
    ],
  },
  {
    label: "email",
    key: "email",
    alternateMatches: ["email address", "e-mail", "mail"],
    fieldType: {
      type: "input",
    },
    example: "johndoe@gmail.com",
    validations: [
      {
        rule: "required",
        errorMessage: "Email is required",
        level: "error",
      },
    ],
  },
  {
    label: "personal number",
    key: "ssn",
    alternateMatches: [
      "ssn",
      "personal number",
      "social security number",
      "person nummer",
      "personnummer",
    ],
    fieldType: {
      type: "input",
    },
    example: "19990101-1234",
    validations: [
      {
        rule: "required",
        errorMessage: "Personal number is required",
        level: "error",
      },
    ],
  },
  {
    label: "gender",
    key: "gender",
    fieldType: {
      type: "select",
      options: genderOptions,
    },
    example: "female",
    validations: [
      {
        rule: "required",
        errorMessage: "Gender is required",
        level: "error",
      },
    ],
  },
  {
    label: "registration date",
    key: "regDate",
    alternateMatches: ["reg date", "registration", "reg", "reg_date"],
    fieldType: {
      type: "input",
    },
    example: "2023/06/24",
    validations: [
      {
        rule: "required",
        errorMessage: "Registration Date is required",
        level: "error",
      },
    ],
  },
  {
    label: "period",
    key: "period",
    alternateMatches: ["subscription", "membership_period", "membership period"],
    fieldType: {
      type: "select",
      options: periodOptions,
    },
    example: "6",
    validations: [
      {
        rule: "required",
        errorMessage: "Period is required",
        level: "error",
      },
    ],
  },
  {
    label: "af member",
    key: "afMember",
    alternateMatches: ["af_member", "af", "af member"],
    fieldType: {
      type: "select",
      options: yesNoOptions,
    },
    example: "yes",
    validations: [
      {
        rule: "required",
        errorMessage: "AF member is required",
        level: "error",
      },
    ],
  },
  {
    label: "payment method",
    key: "payMethod",
    alternateMatches: ["payment", "pay", "payment_method", "payment method"],
    fieldType: {
      type: "select",
      options: paymentOptions,
    },
    example: "card",
    validations: [
      {
        rule: "required",
        errorMessage: "Payment method is required",
        level: "error",
      },
    ],
  },
  {
    label: "has paid",
    key: "hasPaid",
    alternateMatches: ["paid", "has_paid", "paid?"],
    fieldType: {
      type: "select",
      options: yesNoOptions,
    },
    example: "yes",
    validations: [
      {
        rule: "required",
        errorMessage: "Has is required",
        level: "error",
      },
    ],
  },
] as const;

const CSVImport = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const toast = useToast();

  function handleSubmit(data: Result<string>) {
    if (data == undefined || data == null) {
      console.log("result is undefined or null");
      return;
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
      return;
    }
    //console.log(data.invalidData);
    //console.log(data.validData);

    const createRequestPromise = new Promise(async (resolve, reject) => {
      //Promise for every delete
      const promises = data.validData.flatMap((e) => {
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

  return (
    <Box onClick={onOpen} w="full">
      <Text>Import</Text>
      <FormModal
        isOpen={isOpen}
        onClose={onClose}
        title={"Import CSV"}
        size="4xl"
      >
        {
          <ReactSpreadsheetImport
            isOpen={isOpen}
            onClose={onClose}
            onSubmit={handleSubmit}
            fields={fields}
          />
        }
      </FormModal>
    </Box>
  );
};

export default CSVImport;

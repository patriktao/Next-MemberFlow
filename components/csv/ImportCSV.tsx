import React from "react";
import { Importer, ImporterField } from "react-csv-importer";
import { Box, Text, useDisclosure, useToast } from "@chakra-ui/react";

import "react-csv-importer/dist/index.css";
import FormModal from "../ui_components/FormModal";
import { RequestTypes } from "../../types";
import { createNewRequest } from "../../pages/api/requestAPI/requestAPI";
import displayToast from "../ui_components/Toast";
import { RequestForm } from "../../interfaces";
import { toTimestamp } from "../../utils/date-utils";

const ImportCSV = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const array = [];

  const ImporterComponent = (
    <Importer
      dataHandler={async (rows, { startIndex }) => {
        // required, may be called several times
        // receives a list of parsed objects based on defined fields and user column mapping;
        // (if this callback returns a promise, the widget will wait for it before parsing more data)
        rows.forEach((row) => {
          if (!array.includes(row)) array.push(row);
        });

        await new Promise<void>((resolve) =>
          setTimeout(() => {
            console.log(array);
            resolve();
          }, 500)
        );
      }}
      onStart={({ file, preview, fields, columnFields }) => {
        const importPromise = new Promise(async (resolve, reject) => {
          const promises = array.flatMap((e) => {
            return new Promise(async (resolve, reject) => {
              const form: RequestForm = {
                name: e.name,
                email: e.email,
                ssn: e.ssn,
                period: e.period,
                gender: e.gender,
                afMember: e.afMember,
                payMethod: e.payMethod,
                regDate: toTimestamp(new Date(e.regDate)),
                hasPaid: e.hasPaid,
              };
              console.log(form);
              await createNewRequest(form)
                .then((res) => resolve(res))
                .catch((err) => reject(err));
            });
          });
          try {
            const results = await Promise.all(promises);
            resolve(results);
          } catch (err) {
            reject(err);
          }
        });

        importPromise
          .then(() => {
            displayToast({
              toast: toast,
              title: `Successfully imported ${array.length} requests.`,
              status: "success",
              position: "right-top",
            });
          })
          .catch((error) => {
            displayToast({
              toast: toast,
              title: `Error importing ${array.length} requests.`,
              description: error.message,
              status: "error",
            });
          });
      }}
      onComplete={({ file, preview, fields, columnFields }) => {
        // optional, invoked right after import is done (but user did not dismiss/reset the widget yet)
      }}
      onClose={() => {
        // optional, invoked when import is done and user clicked "Finish"
        // (if this is not specified, the widget lets the user upload another file)
        console.log("importer dismissed");
        onClose();
      }}
      chunkSize={10000} // defaults to 10000
      defaultNoHeader={false} // optional, keeps "data has headers" checkbox off by default
      restartable={false} // optional, lets user choose to upload another file when import is complete
      // CSV options passed directly to PapaParse if specified:
      // delimiter={...}
      // newline={...}
      // quoteChar={...}
      // escapeChar={...}
      // comments={...}
      // skipEmptyLines={...}
      // delimitersToGuess={...}
      // encoding={...} // defaults to utf-8, see FileReader API
    >
      <ImporterField name={RequestTypes.name} label="Name" />
      <ImporterField name={RequestTypes.ssn} label="Personal Number" />
      <ImporterField name={RequestTypes.email} label="Email" />
      <ImporterField name={RequestTypes.gender} label="Gender" />
      <ImporterField name={RequestTypes.regDate} label="Registration Date" />
      <ImporterField name={RequestTypes.period} label="Period" />
      <ImporterField name={RequestTypes.afMember} label="AF Member" />
      <ImporterField name={RequestTypes.payMethod} label="Pay Method" />
      <ImporterField name={RequestTypes.hasPaid} label="Has Paid" />
    </Importer>
  );

  return (
    <Box onClick={onOpen}>
      <Text>Import CSV</Text>
      <FormModal
        isOpen={isOpen}
        onClose={onClose}
        title={"Import CSV"}
        size="5xl"
      >
        {ImporterComponent}
      </FormModal>
    </Box>
  );
};

export default ImportCSV;

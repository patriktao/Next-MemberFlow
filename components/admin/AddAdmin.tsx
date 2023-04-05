import { Heading } from "@chakra-ui/react";
import { httpsCallable } from "firebase/functions";
import React, { useState } from "react";
import { Table } from "@tanstack/react-table";
import InputEmail from "../ui_components/InputEmail";
import LoadingButton from "../ui_components/LoadingButton";
import { fbFunctions } from "../../pages/api/firebase";
import { DocumentData } from "firebase/firestore";
import displayToast from "../ui_components/Toast";

type Props = {
  toast: Function;
  table: Table<DocumentData>;
};

type CloudFuncProp = {
  data: {
    status: string;
    success: boolean;
  };
};

const AddAdmin = (props: Props) => {
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const emailError = email === "";

  function handleChange(event) {
    setEmail(event.target.value);
  }

  function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    const addAdmin = httpsCallable(fbFunctions, "addAdmin");
    addAdmin({
      email: email,
    })
      .then(() => {
        displayToast({
          toast: props.toast,
          title: "Successfully added admin.",
          status: "success",
          position: "top-right",
        });
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        displayToast({
          toast: props.toast,
          title: "Error adding admin.",
          description: error.message,
          status: "error",
          position: "top-right",
        });
        setLoading(false);
      });
  }

  return (
    <form onSubmit={handleSubmit}>
      <Heading as="h1" size="lg" paddingBottom="1rem">
        add admin.
      </Heading>
      <InputEmail
        value={email}
        setEmail={(e) => {
          handleChange(e);
          setErrorMessage("");
        }}
        errorMessage={errorMessage}
        emailError={emailError}
      />
      <LoadingButton isLoading={loading}> Add admin </LoadingButton>
    </form>
  );
};

export default AddAdmin;

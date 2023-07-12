import { addAdmin } from "../../pages/api/adminAPI/adminAPI";
import React, { useState } from "react";
import { Table } from "@tanstack/react-table";
import { DocumentData } from "firebase/firestore";
import { Heading, useToast } from "@chakra-ui/react";
import InputEmail from "../ui_components/InputEmail";
import LoadingButton from "../ui_components/LoadingSubmitButton";
import { defaultToastProps } from "../../utils";

type Props = {
  toast: Function;
  table: Table<DocumentData>;
  onClose: Function;
};

const AddAdmin: React.FC = (props: Props) => {
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const emailError = email === "";

  const toast = useToast();

  function handleChange(event) {
    setEmail(event.target.value);
  }

  function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    addAdmin(email)
      .then(() => {
        toast({
          title: "Successfully added admin.",
          status: "success",
          position: "top-right",
          ...defaultToastProps,
        });
        setLoading(false);
        props.onClose();
      })
      .catch((error) => {
        console.log(error);
        toast({
          title: "Error adding admin.",
          description: error.message,
          status: "error",
          ...defaultToastProps,
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

import { Heading } from "@chakra-ui/react";
import { httpsCallable } from "firebase/functions";
import React, { useState } from "react";
import withAuth from "../components/auth/withAuth";
import Layout from "../components/Layout";
import InputEmail from "../components/ui_components/InputEmail";
import LoadingButton from "../components/ui_components/LoadingButton";
import { fbFunctions } from "./api/firebase";

type Props = {};

const Settings = (props: Props) => {
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
    console.log(email);
    addAdmin({
      email: email,
    })
      .then((result) => {
        console.log(result);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <form onSubmit={handleSubmit}>
      <Layout title="Settings">
        <Heading as="h1" size="lg" paddingBottom="1rem">
          Settings.
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
      </Layout>
    </form>
  );
};

export default withAuth(Settings);

import { Heading } from "@chakra-ui/react";
import React from "react";
import Layout from "../components/Layout";

type Props = {};

const settings = (props: Props) => {
  return (
    <Layout title="Dashboard">
      <Heading as="h1" size="lg" paddingBottom="1rem">
        Settings.
      </Heading>
      <h1>Settings</h1>
    </Layout>
  );
};

export default settings;

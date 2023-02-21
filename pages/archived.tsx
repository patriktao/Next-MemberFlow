import { Heading } from "@chakra-ui/react";
import React from "react";
import withAuth from "../components/auth/withAuth";
import Layout from "../components/Layout";

type Props = {};

function archived({}: Props) {
  return (
    <Layout title="archived">
      <Heading as="h1" size="lg" paddingBottom="1rem">
        archived.
      </Heading>
      <h1>archived</h1>
    </Layout>
  );
}

export default withAuth(archived);

import { Heading } from "@chakra-ui/react";
import React from "react";
import Layout from "../components/Layout";

type Props = {};

function members({}: Props) {
  return (
    <Layout title="Members">
      <Heading as="h1" size="lg" paddingBottom="1rem">
        Members.
      </Heading>
      <h1>Members</h1>
    </Layout>
  );
}

export default members;

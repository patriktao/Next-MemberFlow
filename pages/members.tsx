import { Grid, Heading } from "@chakra-ui/react";
import React from "react";
import withAuth from "../components/auth/withAuth";
import Layout from "../components/ui_components/Layout";
import { MemberTable } from "../components/tables/MemberTable/MemberTable";

type Props = {};

function members({}: Props) {
  return (
    <Layout title="Members">
      <Heading as="h1" size="lg" paddingBottom="1rem">
        members.
      </Heading>
      <MemberTable />
    </Layout>
  );
}

export default withAuth(members);

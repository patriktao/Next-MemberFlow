import { Heading } from "@chakra-ui/react";
import React from "react";
import RequestTable from "../components/tables/RequestTable/RequestTable";
import Layout from "../components/ui_components/Layout";

type Props = {};

const requests = (props: Props) => {
  return (
    <Layout title="Dashboard">
      <Heading as="h1" size="lg" fontWeight={"600"} pb="8px">
        requests
      </Heading>
      <RequestTable />
    </Layout>
  );
};

export default requests;

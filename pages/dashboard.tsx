import { Box, Grid, Heading } from "@chakra-ui/react";
import withAuth from "../components/auth/withAuth";
import Layout from "../components/ui_components/Layout";
import RequestTable from "../components/tables/RequestTable/RequestTable";

const Dashboard = () => (
  <Layout title="Dashboard">
    <Heading title="page-header" as="h1" size="lg" paddingBottom="1rem">
      dashboard.
    </Heading>
    <RequestTable />
  </Layout>
);

export default withAuth(Dashboard);

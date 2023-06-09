import { Box, Grid, GridItem, Heading } from "@chakra-ui/react";
import withAuth from "../components/auth/withAuth";
import Layout from "../components/ui_components/Layout";
import RequestTable from "../components/tables/RequestTable/RequestTable";

const Dashboard = () => (
  <Layout>
    <Heading as="h1" size="lg" pb="1rem" fontWeight={500}>
      dashboard.
    </Heading>
    <Heading as="h2" size="md" pb="1rem" fontWeight={400}>
      insights
    </Heading>
    <Grid templateColumns="repeat(4, 1fr)" gap={6}>
      <GridItem w="100%" h="270" bg="gray.500" rounded={"3xl"}></GridItem>
      <GridItem w="100%" h="270" bg="gray.500" rounded={"3xl"}></GridItem>
      <GridItem w="100%" h="270" bg="gray.500" rounded={"3xl"}></GridItem>
      <GridItem w="100%" h="270" bg="gray.500" rounded={"3xl"}></GridItem>
    </Grid>
  </Layout>
);

export default withAuth(Dashboard);

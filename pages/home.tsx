import { Box, Grid, GridItem, Heading } from "@chakra-ui/react";
import withAuth from "../components/auth/withAuth";
import Layout from "../components/ui_components/Layout";
import RequestTable from "../components/tables/RequestTable/RequestTable";

const Home = () => (
  <Layout>
    <Heading as="h1" size="lg" pb="1rem" fontWeight={600}>
      home
    </Heading>
    <Heading as="h2" size="md" pb="1rem" fontWeight={400}>
      insights
    </Heading>
    <Grid templateColumns="repeat(4, 1fr)" gap={6}>

    </Grid>
  </Layout>
);

export default withAuth(Home);

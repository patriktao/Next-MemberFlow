import { Heading } from "@chakra-ui/react";
import withAuth from "../components/auth/withAuth";
import Layout from "../components/Layout";

const Dashboard = () => (
  <Layout title="Dashboard">
    <Heading as="h1" size="lg" paddingBottom="1rem">
      MemberFlow.
    </Heading>
    <h1>Hello Next.js 👋</h1>
  </Layout>
);

export default withAuth(Dashboard);

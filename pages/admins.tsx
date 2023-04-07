import AdminTable from "../components/tables/AdminTable/AdminTable";
import withAuth from "../components/auth/withAuth";
import Layout from "../components/Layout";
import { Heading, VStack } from "@chakra-ui/react";

const Admins = () => {
  return (
    <Layout>
      <VStack spacing={40} align="stretch">
        <AdminTable />
      </VStack>
    </Layout>
  );
};

export default withAuth(Admins);

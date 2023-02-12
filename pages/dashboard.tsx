import { Heading } from "@chakra-ui/react";
import Link from "next/link";
import Layout from "../components/Layout";

const IndexPage = () => (
  <Layout title="Dashboard">
    <Heading as="h1" size="lg" paddingBottom="1rem">
      MemberFlow.
    </Heading>
    <h1>Hello Next.js 👋</h1>
  </Layout>
);

export default IndexPage;

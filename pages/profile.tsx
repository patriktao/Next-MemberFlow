import { Heading } from "@chakra-ui/react";
import React from "react";
import withAuth from "../components/auth/withAuth";
import Layout from "../components/Layout";
import { getAuth } from "firebase/auth";



const profile = () => {

  const auth = getAuth();
  const user = auth.currentUser;

  return (
    <Layout title="Profile">
      <Heading as="h1" size="lg" paddingBottom="1rem">
        Hello {user.displayName}
      </Heading>
      <h1>Profile</h1>
    </Layout>
  )
}

export default withAuth(profile);

import { Heading } from "@chakra-ui/react";
import React from "react";
import withAuth from "../components/auth/withAuth";
import Layout from "../components/Layout";
import { getAuth } from "firebase/auth";
import UserProfile from "../components/profile/userprofile";



const profile = () => {

  
  return (
    
    <Layout title="Profile">
      <UserProfile />      
    </Layout>
  )
}

export default withAuth(profile);

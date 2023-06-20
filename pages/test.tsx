import { Heading } from "@chakra-ui/react";
import React from "react";
import withAuth from "../components/auth/withAuth";
import Layout from "../components/Layout";
import PaymentButton from "../components/payment/PaymentButton";

type Props = {};

function Test({}: Props) {
  console.log("TESTING");
  return (
    <Layout title="test">
      <PaymentButton />
    </Layout>
  );
}

export default Test;

import React from "react";
import withAuth from "../components/auth/withAuth";
import Layout from "../components/Layout";
import { MemberTable } from "../components/tables/MemberTable";

type Props = {};

function members({}: Props) {
  return (
    <Layout title="Members">
      <MemberTable />
    </Layout>
  );
}

export default withAuth(members);

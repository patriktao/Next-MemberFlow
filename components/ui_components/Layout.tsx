import React, { ReactNode } from "react";
import Head from "next/head";
import Sidebar from "../navbar/Sidebar";
import { Box, Flex, Grid } from "@chakra-ui/react";

type Props = {
  children?: ReactNode;
  title?: string;
};

const Layout: React.FC<Props> = ({ children, title = "Memberflow" }: Props) => (
  <Flex padding="1rem" columnGap="1rem" h="100%">
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
    <Sidebar />
    <Box w="full" maxH="full" overflow="auto" padding="2rem">
      {children}
    </Box>
  </Flex>
);

export default Layout;

import React, { ReactNode } from "react";
import Head from "next/head";
import Sidebar from "./navbar/Sidebar";
import { Box, Flex, Heading } from "@chakra-ui/react";
import component_color from "../styles/colors";

type Props = {
  children?: ReactNode;
  title?: string;
};

const Layout = ({ children, title = "This is the default title" }: Props) => (
  <Flex columnGap="3rem">
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
    <Sidebar />
    <Box
      marginTop="2.5vh"
      padding="2rem"
      //boxShadow="0 4px 12px 0 rgba(0, 0, 0, 0.05)"
      boxShadow="0px 16px 24px rgba(0, 0, 0, 0.06), 0px 2px 6px rgba(0, 0, 0, 0.04), 0px 0px 1px rgba(0, 0, 0, 0.04)"
      borderRadius="30px"
      backgroundColor={component_color}
      width="100%"
    >
      {children}
    </Box>
  </Flex>
);

export default Layout;

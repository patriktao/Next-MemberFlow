import { Box, ChakraProvider } from "@chakra-ui/react";
import { Container } from "@chakra-ui/layout";
import { bg_color } from "../styles/colors";
import { NavProvider } from "./contexts/NavContext";

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider>
      <NavProvider>
        <Box title="layout" w="100vw" h="100vh">
          <Component {...pageProps} />
        </Box>
      </NavProvider>
    </ChakraProvider>
  );
}

export default MyApp;

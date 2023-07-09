import { Box, ChakraProvider } from "@chakra-ui/react";
import { NavProvider } from "./contexts/NavContext";

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider>
      <NavProvider>
        <Box w="100vw" h="100vh">
          <Component {...pageProps} />
        </Box>
      </NavProvider>
    </ChakraProvider>
  );
}

export default MyApp;

import { Box, ChakraProvider } from "@chakra-ui/react";
import { AuthProvider } from "./contexts/AuthContext";
import { NavProvider } from "./contexts/NavContext";

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider>
      <AuthProvider>
        <NavProvider>
          <Box w="100vw" h="100vh">
            <Component {...pageProps} />
          </Box>
        </NavProvider>
      </AuthProvider>
    </ChakraProvider>
  );
}

export default MyApp;

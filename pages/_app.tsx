import { ChakraProvider } from "@chakra-ui/react";
import { Container } from "@chakra-ui/layout";
import { bg_color } from "../styles/colors";
import { NavProvider } from "./contexts/NavContext";

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider>
      <NavProvider>
        <Container maxW="100vw" minH="container.sm" background={bg_color}>
          <Component {...pageProps} />
        </Container>
      </NavProvider>
    </ChakraProvider>
  );
}

export default MyApp;

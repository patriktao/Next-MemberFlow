import { ChakraProvider } from "@chakra-ui/react";
import { Container, Heading, Text } from "@chakra-ui/layout";

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider>
      <Container maxW="container.lg" minH="container.sm">
        <Component {...pageProps} />
      </Container>
    </ChakraProvider>
  );
}

export default MyApp;

import { Box, Grid, Heading } from "@chakra-ui/react";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import AuthForm from "../components/auth/AuthForm";
import PasswordRecoveryForm from "../components/passwordRecovery/PasswordRecoveryForm";

const Login = () => {
  return (
    <Grid
      minH="100vh"
      w="100vw"
      mx="auto"
      alignContent="center"
      bgImage="/LoginImage.jpg"
      bgRepeat="no-repeat"
      bgSize="cover"
    >
      <Box
        w="container.sm"
        mx="auto"
        minH="420px"
        alignContent="center"
        p="4"
        background="white"
        padding="2rem"
        rounded="3xl"
      >
        <Heading as="h1" size="xl" mb="6">
          memberflow.
        </Heading>
        <Tabs isFitted variant="soft-rounded">
          <TabList>
            <Tab>Login</Tab>
            <Tab>Forgotten your password?</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <AuthForm />
            </TabPanel>
            <TabPanel>
              <PasswordRecoveryForm />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Grid>
  );
};

export default Login;

import { Box, Center, Heading } from "@chakra-ui/react";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import AuthForm from "../components/auth/AuthForm";
import PasswordRecoveryForm from "../components/passwordRecovery/PasswordRecoveryForm";

const Login = () => {
  return (
    <Center minH="100vh">
      <Box
        minW="container.sm"
        mx="auto"
        p="4"
        background="white"
        padding="2rem"
        borderRadius={"2xl"}
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
    </Center>
  );
};

export default Login;

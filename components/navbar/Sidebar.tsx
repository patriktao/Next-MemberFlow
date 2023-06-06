import React, { useEffect, useContext } from "react";
import {
  Flex,
  IconButton,
  Divider,
  Avatar,
  Heading,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useToast,
  Box,
  Text,
} from "@chakra-ui/react";
import { FiMenu, FiHome, FiCalendar, FiUser, FiKey } from "react-icons/fi";
import NavItem from "./NavItem";
import { component_color } from "../../styles/colors";
import { useRouter } from "next/router";
import { NavContext } from "../../pages/contexts/NavContext";
import { ChevronRightIcon } from "@chakra-ui/icons";
import { getCurrentUser, logOut } from "../../pages/api/authAPI/authAPI";
import displayToast from "../ui_components/Toast";

const Sidebar: React.FC = () => {
  const { pathname } = useRouter();
  const context = useContext(NavContext);
  const { navSize, setNavSize, selectedNavItem, setSelectedNavItem } = context;
  const router = useRouter();

  if (!context) {
    throw new Error("CountContext is undefined");
  }

  useEffect(() => {
    navItemSelector();
  }, []);

  function navItemSelector() {
    switch (pathname) {
      case "/dashboard":
        setSelectedNavItem("/dashboard");
        break;
      case "/members":
        setSelectedNavItem("/members");
        break;
      case "/archived":
        setSelectedNavItem("/archived");
        break;
      case "/settings":
        setSelectedNavItem("/settings");
        break;
      case "/admins":
        setSelectedNavItem("/admins");
      default:
        break;
    }
  }

  const toast = useToast();

  const handleLogOut = async () =>
    await logOut()
      .then(() => {
        displayToast({
          toast: toast,
          title: "Successfully logged out.",
          status: "success",
        });
        localStorage.removeItem("authToken");
        router.push("/");
      })
      .catch((error) =>
        displayToast({
          toast: toast,
          title: error.message,
          status: "error",
        })
      );

  return (
    <Flex
      boxShadow="0px 16px 24px rgba(0, 0, 0, 0.06), 0px 2px 6px rgba(0, 0, 0, 0.04), 0px 0px 1px rgba(0, 0, 0, 0.04)"
      borderRadius={{ base: "15px", md: "30px" }}
      w={{ base: "75px", md: "240px" }}
      flexDir="column"
      h="100%"
      justifyContent="space-between"
      backgroundColor={component_color}
      background="#FFFFFF"
    >
      <Flex
        p="5%"
        flexDir="column"
        w="100%"
        alignItems={{ base: "center", md: "flex-start" }}
        as="nav"
      >
        <Text
          fontSize="xl"
          fontWeight={"bold"}
          textAlign="center"
          my="4"
          w="full"
        >
          memberflow.
        </Text>
        <Divider display={{ base: "none", md: "block" }} mx="auto" w="120px" />
        <NavItem
          navSize={navSize}
          icon={FiHome}
          title="Dashboard"
          description="This is the description for the dashboard."
          active={selectedNavItem === "/dashboard"}
          path="/dashboard"
        />
        <NavItem
          navSize={navSize}
          icon={FiUser}
          title="Members"
          active={selectedNavItem === "/members"}
          description={undefined}
          path="/members"
        />
        <NavItem
          navSize={navSize}
          icon={FiCalendar}
          title="Archived"
          description={undefined}
          active={selectedNavItem === "/archived"}
          path="/archived"
        />
        <NavItem
          navSize={navSize}
          icon={FiKey}
          title="Admins"
          description={undefined}
          active={selectedNavItem === "/admins"}
          path="/admins"
        />
      </Flex>

      <Flex
        p="5%"
        flexDir="column"
        w="100%"
        alignItems={navSize == "small" ? "center" : "flex-start"}
        mb={4}
      >
        <Menu id="sidebar-menu">
          <MenuButton width="100%" display="grid" justifyContent="center">
            <Divider display={navSize == "small" ? "none" : "flex"} />
            <Flex mt={4} align="center">
              <Avatar size="sm" src="avatar-1.jpg" />
              <Flex
                flexDir="column"
                ml={4}
                display={{ base: "none", md: "block" }}
              >
                <Heading as="h3" size="sm" textAlign={"center"}>
                  User
                  {<ChevronRightIcon marginLeft="4px" />}
                </Heading>
              </Flex>
            </Flex>
          </MenuButton>
          <MenuList>
            <MenuItem onClick={() => router.push("/settings")}>
              Settings
            </MenuItem>
            <MenuItem onClick={handleLogOut}>Logout</MenuItem>
          </MenuList>
        </Menu>
      </Flex>
    </Flex>
  );
};

export default Sidebar;

import React, { useEffect, useContext, useState } from "react";
import {
  Flex,
  Divider,
  Avatar,
  Heading,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useToast,
  Text,
} from "@chakra-ui/react";
import { FiHome, FiCalendar, FiKey, FiUserPlus, FiUsers } from "react-icons/fi";
import NavItem from "./NavItem";
import { useRouter } from "next/router";
import { NavContext } from "../../pages/contexts/NavContext";
import { logOut } from "../../pages/api/authAPI/authAPI";
import { defaultToastProps } from "../../utils";
import { AuthContext } from "../../pages/contexts/AuthContext";

const Sidebar: React.FC = () => {
  const router = useRouter();
  const context = useContext(NavContext);
  const { pathname } = useRouter();
  const { selectedNavItem, setSelectedNavItem } = context;
  const { authUser } = useContext(AuthContext);

  if (!context) {
    throw new Error("CountContext is undefined");
  }

  useEffect(() => {
    const sidebarFocus = () => {
      switch (pathname) {
        case "/home":
          setSelectedNavItem("/home");
          break;
        case "/requests":
          setSelectedNavItem("/requests");
          break;
        case "/members":
          setSelectedNavItem("/members");
          break;
        case "/archived":
          setSelectedNavItem("/archived");
          break;
        case "/admins":
          setSelectedNavItem("/admins");
        default:
          break;
      }
    };

    sidebarFocus();
  }, []);

  const toast = useToast();

  const handleLogOut = async () =>
    await logOut()
      .then(() => {
        toast({
          title: "Successfully logged out.",
          status: "success",
          ...defaultToastProps,
        });
        localStorage.removeItem("authToken");
        router.push("/");
      })
      .catch((error) =>
        toast({
          title: error.message,
          status: "error",
          ...defaultToastProps,
        })
      );

  return (
    <Flex
      w={"240px"}
      flexDir="column"
      h="100%"
      justifyContent="space-between"
      display={{ base: "none", md: "flex" }}
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
          icon={FiHome}
          title="home"
          active={selectedNavItem === "/home"}
          path="/home"
        />
        <NavItem
          icon={FiUserPlus}
          title="requests"
          active={selectedNavItem === "/requests"}
          path="/requests"
        />
        <NavItem
          icon={FiUsers}
          title="members"
          active={selectedNavItem === "/members"}
          path="/members"
        />
        <NavItem
          icon={FiCalendar}
          title="archived"
          active={selectedNavItem === "/archived"}
          path="/archived"
        />
        <NavItem
          icon={FiKey}
          title="admins"
          active={selectedNavItem === "/admins"}
          path="/admins"
        />
      </Flex>

      <Flex p="5%" flexDir="column" w="100%" alignItems={"flex-start"} mb={4}>
        <Menu id="sidebar-menu">
          <MenuButton width="100%" display="grid" justifyContent="center">
            <Divider display={"flex"} />
            <Flex mt={4} align="center">
              <Avatar size="sm" />
              <Flex
                flexDir="column"
                ml={4}
                display={{ base: "none", md: "block" }}
                overflow="hidden"
              >
                <Heading
                  as="h3"
                  size="sm"
                  textAlign={"center"}
                  fontWeight="medium"
                >
                  {authUser}
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

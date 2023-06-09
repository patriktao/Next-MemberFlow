import React, { useEffect, useContext, useState } from "react";
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
import { FiHome, FiCalendar, FiKey, FiUserPlus, FiUsers } from "react-icons/fi";
import NavItem from "./NavItem";
import { component_color } from "../../styles/colors";
import { useRouter } from "next/router";
import { NavContext } from "../../pages/contexts/NavContext";
import { ChevronRightIcon } from "@chakra-ui/icons";
import { getCurrentUser, logOut } from "../../pages/api/authAPI/authAPI";
import displayToast from "../ui_components/Toast";
import { getAdmin } from "../../pages/api/adminAPI/adminAPI";

const Sidebar: React.FC = () => {
  const { pathname } = useRouter();
  const context = useContext(NavContext);
  const { selectedNavItem, setSelectedNavItem } = context;
  const router = useRouter();
  const [user, setUser] = useState<string>("");

  if (!context) {
    throw new Error("CountContext is undefined");
  }

  useEffect(() => {
    const getUsername = async () => {
      const user = await getCurrentUser();
      if (user !== undefined && user !== null) {
        await getAdmin(user.uid).then((res) => {
          setUser(res.name);
        });
      }
    };
    getUsername();
  }, []);

  switch (pathname) {
    case "/dashboard":
      setSelectedNavItem("/dashboard");
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
    case "/settings":
      setSelectedNavItem("/settings");
      break;
    case "/admins":
      setSelectedNavItem("/admins");
    default:
      break;
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
      borderRadius={"30px"}
      w={"240px"}
      flexDir="column"
      h="100%"
      justifyContent="space-between"
      backgroundColor={component_color}
      background="#FFFFFF"
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
          title="dashbord"
          active={selectedNavItem === "/dashboard"}
          path="/dashboard"
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
              <Avatar size="sm" src="avatar-1.jpg" />
              <Flex
                flexDir="column"
                ml={4}
                display={{ base: "none", md: "block" }}
              >
                <Heading as="h3" size="sm" textAlign={"center"}>
                  {user}
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

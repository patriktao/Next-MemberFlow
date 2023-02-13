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
} from "@chakra-ui/react";
import { FiMenu, FiHome, FiCalendar, FiUser, FiSettings } from "react-icons/fi";
import { IoPawOutline } from "react-icons/io5";
import NavItem from "./NavItem";
import component_color from "../../styles/colors";
import { useRouter } from "next/router";
import { NavContext } from "../../pages/contexts/NavContext";
import { ChevronRightIcon } from "@chakra-ui/icons";
import { logOut } from "../../pages/api/authAPI/authAPI";
import displayToast from "../ui_components/Toast";

function Sidebar() {
  const { pathname } = useRouter();
  const context = useContext(NavContext);
  const { navSize, setNavSize, selectedNavItem, setSelectedNavItem } =
    useContext(NavContext);
  const router = useRouter();

  if (!context) {
    throw new Error("CountContext is undefined");
  }

  useEffect(() => {
    navItemSelector();
  });

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
          title: "Successfully logged out!",
          status: "success",
        });
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
      pos="sticky"
      left="5"
      h="95vh"
      marginTop="2.5vh"
      boxShadow="0 4px 12px 0 rgba(0, 0, 0, 0.05)"
      borderRadius={navSize == "small" ? "15px" : "30px"}
      w={navSize == "small" ? "75px" : "200px"}
      flexDir="column"
      justifyContent="space-between"
      backgroundColor={component_color}
    >
      <Flex
        p="5%"
        flexDir="column"
        w="100%"
        alignItems={navSize == "small" ? "center" : "flex-start"}
        as="nav"
      >
        <IconButton
          background="none"
          mt={5}
          _hover={{ background: "none" }}
          icon={<FiMenu />}
          onClick={() => {
            if (navSize == "small") setNavSize("large");
            else setNavSize("small");
          }}
          aria-label={""}
        />
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
        {/*  <NavItem
          navSize={navSize}
          icon={FiSettings}
          title="Settings"
          description={undefined}
          active={selectedNavItem === "/settings"}
          path="/settings"
        /> */}
      </Flex>

      <Flex
        p="5%"
        flexDir="column"
        w="100%"
        alignItems={navSize == "small" ? "center" : "flex-start"}
        mb={4}
      >
        <Menu>
          <MenuButton>
            <Divider display={navSize == "small" ? "none" : "flex"} />
            <Flex mt={4} align="center">
              <Avatar size="sm" src="avatar-1.jpg" />
              <Flex
                flexDir="column"
                ml={4}
                display={navSize == "small" ? "none" : "flex"}
              >
                <Heading as="h3" size="sm">
                  Admin
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
}

export default Sidebar;

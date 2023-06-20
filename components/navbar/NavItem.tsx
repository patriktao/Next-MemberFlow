import React, { ReactNode } from "react";
import { Flex, Text, Icon, Link, Menu, MenuButton } from "@chakra-ui/react";
import NextLink from "next/link";

interface NavItem {
  icon: ReactNode;
  title?: String;
  active?: boolean;
  path: string;
}

const NavItem = ({ icon, title, active, path }) => {
  return (
    <Flex
      mt={2}
      flexDir="column"
      w="100%"
      alignItems={{ base: "center", md: "flex-start" }}
    >
      <Menu placement="right">
        <Link
          backgroundColor={active && "#AEC8CA"}
          px={4}
          py={2}
          borderRadius={8}
          _hover={{ textDecor: "none", backgroundColor: "#AEC8CA" }}
          w={"full"}
          as={NextLink}
          href={path}
        >
          <MenuButton w="100%">
            <Flex>
              <Icon
                as={icon}
                fontSize="xl"
                color={active ? "#82AAAD" : "gray.500"}
              />
              <Text ml={5} visibility={{ base: "hidden", md: "visible" }}>
                {title}
              </Text>
            </Flex>
          </MenuButton>
        </Link>
      </Menu>
    </Flex>
  );
};

export default NavItem;

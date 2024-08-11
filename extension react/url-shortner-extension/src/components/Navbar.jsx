import {
  Box,
  Flex,
  Menu,
  MenuButton,
  Button,
  Avatar,
  MenuList,
  MenuItem,
  Heading,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { LiaUserSolid } from "react-icons/lia";
import { IoAnalytics } from "react-icons/io5";
import { LuLogIn, LuLogOut } from "react-icons/lu";
import { Link } from "react-router-dom";
import { useLogout } from "../hooks/useLogout";
import { useAuthContext } from "../hooks/useAuthContext";

const Navbar = () => {
  const [loggedIn, setLoggedIn] = useState(true);
  const logout = useLogout();

  const { user } = useAuthContext();

  const handleLogout = () => {
    logout();
  };
  return (
    <Box p={1} px={"5vw"}>
      <Flex alignItems={"center"} justifyContent={"space-between"} h={16}>
        <Link to="/">
          <Heading size="lg">URL Shortner</Heading>
        </Link>

        {/* {loggedIn && ( */}
        <Menu>
          <MenuButton
            as={Button}
            rounded={"full"}
            variant={"link"}
            cursor={"pointer"}
          >
            <Avatar />
          </MenuButton>
          <MenuList p={2}>
            {user && (
              <>
                <Link to="/profile">
                  <MenuItem borderRadius={5}>
                    <LiaUserSolid size={20} /> &nbsp; Profile
                  </MenuItem>
                </Link>
              </>
            )}

            {user ? (
              <MenuItem borderRadius={5} color={"red"} onClick={handleLogout}>
                <LuLogOut />
                &nbsp; Logout
              </MenuItem>
            ) : (
              <Link to="/login">
                <MenuItem borderRadius={5}>
                  <LuLogIn />
                  &nbsp; Login
                </MenuItem>
              </Link>
            )}
          </MenuList>
        </Menu>
        {/* )} */}
      </Flex>
    </Box>
  );
};

export default Navbar;

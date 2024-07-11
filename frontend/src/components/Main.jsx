import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { HiLink } from "react-icons/hi";
import Navbar from "./Navbar";
import URLsTable from "./URLsTable";
import { backendURL } from "../constants";
import Homepage from "./Homepage";
import AnalyticsPage from "./AnalyticsPage";
import { Outlet } from "react-router-dom";

const Main = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};

export default Main;

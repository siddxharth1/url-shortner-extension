import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react";
import React from "react";
import { RiLockPasswordLine } from "react-icons/ri";

const ForgotPassword = () => {
  return (
    <Flex justifyContent={"center"} alignItems={"center"} minH={"100vh"}>
      <Stack w={"400px"}>
        <Flex justifyContent={"center"}>
          <RiLockPasswordLine size={100} />
        </Flex>
        <Heading>Forgotten Password</Heading>
        <Text>
          Enter your email and we'll send you a link to get back into your
          account.
        </Text>
        <Input placeholder="Enter your email" type="email" />
        <Button>Send link</Button>
      </Stack>
    </Flex>
  );
};

export default ForgotPassword;

import { Center, Heading } from "@chakra-ui/react";
import {
  Button,
  FormControl,
  Flex,
  Input,
  Stack,
  useColorModeValue,
  HStack,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { PinInput, PinInputField } from "@chakra-ui/react";
import { useState } from "react";
import { backendURL } from "../constants";

const VerifyEmailForm = ({ email }) => {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const handleChange = (value) => {
    setOtp(value);
  };
  const handleOTPVerification = async (e) => {
    e.preventDefault();
    const resp = await fetch(backendURL + "/user/verifyOTP", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, otp }),
    });

    const data = await resp.json();
    console.log(data);

    if (resp.ok) {
      window.alert("Email verified successfully");
      navigate("/login");
    }
  };

  return (
    <Flex
      minH={"100vh"}
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <Stack
        spacing={4}
        w={"full"}
        maxW={"sm"}
        bg={useColorModeValue("white", "gray.700")}
        rounded={"xl"}
        boxShadow={"lg"}
        p={6}
        my={10}
      >
        <Center>
          <Heading lineHeight={1.1} fontSize={{ base: "2xl", md: "3xl" }}>
            Verify your Email
          </Heading>
        </Center>
        <Center
          fontSize={{ base: "sm", sm: "md" }}
          color={useColorModeValue("gray.800", "gray.400")}
        >
          We have sent code to your email
        </Center>
        <Center
          fontSize={{ base: "sm", sm: "md" }}
          fontWeight="bold"
          color={useColorModeValue("gray.800", "gray.400")}
        >
          {email}
        </Center>
        <form onSubmit={(e) => handleOTPVerification(e)}>
          <FormControl>
            <Center>
              <HStack>
                <PinInput value={otp} onChange={handleChange}>
                  <PinInputField />
                  <PinInputField />
                  <PinInputField />
                  <PinInputField />
                  <PinInputField />
                  <PinInputField />
                </PinInput>
              </HStack>
            </Center>
          </FormControl>
          <br />
          <Stack spacing={6}>
            <Button
              type="submit"
              bg={"blue.400"}
              color={"white"}
              _hover={{
                bg: "blue.500",
              }}
            >
              Verify
            </Button>
          </Stack>
        </form>
      </Stack>
    </Flex>
  );
};

export default VerifyEmailForm;

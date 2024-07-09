import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSignup } from "../hooks/useSignup";

const Signup = () => {
  const email = useRef(null);
  const name = useRef(null);
  const password = useRef(null);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordSame, setIsPasswordSame] = useState(true);

  const locaton = useLocation();
  console.log("url " + locaton);

  const { signup, error, loading } = useSignup();

  useEffect(() => {
    if (error) {
      if (error.code) {
        toast(error.error, { type: "error" });
      } else {
        toast(error.error, { type: "error" });
      }
    }
  }, [error]);

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    await signup(
      name.current.value,
      email.current.value,
      password.current.value,
      confirmPassword
    );
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    if (e.target.value != password.current.value) {
      console.log("password not matching");
      setIsPasswordSame(false);
    } else {
      setIsPasswordSame(true);
    }
  };

  return (
    <Flex alignItems="center" justifyContent="center" minH="100vh">
      <Stack
        style={{ border: "1px solid black" }}
        p={5}
        rounded={6}
        minW="300px"
        w="30%"
      >
        <Stack>
          <Heading>Sign up</Heading>
        </Stack>

        <Box>
          <form action="" onSubmit={handleSignupSubmit}>
            <Stack>
              <FormControl>
                <FormLabel>Name</FormLabel>
                <Input type="text" placeholder="Name" ref={name} />
              </FormControl>
              <FormControl>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  placeholder="example@gmail.com"
                  ref={email}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Enter Password</FormLabel>
                <Input type="password" placeholder="password" ref={password} />
              </FormControl>
              <FormControl>
                <FormLabel>Confirm Password</FormLabel>
                <Input
                  type="password"
                  placeholder="confirm password"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  onFocus={() => setIsFocused(true)}
                  style={{
                    borderColor: !isPasswordSame && isFocused ? "red" : "",
                  }}
                />
              </FormControl>

              <Button
                type="submit"
                isDisabled={
                  !isPasswordSame ||
                  !password.current?.value ||
                  !name.current?.value ||
                  !email.current?.value ||
                  !confirmPassword
                }
                isLoading={loading}
              >
                Signup
              </Button>
            </Stack>
            <Text my={2}>
              Already have an account?{" "}
              <Link
                to="/login"
                style={{
                  textDecoration: "none",
                  fontWeight: "600",
                  color: "blue",
                }}
              >
                Login
              </Link>
            </Text>
          </form>
        </Box>
      </Stack>
      <ToastContainer
        stacked
        position="bottom-right"
        autoClose={2000}
        progressStyle={{
          background: "green",
        }}
      />
    </Flex>
  );
};

export default Signup;

import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Link as ChakraLink,
  Text,
} from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import { IoMdEye } from "react-icons/io";
import { IoEyeOff } from "react-icons/io5";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLogin } from "../hooks/useLogin";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const email = useRef();
  const password = useRef();

  const locaton = useLocation();
  console.log("url " + locaton);

  const toggleEyeIcon = () => {
    setShowPassword(!showPassword);
  };
  const navigate = useNavigate();

  const { login, error, loading } = useLogin();

  useEffect(() => {
    if (error) {
      if (error.code === 400) {
        toast(error.error, { type: "error" });
      }
      if (error.code === 200) {
        toast(error.error, { type: "success" });
        navigate("/");
      }
    }
  }, [error]);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    await login(email.current.value, password.current.value);
  };

  return (
    <Flex alignItems="center" justifyContent="center" minH="100vh">
      <Stack
        style={{ border: "1px solid black" }}
        p={5}
        my={5}
        rounded={6}
        minW="300px"
        w="30%"
      >
        <Stack>
          <Heading>Welcome back</Heading>
        </Stack>

        <Box>
          <form onSubmit={handleLoginSubmit}>
            <Stack>
              <FormControl>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  ref={email}
                  placeholder="example@gmail.com"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="password"
                    ref={password}
                  />
                  <InputRightElement>
                    <IconButton
                      size={"sm"}
                      icon={
                        showPassword ? (
                          <IoMdEye size={20} />
                        ) : (
                          <IoEyeOff size={20} />
                        )
                      }
                      onClick={toggleEyeIcon}
                    />
                  </InputRightElement>
                </InputGroup>
              </FormControl>
              <Link
                style={{
                  margin: "7px 0",
                  textDecoration: "none",
                  fontWeight: "600",
                  color: "blue",
                }}
                to="/forgotpassword"
              >
                Forgot Password?
              </Link>
              <Button type="submit" isLoading={loading}>
                Login
              </Button>
            </Stack>
          </form>
          <Text my={2}>
            Don't have an account?{" "}
            <Link
              to="/signup"
              style={{
                textDecoration: "none",
                fontWeight: "600",
                color: "blue",
              }}
            >
              Signup
            </Link>
          </Text>
        </Box>
      </Stack>
      <ToastContainer stacked position="bottom-right" autoClose={2000} />
    </Flex>
  );
};

export default Login;

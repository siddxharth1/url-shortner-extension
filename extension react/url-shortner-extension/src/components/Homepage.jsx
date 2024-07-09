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
  Text,
} from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import URLsTable from "./URLsTable";
import { HiLink } from "react-icons/hi";
import { backendURL, frontendURL } from "../constants";
import { Link } from "react-router-dom";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuthContext } from "../hooks/useAuthContext";

const Homepage = () => {
  const urlToShort = useRef(null);
  const [shortURL, setShortURL] = useState("");
  const [showPopup, setShowPopup] = useState({});

  const { user } = useAuthContext();
  const isExtension =
    window.location.origin.includes("chrome-extension") ||
    window.location.origin.includes("moz-extension");

  useEffect(() => {
    const getCurrentTabURL = async () => {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });
      console.log(tab.url);
      urlToShort.current.value = tab.url;
    };

    if (isExtension) {
      getCurrentTabURL();
    }
  }, []);

  const handleUploadURLToShort = async (e) => {
    e.preventDefault();
    const url = urlToShort.current.value;
    if (!user?.token) return;
    const response = await fetch(backendURL + "/api/url", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: user.token,
      },
      body: JSON.stringify({ url }),
    });

    const data = await response.json();
    if (response.status === 400) {
      toast(data?.resp, { type: "error" });
      if (data?.popup) {
        setShowPopup(data);
      }
      return;
    }
    setShortURL(data.resp);
    console.log(data);
    toast("URL Shortned Successfully!");

    urlToShort.current.value = "";
  };
  return (
    <Box m={isExtension ? 0 : 30}>
      {showPopup?.resp && (
        <Flex
          height="100vh"
          width="100vw"
          zIndex={100}
          position="fixed"
          top="0"
          left="0"
          alignItems="center"
          justifyContent="center"
          bg="rgba(0, 0, 0, 0.7)"
          backdropFilter="blur(4px)"
        >
          <Box
            p={6}
            bg="white"
            borderRadius="lg"
            boxShadow="lg"
            maxWidth="400px"
            textAlign="center"
          >
            <Heading size="lg" mb={4}>
              {showPopup.popupText}
            </Heading>
            <Text mb={4}>{showPopup.message}</Text>
            <Button
              onClick={() => setShowPopup(null)}
              colorScheme="red"
              mt={2}
              width="full"
            >
              Close
            </Button>
            {isExtension ? (
              <Link
                href={frontendURL + "/premium"}
                target="_blank"
                color="blue"
                _hover={{ textDecoration: "none" }}
              >
                <Button colorScheme="blue" mt={2} width="full">
                  Buy Premium
                </Button>
              </Link>
            ) : (
              <Link to="/premium">
                <Button colorScheme="blue" mt={2} width="full">
                  Buy Premium
                </Button>
              </Link>
            )}
          </Box>
        </Flex>
      )}

      <Center>
        <Flex flexDirection="column" alignItems="center">
          <Text
            style={{
              fontWeight: "bolder",
              fontSize: !isExtension ? "2rem" : "1.5rem",
            }}
            textAlign="center"
          >
            Short Your looooooong URL
          </Text>
          {!isExtension && (
            <Text w="80vw" maxW="700px" textAlign="center">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem,
              eveniet! Dolore odio similique error consequatur hic harum ipsum
              nobis nam?
            </Text>
          )}

          {!isExtension && (
            <>
              <br />
              <br />
            </>
          )}

          <form onSubmit={handleUploadURLToShort}>
            <InputGroup size="lg">
              <InputLeftElement mx={1.5}>
                <HiLink />
              </InputLeftElement>
              <Input
                placeholder="https://example.com"
                pr={32}
                pl={10}
                mx={{ base: 2, md: 2 }}
                size="lg"
                type="url"
                w={{ base: "80vw", md: "50vw" }}
                ref={urlToShort}
              />
              <InputRightElement width="8.5rem">
                <Button h="2.5rem" size="sm" type="submit">
                  Shortner URL
                </Button>
              </InputRightElement>
            </InputGroup>
          </form>
          {shortURL && (
            <Text mt={3} fontSize="lg">
              Short URL:{" "}
              <Link color={"blue"}>{backendURL + "/" + shortURL.shortURL}</Link>
            </Text>
          )}
        </Flex>
      </Center>
      <ToastContainer
        progressStyle={{
          background: "green",
        }}
      />
    </Box>
  );
};

export default Homepage;

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
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import { HiLink } from "react-icons/hi";
import { backendURL, frontendURL } from "../constants";
import { Link, useNavigate } from "react-router-dom";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuthContext } from "../hooks/useAuthContext";

const Homepage = () => {
  const urlToShort = useRef(null);
  const [shortURL, setShortURL] = useState("");
  const [showPopup, setShowPopup] = useState({});
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

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
    setLoading(true);
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

    if (response.status === 401) {
      toast("Please login to shorten the URL", { type: "error" });
      //remove user from cookies
      document.cookie = "user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

      navigate("/login");
      return;
    }

    const data = await response.json();
    if (response.status === 400) {
      toast(data?.resp, { type: "error" });
      if (data?.popup) {
        onOpen();
        setShowPopup(data);
      }
      return;
    }
    console.log(data);

    setShortURL(data.resp);
    toast("URL Shortned Successfully!");

    urlToShort.current.value = "";
    setLoading(false);
  };
  return (
    <Box
      m={isExtension ? 0 : 4}
      p={!isExtension && 4}
      py={isExtension && 2}
      minH="30vh"
    >
      {showPopup?.resp && (
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader fontSize="lg">{showPopup.popupText}</ModalHeader>
            <ModalCloseButton />
            <ModalBody fontSize="md">{showPopup.message}</ModalBody>
            <ModalFooter>
              <Button
                colorScheme="red"
                size="sm"
                onClick={() => {
                  onClose();
                  setShowPopup(null);
                }}
              >
                Close
              </Button>
              {isExtension ? (
                <a
                  href={frontendURL + "/premium"}
                  target="_blank"
                  style={{ textDecoration: "none", marginLeft: "1rem" }}
                >
                  <Button colorScheme="blue" size="sm">
                    Buy Premium
                  </Button>
                </a>
              ) : (
                <Link to="/premium" style={{ marginLeft: "1rem" }}>
                  <Button colorScheme="blue" size="sm">
                    Buy Premium
                  </Button>
                </Link>
              )}
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}

      <Center m={0}>
        <Flex flexDirection="column" alignItems="center">
          {!isExtension && (
            <>
              <Text
                fontWeight="bold"
                fontSize={isExtension ? "1.5rem" : "2rem"}
                textAlign={!isExtension && "center"}
              >
                Short Your Long URL
              </Text>

              <Text
                w="80vw"
                maxW="500px"
                textAlign="center"
                mt={2}
                fontSize="sm"
              >
                Easily shorten your long URLs with this tool. Simply enter your
                URL below and hit "Shorten URL" to generate a shorter link.
              </Text>
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
                required
              />
              <InputRightElement width="8.5rem">
                <Button h="2.5rem" size="sm" type="submit" isLoading={loading}>
                  Shortner URL
                </Button>
              </InputRightElement>
            </InputGroup>
          </form>

          {shortURL && (
            <Text mt={3} fontSize="sm">
              Short URL:{" "}
              <a
                style={{ color: "blue" }}
                target="_blank"
                href={frontendURL + "/" + shortURL.shortURL}
              >
                {frontendURL + "/" + shortURL.shortURL}
              </a>
            </Text>
          )}
        </Flex>
      </Center>
    </Box>
  );
};

export default Homepage;

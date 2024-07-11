import {
  Box,
  Button,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import React from "react";
import { backendURL, frontendURL } from "../constants";
import { Link } from "react-router-dom";
import { FaRegCopy } from "react-icons/fa6";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AiOutlineDelete } from "react-icons/ai";
import { useAuthContext } from "../hooks/useAuthContext";

const URLsTable = ({ urls, setUrls }) => {
  const { user } = useAuthContext();

  const copyLinkToClipboard = (url) => {
    navigator.clipboard.writeText(frontendURL + "/" + url.shortURL);
    toast("Link copied to clipboard!");
  };

  const isExtension =
    window.location.origin.includes("chrome-extension") ||
    window.location.origin.includes("moz-extension");

  const deleteURLHandler = async (id) => {
    const resp = await fetch(backendURL + "/api/url", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        token: user.token,
      },
      body: JSON.stringify({
        id: id,
      }),
    });

    const data = await resp.json();
    if (resp.status === 400) {
      toast(data.resp, { type: "error" });
      return;
    }
    if (resp.ok) {
      setUrls(urls.filter((url) => url._id !== id));
    }
    toast("URL deleted successfully!");
  };

  return (
    <Box
      p={1}
      style={{
        border: "1px solid grey",
        borderRadius: "12px",
        margin: "20px 0",
      }}
    >
      <TableContainer overflowX="auto" w={{ base: "80vw", lg: "100%" }}>
        <Table size={{ base: "sm", md: "md", lg: "lg" }}>
          <Thead>
            <Tr>
              <Th>Sr. no.</Th>
              <Th>Short URL</Th>
              <Th>Original URL</Th>
              <Th textAlign="center" isNumeric>
                Clicks
              </Th>
              <Th textAlign="center">Date</Th>
              <Th textAlign="center">Analytics</Th>
            </Tr>
          </Thead>
          <Tbody>
            {urls.map((url, index) => {
              return (
                <Tr key={url._id}>
                  <Td>{index + 1}</Td>
                  <Td>
                    <Box style={{ display: "flex", gap: "10px" }}>
                      {frontendURL + "/" + url.shortURL}
                      <FaRegCopy
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          copyLinkToClipboard(url);
                        }}
                      />
                    </Box>
                  </Td>
                  <Td>
                    <Box
                      width={"300px"}
                      whiteSpace="nowrap"
                      overflow="hidden"
                      textOverflow="ellipsis"
                    >
                      <a target="_blank" href={url.originalURL}>
                        {url.originalURL}
                      </a>
                    </Box>
                  </Td>
                  <Td textAlign="center">{url.visitHistory.length}</Td>
                  <Td textAlign="center">{url.createdAt.substring(0, 10)}</Td>
                  <Td textAlign="center">
                    {isExtension ? (
                      <a
                        href={`${frontendURL}/analytics/${url.shortURL}`}
                        target="_blank"
                        style={{ color: "blue" }}
                      >
                        view
                      </a>
                    ) : (
                      <Link to={`/analytics/${url.shortURL}`}>view</Link>
                    )}
                  </Td>
                  <Td p={0}>
                    <AiOutlineDelete
                      onClick={() => {
                        deleteURLHandler(url._id);
                      }}
                      style={{
                        cursor: "pointer",
                        color: "red",
                        margin: "0px",
                        fontSize: "23px",
                      }}
                    />
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>
      <ToastContainer
        stacked
        position="bottom-right"
        autoClose={2000}
        progressStyle={{
          background: "green",
        }}
      />
    </Box>
  );
};

export default URLsTable;

import React, { useEffect, useState } from "react";
import { backendURL } from "../constants";
import { useAuthContext } from "../hooks/useAuthContext";
import { Box, Button, Divider, Heading, Text } from "@chakra-ui/react";
import URLsTable from "./URLsTable";
import { Link, useNavigate } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";

const Profile = () => {
  const { user } = useAuthContext();
  const [userData, setUserData] = useState(null);
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllURLs = async () => {
      setLoading(true);
      // console.log(user);
      if (!user?.token) return;
      console.log("fetching urls");
      const response = await fetch(backendURL + "/api/url", {
        headers: {
          token: user.token,
        },
      });
      const data = await response.json();
      console.log(data);
      setUrls(data);
      setLoading(false);
    };

    const getUserData = async () => {
      const resp = await fetch(backendURL + "/user/userInfo", {
        headers: {
          token: user.token,
        },
      });
      const data = await resp.json();
      setUserData(data);
    };
    if (user) {
      fetchAllURLs();
      getUserData();
    }
  }, [user]);

  return (
    <Box mx="6vw">
      <Button onClick={() => navigate(-1)}>
        <IoIosArrowBack />
      </Button>
      <Heading as="h1" size="md" my={4}>
        Profile
      </Heading>
      {loading && <Heading mt={5}>Loading...</Heading>}

      {!loading && userData && (
        <Box>
          <Text as="h3" size="sm" my={2}>
            Name: {userData.data.name}
          </Text>
          <Text as="h3" size="sm" my={2}>
            Email: {userData.data.email}
          </Text>
          <Text as="h3" size="sm" my={2}>
            Created At: {userData.data.createdAt}
          </Text>
          <Text as="h3" size="sm" my={2}>
            Updated At: {userData.data.updatedAt}
          </Text>
          <Text as="h3" size="sm" my={2}>
            Total Links Created: {userData.numberOfUrlsCreated}
          </Text>
          <Text as="h3" size="sm" my={2}>
            Premium: {userData.data.premiumUser ? "Yes" : "No"} -{" "}
            <Link to="/premium"> Upgrade to Premium</Link>
          </Text>
        </Box>
      )}
      <Divider borderColor={"black"} my={10} />
      <Heading as="h1" size="md">
        Analytics
      </Heading>
      {!loading && urls.length === 0 && (
        <Heading>No URLs Shortned Yet!</Heading>
      )}
      {!loading && urls.length !== 0 && (
        <URLsTable urls={urls} setUrls={setUrls} />
      )}
    </Box>
  );
};

export default Profile;

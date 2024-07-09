import {
  Box,
  Button,
  Flex,
  Heading,
  Link,
  Stack,
  Text,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { backendURL, frontendURL } from "../constants";
import { useAuthContext } from "../hooks/useAuthContext";
import { Chart as ChartJS } from "chart.js/auto";
import { Bar, Line, Pie } from "react-chartjs-2";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { IoIosArrowBack } from "react-icons/io";

const groupData = (visitHistory) => {
  console.log(visitHistory);
  const visitsByState = [];
  const visitsByDate = [];

  visitHistory.forEach((visit) => {
    const state = visit.location.state_prov;
    const date = visit.timestamps;

    const stateIndex = visitsByState.findIndex((item) => item.state === state);
    if (stateIndex === -1) {
      visitsByState.push({ state, count: 1 });
    } else {
      visitsByState[stateIndex].count++;
    }

    const dateIndex = visitsByDate.findIndex((item) => item.date === date);
    if (dateIndex === -1) {
      visitsByDate.push({ date, count: 1 });
    } else {
      visitsByDate[dateIndex].count++;
    }
  });

  return { visitsByState, visitsByDate };
};

const AnalyticsPage = () => {
  const [analytics, setAnalytics] = useState([]);
  const [chartData, setChartData] = useState({});
  const { id } = useParams();
  const { user } = useAuthContext();
  const navigate = useNavigate();

  const locaton = useLocation();
  console.log("url " + locaton);

  useEffect(() => {
    const getAnalytics = async (id) => {
      const resp = await fetch(backendURL + `/api/url/analytics/${id}`, {
        headers: {
          token: user.token,
        },
      });
      const data = await resp.json();
      setAnalytics(data);

      const groupedData = groupData(data.resp.visitHistory);
      setChartData(groupedData);
      console.log(groupedData);
    };
    if (id) {
      getAnalytics(id);
    }
  }, [id, user.token]);

  if (analytics.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <Box mt={1} px={"5vw"}>
      <Button onClick={() => navigate(-1)}>
        <IoIosArrowBack />
      </Button>

      <Heading size="lg">Analytics</Heading>

      <Box>
        <Text>
          Original URL: <Link>{analytics.resp.originalURL}</Link>
        </Text>
        <Text>
          Short URL: <Link> {frontendURL + "/" + analytics.resp.shortURL}</Link>
        </Text>
        <Text>Created on: {analytics.resp.createdAt.split("T")[0]}</Text>
        <Text>Total Visit Count: {analytics.resp.visitHistory.length}</Text>
      </Box>

      <Flex>
        <Box mt={5}>
          <Heading size="md">Visits by State</Heading>
          <Stack>
            <Bar
              data={{
                labels: chartData.visitsByState.map((item) => item.state),
                datasets: [
                  {
                    label: "Visits",
                    data: chartData.visitsByState.map((item) => item.count),
                  },
                ],
              }}
            />
          </Stack>
          <Stack>
            <Heading size="md">Visits by Date</Heading>
            <Bar
              data={{
                labels: chartData.visitsByDate.map((item) => item.date),
                datasets: [
                  {
                    label: "Visits",
                    data: chartData.visitsByDate.map((item) => item.count),
                  },
                ],
              }}
            />
          </Stack>

          <ComposableMap>
            <Geographies
              geography={
                "https://raw.githubusercontent.com/lotusms/world-map-data/main/world.json"
              }
            >
              {({ geographies }) =>
                geographies.map((geo) => (
                  <Geography key={geo.rsmKey} geography={geo} fill="#808080" />
                ))
              }
            </Geographies>
          </ComposableMap>
        </Box>
      </Flex>
    </Box>
  );
};

export default AnalyticsPage;

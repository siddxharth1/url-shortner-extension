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
    <Box mt={4} px={{ base: "4", md: "5vw" }} py={4}>
      <Button
        onClick={() => navigate(-1)}
        mb={4}
        variant="outline"
        leftIcon={<IoIosArrowBack />}
      >
        Back
      </Button>

      <Heading size="lg" mb={6}>
        Analytics
      </Heading>

      <Box mb={6}>
        <Text>
          Original URL:{" "}
          <Link color="teal.500" href={analytics.resp.originalURL} isExternal>
            {analytics.resp.originalURL}
          </Link>
        </Text>
        <Text>
          Short URL:{" "}
          <Link
            color="teal.500"
            href={`${frontendURL}/${analytics.resp.shortURL}`}
            isExternal
          >
            {frontendURL}/{analytics.resp.shortURL}
          </Link>
        </Text>
        <Text>
          Created on: {new Date(analytics.resp.createdAt).toLocaleDateString()}
        </Text>
        <Text>Total Visit Count: {analytics.resp.visitHistory.length}</Text>
      </Box>

      <Flex height={"30vh"} style={{ maxHeight: "500px" }} gap={6}>
        <Box flex="1">
          <Heading size="md" mb={4}>
            Visits by State
          </Heading>
          <Bar
            data={{
              labels: chartData.visitsByState.map((item) => item.state),
              datasets: [
                {
                  label: "Visits",
                  data: chartData.visitsByState.map((item) => item.count),
                  backgroundColor: "rgba(72, 187, 120, 0.2)",
                  borderColor: "rgba(72, 187, 120, 1)",
                  borderWidth: 1,
                },
              ],
            }}
            options={{ responsive: true, maintainAspectRatio: false }}
          />
        </Box>

        <Box flex="1">
          <Heading size="md" mb={4}>
            Visits by Date
          </Heading>
          <Bar
            data={{
              labels: chartData.visitsByDate.map((item) => item.date),
              datasets: [
                {
                  label: "Visits",
                  data: chartData.visitsByDate.map((item) => item.count),
                  backgroundColor: "rgba(66, 153, 225, 0.2)",
                  borderColor: "rgba(66, 153, 225, 1)",
                  borderWidth: 1,
                },
              ],
            }}
            options={{ responsive: true, maintainAspectRatio: false }}
          />
        </Box>
      </Flex>

      <Box mt={10}>
        <Heading size="md" mb={4}>
          Geographical Distribution
        </Heading>
        <ComposableMap>
          <Geographies geography="https://raw.githubusercontent.com/lotusms/world-map-data/main/world.json">
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="#E2E8F0"
                  stroke="#FFFFFF"
                />
              ))
            }
          </Geographies>
        </ComposableMap>
      </Box>
    </Box>
  );
};

export default AnalyticsPage;

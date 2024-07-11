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
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import geoData from "./countries.geo.json";

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

const groupDataMap = (visitHistory) => {
  const visitsByCountry = {};
  visitHistory.forEach((visit) => {
    const country = visit.location.country_name;
    if (visitsByCountry[country]) {
      visitsByCountry[country]++;
    } else {
      visitsByCountry[country] = 1;
    }
  });
  return visitsByCountry;
};

const AnalyticsPage = () => {
  const [analytics, setAnalytics] = useState([]);
  const [chartData, setChartData] = useState({});
  const [visitsByCountry, setVisitsByCountry] = useState({});
  const { id } = useParams();
  const { user } = useAuthContext();
  const navigate = useNavigate();

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

      const groupedDataMap = groupDataMap(data.resp.visitHistory);
      setVisitsByCountry(groupedDataMap);
      console.log(groupedData);
    };
    if (id) {
      getAnalytics(id);
    }
  }, [id, user.token]);

  const getColor = (count) => {
    return count > 50
      ? "#800026"
      : count > 20
      ? "#BD0026"
      : count > 10
      ? "#E31A1C"
      : count > 5
      ? "#FC4E2A"
      : count > 2
      ? "#FD8D3C"
      : count > 1
      ? "#FEB24C"
      : count > 0
      ? "#FED976"
      : "#808080";
  };

  const style = (feature) => {
    const country = feature.properties.name;
    const count = visitsByCountry[country] || 0;
    return {
      fillColor: getColor(count),
      weight: 1,
      opacity: 1,
      color: "white",
      dashArray: "", // Remove the dashed border
      fillOpacity: 0.7,
    };
  };

  const onEachFeature = (feature, layer) => {
    const country = feature.properties.name;
    const count = visitsByCountry[country] || 0;
    layer.bindTooltip(`${country}: ${count} clicks`);

    // Add click event listener to change style on click
    layer.on({
      click: (e) => {
        e.target.setStyle({
          weight: 1,
          color: "white",
          dashArray: "", // Ensure the clicked feature style matches the default style
        });
      },
    });
  };

  const bounds = [
    [-90, -180],
    [90, 180],
  ];

  if (analytics.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <Box mx="6vw">
      <Button onClick={() => navigate(-1)}>
        <IoIosArrowBack />
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
        <MapContainer
          center={[20, 0]}
          zoom={2}
          style={{ height: "500px", width: "100%" }}
          maxBounds={bounds}
          maxBoundsViscosity={1.0}
          minZoom={2}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <GeoJSON data={geoData} style={style} onEachFeature={onEachFeature} />
        </MapContainer>
      </Box>
    </Box>
  );
};

export default AnalyticsPage;

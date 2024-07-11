import { Box, Spinner } from "@chakra-ui/react";
import React from "react";

const Loading = () => {
  return (
    <div>
      {/* create a loading screen using chakra ui */}
      <Box
        w="100%"
        h="100vh"
        d="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="blue.500"
          size="xl"
        />
      </Box>
    </div>
  );
};

export default Loading;

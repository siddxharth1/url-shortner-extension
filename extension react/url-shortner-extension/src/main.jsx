import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter, MemoryRouter } from "react-router-dom";
import { AuthContextProvider } from "./context/AuthContext.jsx";

const isExtension =
  window.location.origin.includes("chrome-extension") ||
  window.location.origin.includes("moz-extension");

ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
  <>
    {isExtension && (
      <MemoryRouter>
        <ChakraProvider>
          <AuthContextProvider>
            <App />
          </AuthContextProvider>
        </ChakraProvider>
      </MemoryRouter>
    )}

    {!isExtension && (
      <BrowserRouter>
        <ChakraProvider>
          <AuthContextProvider>
            <App />
          </AuthContextProvider>
        </ChakraProvider>
      </BrowserRouter>
    )}
  </>

  // </React.StrictMode>
);

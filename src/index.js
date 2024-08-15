import { ChakraProvider, Flex } from "@chakra-ui/react";
import "@fontsource/source-sans-pro/400.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { ErrorBoundary } from "react-error-boundary";
import Body from "./components/Body";
import { DataProvider } from "./DataContext";
import customTheme from "./theme";

const App = () => {
  return (
    <ErrorBoundary
      fallbackRender={({ error }) => {
        console.warn(
          "Hubo un error inesperado. Se limpian los datos guardados",
          error,
        );
        localStorage.setItem("fiubaplan", JSON.stringify({}));
      }}
    >
      <DataProvider>
        <Flex direction="columns" h="100vh">
          <Body />
        </Flex>
      </DataProvider>
    </ErrorBoundary>
  );
};

const container = document.getElementById("root");
const root = ReactDOM.createRoot(container);

root.render(
  <ChakraProvider theme={customTheme}>
    <App />
  </ChakraProvider>,
);

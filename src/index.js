import { ChakraProvider, Flex } from "@chakra-ui/react";
import "@fontsource/source-sans-pro/400.css";
import React from "react";
import ReactDOM from "react-dom/client";
import Body from "./components/Body";
import customTheme from "./theme";
import { DataProvider } from "./DataContext";

const App = () => {
  return (
    <DataProvider>
      <Flex direction="columns" h="100vh">
        <Body />
      </Flex>
    </DataProvider>
  );
};

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);

root.render(
  <ChakraProvider theme={customTheme}>
    <App />
  </ChakraProvider>
);

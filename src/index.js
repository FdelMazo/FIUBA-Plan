import { ChakraProvider, Flex } from "@chakra-ui/react";
import "@fontsource/source-sans-pro/400.css";
import React from "react";
import ReactDOM from "react-dom/client";
import Body from "./components/Body";
import { DataContext } from "./Context";
import customTheme from "./theme";
import useData from "./useData";

const App = () => {
  const dataHook = useData();

  return (
    <DataContext.Provider value={dataHook}>
      <Flex direction="columns" h="100vh">
        <Body />
      </Flex>
    </DataContext.Provider>
  );
};

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);

root.render(
  <ChakraProvider theme={customTheme}>
    <App />
  </ChakraProvider>
);

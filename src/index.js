import { ChakraProvider, CSSReset, Flex } from "@chakra-ui/react";
import "@fontsource/noto-sans-jp/400.css";
import React from "react";
import ReactDOM from "react-dom";
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

ReactDOM.render(
  <ChakraProvider theme={customTheme}>
    <CSSReset />
    <App />
  </ChakraProvider>,
  document.getElementById("root")
);

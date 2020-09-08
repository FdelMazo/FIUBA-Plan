import React from "react";
import ReactDOM from "react-dom";
import { ThemeProvider, Flex } from "@chakra-ui/core";
import { customTheme } from "./theme";
import Body from "./components/Body";
import useData from "./useData";
import { DataContext } from "./Context";

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
  <ThemeProvider theme={customTheme}>
    <App />
  </ThemeProvider>,
  document.getElementById("root")
);

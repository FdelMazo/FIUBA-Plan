import React from "react";
import ReactDOM from "react-dom";
import { ThemeProvider, Flex } from "@chakra-ui/core";
import { customTheme } from "./theme";
import Body from "./components/Body";

const App = () => {
  return (
    <Flex direction="column" h="100vh">
      <Body />
    </Flex>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={customTheme}>
      <App />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

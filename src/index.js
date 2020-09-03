import React from "react";
import ReactDOM from "react-dom";
import { ThemeProvider } from "@chakra-ui/core";
import { customTheme } from "./theme";
import Body from "./components/Body";

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={customTheme}>
      <Body />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

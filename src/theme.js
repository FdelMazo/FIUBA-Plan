import { extendTheme } from "@chakra-ui/react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./Style.css";

const config = {
  initialColorMode: "system",
};

const customTheme = extendTheme({
  fonts: {
    body: "Source Sans Pro",
    heading: "Georgia, serif",
    mono: "Menlo, monospace",
  },
  colors: {
    primary: {
      50: "#e5cff8",
      100: "#dec4f7",
      200: "#d8b8f6",
      300: "#d2adf4",
      400: "#cba2f3",
      500: "#bf8cf0",
      600: "#b881ee",
      700: "#b275ed",
      800: "#ac6aeb",
      900: "#a55fea",
    },
    drawerbg: "#222d38",
    drawerbgdark: "#3c4042",
    drawerbgalpha: "#222d38CC",
    drawerbgdarkalpha: "#3c4042CC",
    agendabgdark: "#323f56",
    calendarbg: "#f7f9fa",
    calendarbgdark: "#222d38",
    calendarbggrey: "#ededed",
  },
  config,
});

export default customTheme;

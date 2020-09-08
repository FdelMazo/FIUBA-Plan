import React from "react";
import Calendar from "./Calendar";
import { Box } from "@chakra-ui/core";
import "moment/locale/es";
import "react-big-calendar/lib/css/react-big-calendar.css";
import MateriasDrawer from "./MateriasDrawer";
import { DataContext } from "../Context";

const Body = () => {
  const { events } = React.useContext(DataContext);

  return (
    <Box flexGrow={1}>
      <MateriasDrawer />
      <Calendar events={events} />
    </Box>
  );
};

export default Body;

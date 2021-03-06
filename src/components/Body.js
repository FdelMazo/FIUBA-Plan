import React from "react";
import Calendar from "./Calendar";
import { Box } from "@chakra-ui/core";
import "moment/locale/es";
import "react-big-calendar/lib/css/react-big-calendar.css";
import MateriasDrawer from "./MateriasDrawer";
import { DataContext } from "../Context";
import useWindowSize from "../utils/useWindowSize";

const Body = () => {
  const { events } = React.useContext(DataContext);
  const [useAgenda, setUseAgenda] = React.useState(false);
  const { width } = useWindowSize();

  React.useEffect(() => {
    setUseAgenda(width < 1000);
  }, [width]);

  return (
    <Box flexGrow={1}>
      <MateriasDrawer 
        useAgenda={useAgenda} 
        setUseAgenda={setUseAgenda}
      />
      <Calendar 
        events={events} 
        useAgenda={useAgenda} 
      />
    </Box>
  );
};

export default Body;

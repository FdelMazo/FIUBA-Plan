import { Box } from "@chakra-ui/react";
import "moment/locale/es";
import React from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { DataContext } from "../Context";
import useWindowSize from "../utils/useWindowSize";
import Calendar from "./Calendar";
import MateriasDrawer from "./MateriasDrawer";

const Body = () => {
  const { events } = React.useContext(DataContext);
  const [useAgenda, setUseAgenda] = React.useState(false);
  const { width } = useWindowSize();

  React.useEffect(() => {
    setUseAgenda(width < 1000);
  }, [width]);

  return (
    <Box flexGrow={1}>
      <MateriasDrawer useAgenda={useAgenda} setUseAgenda={setUseAgenda} />
      <Calendar events={events} useAgenda={useAgenda} />
    </Box>
  );
};

export default Body;

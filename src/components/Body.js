import React from "react";
import Calendar from "./Calendar";
import { useToast, Box, Alert, AlertIcon } from "@chakra-ui/core";
import "moment/locale/es";
import "react-big-calendar/lib/css/react-big-calendar.css";
import MateriasDrawer from "./MateriasDrawer";
import { data } from "../data/horarios";

const Body = () => {
  const toast = useToast();
  const [events, setEvents] = React.useState([]);

  React.useEffect(() => {
    toast({
      position: "bottom-right",
      duration: 2000,
      render: () => (
        <Alert borderRadius={5} mx={10} status="success">
          <AlertIcon />
          Actualizado al {data.cuatrimestre}
        </Alert>
      ),
    });
    toast({
      position: "bottom-right",
      render: () => <MateriasDrawer setEvents={setEvents} />,
      duration: null,
    });
  }, [toast]);

  return (
    <Box flexGrow={1}>
      <Calendar events={events} />
    </Box>
  );
};

export default Body;

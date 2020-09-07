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
      position: "top",
      duration: 2000,
      render: () => (
        <Alert borderRadius={5} m={5} status="success">
          <AlertIcon />
          Actualizado al {data.cuatrimestre}
        </Alert>
      ),
    });
    toast({
      position: "top-right",
      render: () => <MateriasDrawer setEvents={setEvents} />,
      duration: null,
    });
  }, [toast]);

  return (
    <Box mx="3em" my="1em" flexGrow={1}>
      <Calendar events={events} />
    </Box>
  );
};

export default Body;

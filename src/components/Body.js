import React from "react";
import Calendar from "./Calendar";
import { useToast, Box, Alert, AlertIcon } from "@chakra-ui/core";
import "moment/locale/es";
import "react-big-calendar/lib/css/react-big-calendar.css";
import MateriasDrawer from "./MateriasDrawer";
import { DataContext } from "../Context";

const Body = () => {
  const toast = useToast();
  const { data, events } = React.useContext(DataContext);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toast]);

  return (
    <Box flexGrow={1}>
      <MateriasDrawer />
      <Calendar events={events} />
    </Box>
  );
};

export default Body;

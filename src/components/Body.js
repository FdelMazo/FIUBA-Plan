import { AddIcon } from "@chakra-ui/icons";
import {
  Box,
  IconButton,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import "moment/locale/es";
import React from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Snowfall from "react-snowfall";
import { DataContext } from "../Context";
import useWindowSize from "../utils/useWindowSize";
import Calendar from "./Calendar";
import MateriasDrawer from "./MateriasDrawer";

const Body = () => {
  const { activeTabId, events } = React.useContext(DataContext);
  const [useAgenda, setUseAgenda] = React.useState(false);
  const { width } = useWindowSize();
  const { isOpen, onToggle, onClose } = useDisclosure();

  const escKey = React.useCallback(
    (event) => {
      if (event.keyCode === 27) {
        onToggle();
      }
    },
    [onToggle]
  );

  React.useEffect(() => {
    document.addEventListener("keydown", escKey, false);

    return () => {
      document.removeEventListener("keydown", escKey, false);
    };
  }, [escKey]);

  React.useEffect(() => {
    setUseAgenda(width < 1000);
  }, [width]);

  const isChristmasTime = () => {
    const today = new Date();
    const start = new Date(today.getFullYear(), 11, 19);
    const end = new Date(today.getFullYear() + 1, 0, 1);
    return today >= start && today <= end;
  };

  return (
    <Box id={useColorModeValue(undefined, "dark")} flexGrow={1}>
      <MateriasDrawer
        isOpen={isOpen}
        onClose={onClose}
        useAgenda={useAgenda}
        setUseAgenda={setUseAgenda}
      />
      {isChristmasTime() && <Snowfall color="lavender" />}
      <Calendar
        events={events.filter((e) => e.curso.tabId === activeTabId)}
        useAgenda={useAgenda}
      />
      <IconButton
        position="absolute"
        right={10}
        bottom={10}
        borderColor="drawerbg"
        borderWidth={2}
        icon={<AddIcon fontWeight="bold" color="drawerbg" />}
        onClick={onToggle}
        colorScheme="primary"
        aria-label="Agregar Materia"
      />
      {/*  <IconButton
           position="absolute"
           right={100}
           bottom={10}
           borderColor="drawerbg"
           borderWidth={2}
           icon={<WarningTwoIcon fontWeight="bold" color="drawerbg" />}
           onClick={testAll}
           colorScheme="primary"
         /> */}
    </Box>
  );
};

export default Body;

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
import { DataContext } from "../DataContext";
import useWindowSize from "../useWindowSize";
import Calendar from "./Calendar";
import MateriasDrawer from "./MateriasDrawer";
import { useHotkeys } from "react-hotkeys-hook";

const today = new Date();
const start = new Date(today.getFullYear(), 11, 19);
const end = new Date(today.getFullYear() + 1, 0, 1);
const isChristmasTime = today >= start && today <= end;

const Body = () => {
  const { events } = React.useContext(DataContext);
  const [useAgenda, setUseAgenda] = React.useState(false);
  const { width } = useWindowSize();
  const { isOpen, onToggle, onClose } = useDisclosure();
  useHotkeys('esc', onToggle, {
    enableOnFormTags: true,
  })

  React.useEffect(() => {
    setUseAgenda(width < 1000);
  }, [width]);

  return (
    <Box id={useColorModeValue(undefined, "dark")} flexGrow={1}>
      <MateriasDrawer
        isOpen={isOpen}
        onClose={onClose}
        useAgenda={useAgenda}
        setUseAgenda={setUseAgenda}
      />
      {isChristmasTime && <Snowfall color="lavender" />}
      <Calendar
        events={events}
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
    </Box>
  );
};

export default Body;

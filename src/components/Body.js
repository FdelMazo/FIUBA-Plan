import { AddIcon, SmallCloseIcon } from "@chakra-ui/icons";
import {
  Alert,
  Box,
  IconButton,
  Text,
  useColorModeValue,
  useDisclosure,
  useToast,
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
  const { actualizacion, activeTabId, events } = React.useContext(DataContext);
  const [useAgenda, setUseAgenda] = React.useState(false);
  const { width } = useWindowSize();
  const { isOpen, onToggle, onClose } = useDisclosure();
  const toast = useToast();
  const toastIdRef = React.useRef();

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
    toastIdRef.current = toast({
      position: "top-right",
      duration: 3000,
      render: () => (
        <Alert
          borderColor="drawerbg"
          borderWidth={2}
          borderRadius={5}
          right={2}
          status="success"
          color="drawerbg"
          flexDirection="column"
        >
          <SmallCloseIcon
            alignSelf="flex-end"
            cursor="pointer"
            onClick={() => {
              if (toastIdRef.current) {
                toast.close(toastIdRef.current);
              }
            }}
            m="-8px"
          />

          <Box>
            <Text>Actualizado al {actualizacion.cuatrimestre}</Text>
          </Box>
          <Box>
            <Text fontSize="sm">({actualizacion.timestamp})</Text>
          </Box>
        </Alert>
      ),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    setUseAgenda(width < 1000);
  }, [width]);

  const isChristmasTime = () => {
    const today = new Date();
    const start = new Date(today.getFullYear(), 11, 20);
    const end = new Date(today.getFullYear(), 11, 31);
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

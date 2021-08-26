import { AddIcon } from "@chakra-ui/icons";
import {
  Alert,
  AlertIcon,
  Box,
  IconButton,
  useColorModeValue,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import "moment/locale/es";
import React from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { DataContext } from "../Context";
import useWindowSize from "../utils/useWindowSize";
import Calendar from "./Calendar";
import MateriasDrawer from "./MateriasDrawer";

const Body = () => {
  const { actualizacion, events } = React.useContext(DataContext);
  const [useAgenda, setUseAgenda] = React.useState(false);
  const { width } = useWindowSize();
  const { isOpen, onToggle, onClose } = useDisclosure();
  const toast = useToast();

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
    toast({
      position: "bottom-right",
      duration: 2000,
      render: () => (
        <Alert
          borderColor="drawerbg"
          borderWidth={2}
          bottom={20}
          right={5}
          borderRadius={5}
          status="success"
          color="drawerbg"
        >
          <AlertIcon />
          Actualizado al {actualizacion.cuatrimestre}
        </Alert>
      ),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      <Calendar events={events} useAgenda={useAgenda} />
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

import { AddIcon, Icon } from "@chakra-ui/icons";
import {
  Box,
  IconButton,
  Tooltip,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import "moment/locale/es";
import React from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useHotkeys } from "react-hotkeys-hook";
import Snowfall from "react-snowfall";
import { DataContext } from "../DataContext";
import useWindowSize from "../useWindowSize";
import Calendar from "./Calendar";
import ManualUploadModal from "./ManualUploadModal";
import MateriasDrawer from "./MateriasDrawer";

const today = new Date();
const start = new Date(today.getFullYear(), 11, 19);
const end = new Date(today.getFullYear() + 1, 0, 1);
const isChristmasTime = today >= start && today <= end;

const Body = () => {
  const { events, horariosSIU } = React.useContext(DataContext);
  const [useAgenda, setUseAgenda] = React.useState(false);
  const [skipSIU, setSkipSIU] = React.useState(false);
  const { width } = useWindowSize();
  const {
    isOpen: isOpenDrawer,
    onToggle: onToggleDrawer,
    onClose: onCloseDrawer,
  } = useDisclosure();
  const {
    isOpen: isOpenModal,
    onToggle: onToggleModal,
    onClose: onCloseModal,
  } = useDisclosure();

  useHotkeys("esc", horariosSIU || skipSIU ? onToggleDrawer : onToggleModal, {
    enableOnFormTags: true,
  });

  React.useEffect(() => {
    setUseAgenda(width < 1000);
  }, [width]);

  return (
    <Box id={useColorModeValue(undefined, "dark")} flexGrow={1}>
      <MateriasDrawer
        isOpen={isOpenDrawer}
        onClose={onCloseDrawer}
        useAgenda={useAgenda}
        setUseAgenda={setUseAgenda}
        skipSIU={skipSIU}
        onOpenModal={onToggleModal}
      />
      <ManualUploadModal 
        isOpen={isOpenModal} 
        onClose={onCloseModal}
        onSkip={() => setSkipSIU(true)}
        setSkipSIU={setSkipSIU}
      />

      {isChristmasTime && <Snowfall color="lavender" />}
      <Calendar events={events} useAgenda={useAgenda} />
      
      <Box position="absolute" right={10} bottom={10} display="flex" flexDirection="column" gap={2}>
        {(!horariosSIU && !skipSIU) ? (
          <Tooltip label="Cargar horarios del SIU" hasArrow placement="left">
            <IconButton
              borderColor="drawerbg"
              borderWidth={2}
              icon={
                <Icon viewBox="0 0 268 268" boxSize={8}>
                  <g transform="translate(0,268) scale(0.100000,-0.100000)" fill="black" stroke="none">
                    <path
                      d="M360 1976 c-87 -23 -166 -89 -211 -178 -33 -64 -38 -185 -10 -259 30
-79 88 -141 168 -181 l65 -32 212 -5 c229 -7 242 -10 285 -70 51 -72 47 -161
-12 -228 -54 -62 -63 -63 -402 -63 l-305 0 0 -130 0 -130 305 0 c187 0 324 4
357 11 131 28 248 121 309 244 33 67 34 74 34 185 0 114 -1 118 -37 191 -46
93 -122 168 -215 212 l-68 32 -207 5 c-196 5 -209 6 -229 27 -28 28 -27 68 1
99 l23 24 369 0 368 0 0 103 c-1 106 -6 124 -47 145 -31 17 -691 15 -753 -2z"
                    />
                    <path
                      d="M1230 1971 c5 -11 10 -69 10 -130 l0 -111 295 0 295 0 0 101 c0 55
-4 109 -10 119 -18 34 -65 40 -337 40 -258 0 -263 0 -253 -19z"
                    />
                    <path
                      d="M2320 1582 c0 -339 -3 -417 -15 -460 -39 -129 -175 -200 -309 -160
-56 17 -141 100 -155 153 -7 24 -11 143 -11 298 l0 257 -130 0 -130 0 0 -258
c0 -142 5 -285 11 -318 39 -217 230 -384 458 -400 229 -17 444 128 511 343 19
61 20 93 20 509 l0 444 -125 0 -125 0 0 -408z"
                    />
                    <path d="M1240 1185 l0 -485 130 0 130 0 0 485 0 485 -130 0 -130 0 0 -485z" />
                  </g>
                </Icon>
              }
              onClick={onToggleModal}
              colorScheme="primary"
              aria-label="Cargar horarios del SIU"
            />
          </Tooltip>
        ) : (
          <Tooltip label="Agregar Materias" hasArrow placement="left">
            <IconButton
              borderColor="drawerbg"
              borderWidth={2}
              icon={<AddIcon fontWeight="bold" color="drawerbg" />}
              onClick={onToggleDrawer}
              colorScheme="primary"
              aria-label="Agregar Materias"
            />
          </Tooltip>
        )}
      </Box>
    </Box>
  );
};

export default Body;

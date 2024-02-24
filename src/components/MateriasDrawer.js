import { CalendarIcon, LinkIcon, MoonIcon, SunIcon } from "@chakra-ui/icons";
import {
  Alert,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerOverlay,
  Flex,
  Icon,
  IconButton,
  LightMode,
  Link,
  Tooltip,
  useClipboard,
  useColorMode,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import React from "react";
import { DataContext } from "../DataContext";
import jsonData from "../data/horarios";
import { ValidMateria, getCarrera, getMateria } from "../utils";
import ManualUploadToast from "./ManualUploadToast";
import SelectCarreras from "./SelectCarreras";
import SelectCurso from "./SelectCurso";
import SelectExtra from "./SelectExtra";
import SelectMateria from "./SelectMateria";
import Sugerencias from "./Sugerencias";

const MateriasDrawer = (props) => {
  const { useAgenda, setUseAgenda, isOpen, onClose } = props;
  const {
    tabs,
    selections,
    limpiarTab,
    activeTabId,
    events,
    extraEvents,
    permalink,
  } = React.useContext(DataContext);
  const { toggleColorMode } = useColorMode();
  const toast = useToast();
  const permalinkToast = React.useRef();
  const { onCopy } = useClipboard(permalink);

  const materiasToShow = React.useMemo(() => {
    let codigos = [];
    if (!selections.carreras.length) {
      codigos = jsonData.materias.map((m) => m.codigo);
    } else {
      codigos = selections.carreras.flatMap((c) => {
        return getCarrera(c).materias;
      });
    }
    const codigosUnicos = [...new Set(codigos)].sort();
    return codigosUnicos.filter(ValidMateria).map(getMateria);
  }, [selections.carreras]);

  return (
    <LightMode>
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay bg="blackAlpha.300" />
        <DrawerContent
          bg={useColorModeValue("drawerbgalpha", "drawerbgdarkalpha")}
        >
          <Box pt={6} px={6}>
            <ManualUploadToast onClose={onClose} />
            {/* TODO: mostrar "selectcarreras" solo si no hay horarios del SIU */}
            <SelectCarreras />
            {!!materiasToShow.length && (
              <SelectMateria materiasToShow={materiasToShow} />
            )}
          </Box>

          <DrawerBody
            style={{
              overflowY: "auto",
              scrollbarWidth: "none",
            }}
            my={4}
          >
            {selections.materias.map((m) => (
              <SelectCurso codigo={m} key={m} />
            ))}
            {!!extraEvents.length && <SelectExtra />}
          </DrawerBody>

          <Flex justifyContent="space-around">
            {!!events.length && (
              <Button
                borderColor="primary.300"
                borderWidth={1}
                leftIcon={
                  <Icon boxSize={5} viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M7 4C7 2.89543 7.89543 2 9 2H15C16.1046 2 17 2.89543 17 4V6H18.9897C18.9959 5.99994 19.0021 5.99994 19.0083 6H21C21.5523 6 22 6.44772 22 7C22 7.55228 21.5523 8 21 8H19.9311L19.0638 20.1425C18.989 21.1891 18.1182 22 17.0689 22H6.93112C5.88184 22 5.01096 21.1891 4.9362 20.1425L4.06888 8H3C2.44772 8 2 7.55228 2 7C2 6.44772 2.44772 6 3 6H4.99174C4.99795 5.99994 5.00414 5.99994 5.01032 6H7V4ZM9 6H15V4H9V6ZM6.07398 8L6.93112 20H17.0689L17.926 8H6.07398ZM10 10C10.5523 10 11 10.4477 11 11V17C11 17.5523 10.5523 18 10 18C9.44772 18 9 17.5523 9 17V11C9 10.4477 9.44772 10 10 10ZM14 10C14.5523 10 15 10.4477 15 11V17C15 17.5523 14.5523 18 14 18C13.4477 18 13 17.5523 13 17V11C13 10.4477 13.4477 10 14 10Z"
                    />
                  </Icon>
                }
                colorScheme="primary"
                variant="ghost"
                fontSize="sm"
                onClick={() => {
                  limpiarTab();
                }}
              >
                Limpiar {tabs.find((t) => t.id === activeTabId).title || "Plan"}
              </Button>
            )}
          </Flex>

          <DrawerFooter p={4} flex justifyContent="space-between">
            <Box>
              <Tooltip label="Cambiar vista" placement="top">
                <IconButton
                  mr={1}
                  variant="outline"
                  colorScheme="primary"
                  icon={<CalendarIcon />}
                  onClick={() => setUseAgenda(!useAgenda)}
                />
              </Tooltip>

              <Tooltip label="Copiar Permalink" placement="top">
                <IconButton
                  variant="ghost"
                  colorScheme="primary"
                  size="sm"
                  icon={<LinkIcon />}
                  onClick={() => {
                    onClose();
                    onCopy();
                    toast.close(permalinkToast.current);
                    return (permalinkToast.current = toast({
                      position: "bottom-start",
                      duration: 1500,
                      render: () => (
                        <LightMode>
                          <Alert
                            borderRadius="md"
                            colorScheme="purple"
                            borderWidth={1}
                            borderColor="purple.400"
                            color="gray.800"
                          >
                            <AlertIcon as={LinkIcon} />
                            <AlertTitle>Permalink copiado!</AlertTitle>
                          </Alert>
                        </LightMode>
                      ),
                    }));
                  }}
                />
              </Tooltip>
            </Box>
            <Box textAlign="right">
              <Tooltip
                label={`${useColorModeValue("Dark", "Light")} theme`}
                placement="top"
              >
                <Link color="primary.600" onClick={toggleColorMode}>
                  {useColorModeValue(<MoonIcon />, <SunIcon />)}
                </Link>
              </Tooltip>

              <Tooltip label="FIUBA-Map" placement="top">
                <Link
                  color="primary.600"
                  isExternal
                  href="https://fede.dm/FIUBA-Map/"
                >
                  <Icon boxSize={5} ml={2} viewBox="0 0 448 512">
                    <path
                      fill="currentColor"
                      d="M384 320H256c-17.67 0-32 14.33-32 32v128c0 17.67 14.33 32 32 32h128c17.67 0 32-14.33 32-32V352c0-17.67-14.33-32-32-32zM192 32c0-17.67-14.33-32-32-32H32C14.33 0 0 14.33 0 32v128c0 17.67 14.33 32 32 32h95.72l73.16 128.04C211.98 300.98 232.4 288 256 288h.28L192 175.51V128h224V64H192V32zM608 0H480c-17.67 0-32 14.33-32 32v128c0 17.67 14.33 32 32 32h128c17.67 0 32-14.33 32-32V32c0-17.67-14.33-32-32-32z"
                    />
                  </Icon>
                </Link>
              </Tooltip>

              <Tooltip label="FdelMazo/FIUBA-Plan" placement="top">
                <Link
                  color="primary.600"
                  isExternal
                  href="https://github.com/fdelmazo/FIUBA-Plan"
                >
                  <Icon boxSize={5} ml={2} viewBox="0 0 16 16">
                    <path
                      fill="currentColor"
                      d="M7.999,0.431c-4.285,0-7.76,3.474-7.76,7.761 c0,3.428,2.223,6.337,5.307,7.363c0.388,0.071,0.53-0.168,0.53-0.374c0-0.184-0.007-0.672-0.01-1.32 c-2.159,0.469-2.614-1.04-2.614-1.04c-0.353-0.896-0.862-1.135-0.862-1.135c-0.705-0.481,0.053-0.472,0.053-0.472 c0.779,0.055,1.189,0.8,1.189,0.8c0.692,1.186,1.816,0.843,2.258,0.645c0.071-0.502,0.271-0.843,0.493-1.037 C4.86,11.425,3.049,10.76,3.049,7.786c0-0.847,0.302-1.54,0.799-2.082C3.768,5.507,3.501,4.718,3.924,3.65 c0,0,0.652-0.209,2.134,0.796C6.677,4.273,7.34,4.187,8,4.184c0.659,0.003,1.323,0.089,1.943,0.261 c1.482-1.004,2.132-0.796,2.132-0.796c0.423,1.068,0.157,1.857,0.077,2.054c0.497,0.542,0.798,1.235,0.798,2.082 c0,2.981-1.814,3.637-3.543,3.829c0.279,0.24,0.527,0.713,0.527,1.437c0,1.037-0.01,1.874-0.01,2.129 c0,0.208,0.14,0.449,0.534,0.373c3.081-1.028,5.302-3.935,5.302-7.362C15.76,3.906,12.285,0.431,7.999,0.431z"
                    />
                  </Icon>
                </Link>
              </Tooltip>

              <Tooltip label="Invitame un Cafecito" placement="top">
                <Link
                  color="primary.600"
                  isExternal
                  href="https://cafecito.app/fdelmazo"
                >
                  <Icon boxSize={5} ml={2} viewBox="0 0 512 512">
                    <path
                      fill="currentColor"
                      d="M127.1 146.5c1.3 7.7 8 13.5 16 13.5h16.5c9.8 0 17.6-8.5 16.3-18-3.8-28.2-16.4-54.2-36.6-74.7-14.4-14.7-23.6-33.3-26.4-53.5C111.8 5.9 105 0 96.8 0H80.4C70.6 0 63 8.5 64.1 18c3.9 31.9 18 61.3 40.6 84.4 12 12.2 19.7 27.5 22.4 44.1zm112 0c1.3 7.7 8 13.5 16 13.5h16.5c9.8 0 17.6-8.5 16.3-18-3.8-28.2-16.4-54.2-36.6-74.7-14.4-14.7-23.6-33.3-26.4-53.5C223.8 5.9 217 0 208.8 0h-16.4c-9.8 0-17.5 8.5-16.3 18 3.9 31.9 18 61.3 40.6 84.4 12 12.2 19.7 27.5 22.4 44.1zM400 192H32c-17.7 0-32 14.3-32 32v192c0 53 43 96 96 96h192c53 0 96-43 96-96h16c61.8 0 112-50.2 112-112s-50.2-112-112-112zm0 160h-16v-96h16c26.5 0 48 21.5 48 48s-21.5 48-48 48z"
                    />
                  </Icon>
                </Link>
              </Tooltip>

              <Sugerencias onClose={onClose} />
            </Box>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </LightMode>
  );
};

export default MateriasDrawer;

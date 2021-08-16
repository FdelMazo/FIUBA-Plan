import {
  CalendarIcon,
  ChatIcon,
  CheckIcon,
  ExternalLinkIcon,
  MoonIcon,
  SunIcon,
} from "@chakra-ui/icons";
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Box,
  Button,
  CloseButton,
  DarkMode,
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
  Tag,
  TagLabel,
  TagRightIcon,
  Text,
  Textarea,
  Tooltip,
  useColorMode,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import React from "react";
import { DataContext } from "../Context";
import SelectCarreras from "./SelectCarreras";
import SelectCurso from "./SelectCurso";
import SelectMateria from "./SelectMateria";

const submitBug = (bug) => {
  if (!bug) return;
  const formData = new FormData();
  formData.append(`entry.108884877`, "FIUBA-PLAN");
  formData.append(`entry.817568535`, bug || "");
  fetch(
    `https://docs.google.com/forms/d/1Mr4-4qWqZKaobjG3GI30aPvC5qlMsd6Eib3YGUbLd2k/formResponse`,
    {
      body: formData,
      method: "POST",
    }
  );
};

const MateriasDrawer = (props) => {
  const { useAgenda, setUseAgenda, isOpen, onClose } = props;
  const { materiasToShow, selectedMaterias, limpiarCursos, selectedCursos } =
    React.useContext(DataContext);
  const { toggleColorMode } = useColorMode();
  const toast = useToast();
  const bugToast = React.useRef();
  const [showGracias, setShowGracias] = React.useState(false);
  const [showReminder, setShowReminder] = React.useState(true);

  return (
    <LightMode>
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent bg={useColorModeValue("drawerbg", "drawerbgdark")}>
          <DrawerBody
            style={{
              overflowY: "auto",
              scrollbarWidth: "none",
            }}
          >
            <Box my={8}>
              <SelectCarreras />
              {!!materiasToShow.length && <SelectMateria />}
              {!!selectedCursos.length && (
                <Box textAlign="right" w="100%">
                  <Button
                    p={0}
                    rightIcon={<CloseButton fontSize="xs" />}
                    colorScheme="primary"
                    variant="ghost"
                    fontSize="sm"
                    onClick={() => {
                      limpiarCursos();
                    }}
                  >
                    Resetear Catedras
                  </Button>
                </Box>
              )}
              {selectedMaterias.map((m) => (
                <SelectCurso codigo={m} />
              ))}
            </Box>
          </DrawerBody>
          {showReminder && (
            <Box
              m={2}
              p={2}
              borderColor="primary.300"
              borderWidth={1}
              borderRadius={5}
            >
              <Flex row justifyContent="space-between">
                <Text color="primary.600" fontSize="sm" fontWeight="bold">
                  Un recordatorio que nadie pidió.
                </Text>
                <CloseButton
                  size="sm"
                  color="primary.600"
                  onClick={() => {
                    setShowReminder(false);
                  }}
                />
              </Flex>

              <Text color="primary.600" fontSize="xs" fontWeight="bold">
                Todos los cuatrimestres se sobrecarga el SIU y se cae,
                retrasando todo el proceso de inscripcion. Esto es en gran parte
                por culpa de que la gente entra a fijarse cuantos cupos quedan
                de cada materia antes de poder inscribirse.
              </Text>
              <Text color="primary.600" fontSize="xs" fontWeight="bold">
                El sitio{" "}
                <Link
                  isExternal
                  _hover={{
                    color: "white",
                  }}
                  href="https://ofertahoraria.fi.uba.ar/"
                >
                  https://ofertahoraria.fi.uba.ar/
                  <ExternalLinkIcon color="white" mx={1} />
                </Link>
                (oficial de FIUBA) tiene <Text as="em"> exactamente </Text> la
                misma información que el SIU, incluyendo los cupos. Si queres
                chusmear si podes anotarte, anda a ofertahoraria, no al SIU!
              </Text>
              <Text color="primary.600" fontSize="xs" fontWeight="bold">
                Gracias!
              </Text>
            </Box>
          )}
          <DrawerFooter flex row justifyContent="space-between" p={4}>
            <Tooltip label="Cambiar vista" placement="top">
              <IconButton
                variant="outline"
                colorScheme="primary"
                icon={<CalendarIcon />}
                onClick={() => setUseAgenda(!useAgenda)}
              />
            </Tooltip>

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
                  Link
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

              <Tooltip label="Invitame un Cafecíto" placement="top">
                <Link
                  Link
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

              <Box>
                <Tag
                  mt={2}
                  variant="subtle"
                  cursor="pointer"
                  bg="primary.400"
                  onClick={() => {
                    onClose();
                    toast.close(bugToast.current);
                    return (bugToast.current = toast({
                      render: (props) => (
                        <Alert
                          borderRadius={6}
                          p={8}
                          mb="4em"
                          borderColor="primary.300"
                          borderWidth={2}
                          bg="drawerbg"
                          color="white"
                        >
                          <Box flex="1">
                            <AlertTitle>Hola!</AlertTitle>
                            <AlertDescription px={5} display="block">
                              <Text>
                                Este es el primo feo del
                                <Link
                                  isExternal
                                  _hover={{
                                    color: "primary.500",
                                  }}
                                  href="https://fede.dm/FIUBA-Map/"
                                >
                                  {" "}
                                  FIUBA-Map{" "}
                                  <ExternalLinkIcon
                                    color="primary.500"
                                    mx="2px"
                                  />
                                </Link>
                                , y la verdad es que nunca me gusta como queda.
                              </Text>
                              <Text>
                                Si encontras algo incorrecto o que no funciona,
                                me avisas?
                              </Text>
                              <Text>
                                Todos los horarios salen del sistema de FIUBA,
                                así que los comentarios de 'ese profesor empieza
                                una hora antes' o 'esa materia ya no la dan' los
                                voy a ignorar.
                              </Text>
                              <Text>
                                Si querés que te responda, escribí tu
                                mail/telegram/algo.
                              </Text>
                              <form
                                onSubmit={(t) => {
                                  t.preventDefault();
                                  submitBug(t.target.elements["bug"].value);
                                  setShowGracias(true);
                                  toast.close(bugToast.current);
                                }}
                              >
                                <Flex mt={3} alignItems="flex-end">
                                  <Textarea
                                    resize="none"
                                    borderColor="white"
                                    color="white"
                                    size="sm"
                                    name="bug"
                                  />
                                  <DarkMode>
                                    <IconButton
                                      ml={3}
                                      colorScheme="purple"
                                      size="sm"
                                      type="submit"
                                      icon={<ChatIcon />}
                                    />
                                  </DarkMode>
                                </Flex>
                              </form>
                              <Text fontSize="sm" mt={2}>
                                ¿Usás Github? me ayudás mucho más levantando un
                                issue{" "}
                                <Link
                                  isExternal
                                  _hover={{
                                    color: "primary.500",
                                  }}
                                  href="https://github.com/FdelMazo/FIUBA-Plan/issues/new"
                                >
                                  directamente{" "}
                                  <ExternalLinkIcon
                                    color="primary.500"
                                    mx="2px"
                                  />
                                </Link>
                              </Text>
                            </AlertDescription>
                          </Box>
                          <CloseButton
                            color="primary.500"
                            onClick={() => toast.close(props.id)}
                            position="absolute"
                            right="8px"
                            top="8px"
                          />
                        </Alert>
                      ),
                      status: "info",
                      position: "bottom",
                      duration: null,
                      isClosable: true,
                    }));
                  }}
                >
                  <TagLabel lineHeight={2}>
                    {showGracias ? "Gracias!" : "Sugerencias"}
                  </TagLabel>

                  <TagRightIcon as={showGracias ? CheckIcon : ChatIcon} />
                </Tag>
              </Box>
            </Box>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </LightMode>
  );
};

export default MateriasDrawer;

import { StarIcon } from "@chakra-ui/icons";
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Box,
  Button,
  Center,
  CloseButton,
  Code,
  Kbd,
  Link,
  Text,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import React from "react";
import { DataContext } from "../DataContext";

// Boton para activar la carga manual de horarios
const ManualUploadToast = ({ onClose }) => {
  const { applyHorariosSIU, horariosSIU } = React.useContext(DataContext);

  const manualUploadToast = React.useRef();
  const toast = useToast();

  return (
    <Box mb={4}>
      <Button
        rightIcon={!horariosSIU && <StarIcon />}
        w="100%"
        colorScheme="primary"
        variant="solid"
        onClick={() => {
          onClose();
          if (toast.isActive(manualUploadToast.current)) {
            toast.close(manualUploadToast.current);
            return;
          }

          return (manualUploadToast.current = toast({
            status: "info",
            position: "bottom",
            duration: null,
            isClosable: true,
            render: (props) => (
              <Center height="100vh">
                <Alert
                  borderRadius={6}
                  p={8}
                  mb="4em"
                  borderWidth={2}
                  _light={{
                    bg: "gray.50",
                    borderColor: "primary.500",
                    color: "black",
                  }}
                  _dark={{
                    bg: "drawerbg",
                    borderColor: "primary.400",
                    color: "white",
                  }}
                >
                  <Box flex="1">
                    <AlertTitle mb={2}>Importar horarios del SIU</AlertTitle>
                    <AlertDescription px={5} display="block">
                      <Text>
                        Si los horarios del FIUBA-Plan no están actualizados,
                        podés directamente usar los horarios que ves en el SIU.
                      </Text>
                      <Text my={2}>
                        Andá a{" "}
                        <Link
                          isExternal
                          href="https://guaraniautogestion.fi.uba.ar/g3w/oferta_comisiones"
                        >
                          <Code
                            _hover={{
                              bg: "primary.600",
                            }}
                          >
                            Reportes &gt; Oferta de comisiones
                          </Code>
                        </Link>
                        , ahí seleccioná todo el contenido (<Kbd>CTRL</Kbd> +{" "}
                        <Kbd>A</Kbd>
                        ), y ponelo en el siguiente cuadro de texto (
                        <Kbd>CTRL</Kbd> + <Kbd>C</Kbd> / <Kbd>CTRL</Kbd> +{" "}
                        <Kbd>V</Kbd>).
                      </Text>
                      <form
                        onSubmit={async (t) => {
                          t.preventDefault();
                          await applyHorariosSIU();
                          toast.close(manualUploadToast.current);
                        }}
                      >
                        <Textarea
                          my={1}
                          resize="none"
                          _light={{
                            focusBorderColor: "red",
                            borderColor: "primary.500",
                            color: "black",
                          }}
                          _dark={{
                            focusBorderColor: "red",
                            borderColor: "primary.400",
                            color: "white",
                          }}
                          size="sm"
                          name="bug"
                        />
                        <Button w="100%" colorScheme="primary" type="submit">
                          Aplicar horarios
                        </Button>
                      </form>
                      {/* TODO: Solo prender boton si el textarea tiene contenido */}
                      {/* TODO: MOSTRAR ERROR SI FALLO ALGO, PRENDER UN TOAST SI ANDUVO TODO BIEN */}
                      <Text fontSize="sm" mt={2}>
                        (Este feature es nuevo y experimental, si no funciona
                        como esperás hacemelo saber!)
                      </Text>
                    </AlertDescription>
                  </Box>
                  <CloseButton
                    _light={{
                      color: "primary.500",
                    }}
                    _dark={{
                      color: "primary.400",
                    }}
                    onClick={() => toast.close(props.id)}
                    position="absolute"
                    right="8px"
                    top="8px"
                  />
                </Alert>
              </Center>
            ),
          }));
        }}
      >
        {horariosSIU ? "Dejar de usar" : "Usar"} horarios del SIU
      </Button>
    </Box>
  );
};

export default ManualUploadToast;

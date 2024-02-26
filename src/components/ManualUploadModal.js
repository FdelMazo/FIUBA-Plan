import { DeleteIcon, StarIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Code,
  Kbd,
  Link,
  ListItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  OrderedList,
  Text,
  Textarea,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import { DataContext } from "../DataContext";

const ManualUploadModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [error, setError] = React.useState("");
  const [siuData, setSiuData] = React.useState("");
  const { applyHorariosSIU, horariosSIU, removeHorariosSIU } =
    React.useContext(DataContext);
  const textareaRef = React.useRef(null);
  const submitRef = React.useRef(null);

  // Enviar formulario al presionar enter adentro del textarea
  useEffect(() => {
    const handleEnter = (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        submitRef.current.click();
      }
    };
    textareaRef.current?.addEventListener("keydown", handleEnter);

    return () =>
      textareaRef.current?.removeEventListener("keydown", handleEnter);
  }, [textareaRef.current]);

  return (
    <Box>
      <Button
        rightIcon={horariosSIU ? <DeleteIcon /> : <StarIcon />}
        w="100%"
        colorScheme={horariosSIU ? "red" : "primary"}
        variant="solid"
        onClick={horariosSIU ? removeHorariosSIU : onOpen}
      >
        {horariosSIU ? "Dejar de usar" : "Usar"} horarios del SIU
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent borderWidth="2px" borderColor="primary.500" color="black">
          <ModalHeader>Importar horarios del SIU</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {/* Habria que agregar un texto explicando bien las cosas */}
            <Text mb={4}>
              Esta aplicación funciona utilizando las ofertas de comisiones de las materias de la carrera a la que está inscripto el usuario.
              <br/>Esa información está disponible en el SIU Guaraní del usuario.
              <br/>Para conseguir esa información seguí los siguientes pasos:
            </Text>
            <OrderedList my={2}>
              <ListItem>
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
              </ListItem>
              <ListItem>
                Ahí seleccioná todo el contenido de la página (<Kbd>CTRL</Kbd> +{" "}
                <Kbd>A</Kbd>)
              </ListItem>
              <ListItem>
                Copia todo (<Kbd>CTRL</Kbd> + <Kbd>C</Kbd>)
              </ListItem>
              <ListItem>
                Pegalo en el siguiente cuadro de texto (<Kbd>CTRL</Kbd> +{" "}
                <Kbd>V</Kbd>).
              </ListItem>
            </OrderedList>
            <form
              onSubmit={async (t) => {
                t.preventDefault();
                try {
                  await applyHorariosSIU(siuData);
                  onClose();
                  toast({
                    title: "Horarios del SIU aplicados",
                    status: "success",
                    duration: 2000,
                    isClosable: true,
                  });
                } catch (e) {
                  setError(e.message);
                }
              }}
            >
              <Textarea
                ref={textareaRef}
                my={1}
                // resize="none"
                size="sm"
                name="siu"
                onChange={(e) => setSiuData(e.target.value)}
                value={siuData}
              />
              <Button
                ref={submitRef}
                w="100%"
                colorScheme="primary"
                type="submit"
                isDisabled={!siuData}
              >
                Aplicar horarios
              </Button>
              {error && (
                <Text size="sm" color="tomato">
                  {error}
                </Text>
              )}
            </form>
            <Text fontSize="sm" mt={2}>
              (Este feature es nuevo y experimental, si no funciona como esperás
              hacemelo saber!)
            </Text>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default ManualUploadModal;

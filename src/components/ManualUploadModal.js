import { StarIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Code,
  Kbd,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  Textarea,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React from "react";
import { DataContext } from "../DataContext";

const ManualUploadModal = () => {
  const { applyHorariosSIU, horariosSIU, removeHorariosSIU } =
    React.useContext(DataContext);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [error, setError] = React.useState("");
  const [siuData, setSiuData] = React.useState("");

  return (
    <Box mb={4}>
      <Button
        rightIcon={!horariosSIU && <StarIcon />}
        w="100%"
        colorScheme="primary"
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
            <Text>
              Si los horarios del FIUBA-Plan no están actualizados, podés
              directamente usar los horarios que ves en el SIU.
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
              , ahí seleccioná todo el contenido de la página (<Kbd>CTRL</Kbd> +{" "}
              <Kbd>A</Kbd>) , copialo (<Kbd>CTRL</Kbd> + <Kbd>C</Kbd>) , y
              pegalo en el siguiente cuadro de texto (<Kbd>CTRL</Kbd> +{" "}
              <Kbd>V</Kbd>).
            </Text>
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
                my={1}
                // resize="none"
                size="sm"
                name="siu"
                onChange={(e) => setSiuData(e.target.value)}
                value={siuData}
              />
              <Button
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

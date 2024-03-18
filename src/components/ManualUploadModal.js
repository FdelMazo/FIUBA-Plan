import {
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
  Select,
  Text,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import React from "react";
import { DataContext } from "../DataContext";

const ManualUploadModal = ({ isOpen, onClose }) => {
  const toast = useToast();
  const [error, setError] = React.useState("");
  const [siuData, setSiuData] = React.useState("");
  const [periodosOptions, setPeriodosOptions] = React.useState([]);
  const [selectedPeriod, setSelectedPeriod] = React.useState(null);
  const { applyHorariosSIU, getPeriodosSIU } = React.useContext(DataContext);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      onCloseComplete={() => {
        setError("");
        setSiuData("");
        setPeriodosOptions([]);
        setSelectedPeriod(null);
      }}
    >
      <ModalOverlay />
      <ModalContent borderWidth="2px" borderColor="primary.500">
        <ModalHeader>Importar horarios del SIU</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text mb={3}>
            Esta aplicación funciona utilizando la oferta horaria del SIU
            Guaraní de cada usuario.
            <br />
            Para importarla seguí los siguientes pasos:
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
          <Textarea
            my={1}
            size="sm"
            name="siu"
            onChange={(e) => setSiuData(e.target.value)}
            value={siuData}
          />
          {periodosOptions.length > 0 && (
            <Select
              borderColor="tomato"
              borderWidth={2}
              placeholder="Elegir período lectivo"
              my={2}
              onChange={(e) => setSelectedPeriod(e.target.value)}
            >
              {periodosOptions.map((p) => (
                <option key={p.periodo} value={p.periodo}>
                  {p.periodo} (Materias: {p.materias.length})
                </option>
              ))}
            </Select>
          )}
          {periodosOptions.length > 0 ? (
            <Button
              w="100%"
              colorScheme="primary"
              isDisabled={!selectedPeriod}
              onClick={() => {
                const periodo = periodosOptions.find(
                  (p) => p.periodo === selectedPeriod
                );
                applyHorariosSIU(periodo);
                onClose();
                toast({
                  title: "Horarios del SIU aplicados",
                  status: "success",
                  duration: 2000,
                  isClosable: true,
                });
              }}
            >
              Aplicar horarios
            </Button>
          ) : (
            <Button
              w="100%"
              colorScheme="primary"
              isDisabled={!siuData}
              onClick={() => {
                try {
                  const periodos = getPeriodosSIU(siuData);
                  if (periodos.length > 1) {
                    setPeriodosOptions(periodos);
                  } else {
                    applyHorariosSIU(periodos[0]);
                    onClose();
                    toast({
                      title: "Horarios del SIU aplicados",
                      status: "success",
                      duration: 2000,
                      isClosable: true,
                    });
                  }
                } catch (e) {
                  setError(e.message);
                }
              }}
            >
              Cargar horarios
            </Button>
          )}
          {error && (
            <Text size="sm" color="tomato">
              {error}
            </Text>
          )}
          <Text fontSize="sm" mt={2}>
            (Este feature es nuevo y experimental, si no funciona como esperás
            hacemelo saber!)
          </Text>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ManualUploadModal;

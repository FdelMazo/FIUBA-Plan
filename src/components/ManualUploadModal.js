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
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
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
          <form
            onSubmit={
              periodosOptions.length > 0
                ? (t) => {
                    t.preventDefault();
                    applyHorariosSIU(selectedPeriod);
                    onClose();
                    toast({
                      title: "Horarios del SIU aplicados",
                      status: "success",
                      duration: 2000,
                      isClosable: true,
                    });
                  }
                : (t) => {
                    t.preventDefault();
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
                  }
            }
          >
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
              >
                {periodosOptions.map((p) => (
                  <option
                    key={p.periodo}
                    value={p.periodo}
                    onClick={() => setSelectedPeriod(p)}
                  >
                    {p.periodo} (Materias: {p.materias.length})
                  </option>
                ))}
              </Select>
            )}
            <Button
              w="100%"
              colorScheme="primary"
              type="submit"
              isDisabled={
                periodosOptions.length > 0 ? !selectedPeriod : !siuData
              }
            >
              {periodosOptions.length > 0 ? "Aplicar" : "Cargar"} horarios
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
  );
};

export default ManualUploadModal;

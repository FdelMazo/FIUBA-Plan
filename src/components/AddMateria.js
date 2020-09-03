import React from "react";
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerOverlay,
  DrawerContent,
  useDisclosure,
  IconButton,
  Button,
  Collapse,
  Link,
  Box,
  Tag,
  TagIcon,
  TagLabel,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/core";
import SelectCarreras from "./SelectCarreras";
import SelectMateria from "./SelectMateria";
import { data } from "../data/horarios";

const AddMateria = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [carrerasSeleccionadas, setCarrerasSeleccionadas] = React.useState([]);
  const [materiasSeleccionadas, setMateriasSeleccionadas] = React.useState([]);
  const [materiasVisibles, setMateriasVisibles] = React.useState([]);

  React.useEffect(() => {
    const materiasAMostrarConDups = carrerasSeleccionadas?.reduce(
      (arr, c) => arr.concat(...c.materias),
      []
    );
    const materiasAMostrar = new Set(materiasAMostrarConDups);

    const materias = materiasAMostrar.size
      ? data.materias.filter((m) => materiasAMostrar.has(m.index))
      : data.materias;
    const nombresMaterias = materias.map((m) => m.nombre);
    setMateriasVisibles([...nombresMaterias]);
  }, [carrerasSeleccionadas]);

  return (
    <>
      {!isOpen && (
        <IconButton
          m={5}
          onClick={onOpen}
          variantColor="primary"
          aria-label="Agregar Materia"
          icon="add"
        />
      )}

      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerBody>
            <Box>{carrerasSeleccionadas[0]?.nombre}</Box>

            <SelectCarreras
              carreras={data.carreras}
              carrerasSeleccionadas={carrerasSeleccionadas}
              setCarrerasSeleccionadas={setCarrerasSeleccionadas}
            />

            {/* {materiasSeleccionadas.map((m) => {
              return (
                <SelectMateria
                  materiasSeleccionadas={materiasSeleccionadas}
                  setMateriasSeleccionadas={setMateriasSeleccionadas}
                  materia={m}
                />
              );
            })} */}

            <SelectMateria
              materiasVisibles={materiasVisibles}
              materiasSeleccionadas={materiasSeleccionadas}
              setMateriasSeleccionadas={setMateriasSeleccionadas}
            />
          </DrawerBody>
          <DrawerFooter>
            <Link
              isExternal
              color="primary.500"
              href="https://github.com/fdelmazo/FIUBA-Plan"
            >
              <Icon color="primary" name="github" />
            </Link>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default AddMateria;

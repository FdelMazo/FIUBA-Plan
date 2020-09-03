import React from "react";
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerOverlay,
  DrawerContent,
  useDisclosure,
  IconButton,
  Link,
  Icon,
} from "@chakra-ui/core";
import SelectCarreras from "./SelectCarreras";
import SelectMateria from "./SelectMateria";
import { data } from "../data/horarios";

const AddMateria = (props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [carrerasSeleccionadas, setCarrerasSeleccionadas] = React.useState([]);
  const [cursosSeleccionados, setCursosSeleccionados] = React.useState([]);
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
    setMateriasVisibles([...materias]);
  }, [carrerasSeleccionadas]);

  React.useEffect(() => {
    const events = cursosSeleccionados.map((c) => {
      return {
        // start: new Date(2018, 0, c.clases[0].dia, c.clases[0].inicio),
        // end: new Date(2018, 0, c.clases[0].dia, c.clases[0].fin),
        // title: c.docentes,
      };
    });

    props.setEvents(events);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cursosSeleccionados]);

  const seleccionarCurso = (curso) => {
    if (cursosSeleccionados.includes(curso)) {
      const cursoWithoutMateria = cursosSeleccionados.filter(
        (el) => el.docentes !== curso.docentes
      );
      setCursosSeleccionados([...cursoWithoutMateria]);
    } else {
      setCursosSeleccionados([...cursosSeleccionados, curso]);
    }
  };

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
            <SelectCarreras
              carreras={data.carreras}
              carrerasSeleccionadas={carrerasSeleccionadas}
              setCarrerasSeleccionadas={setCarrerasSeleccionadas}
            />

            {new Array(cursosSeleccionados.length + 1).fill().map(() => {
              return (
                <SelectMateria
                  materiasVisibles={materiasVisibles}
                  seleccionarCurso={seleccionarCurso}
                />
              );
            })}
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

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
    setMateriasVisibles([...materias]);
  }, [carrerasSeleccionadas]);

  React.useEffect(() => {
    const events = materiasSeleccionadas.map((m) => {
      return {
        start: new Date(
          2018,
          0,
          m.cursos[0].clases[0].dia,
          m.cursos[0].clases[0].inicio
        ),
        end: new Date(
          2018,
          0,
          m.cursos[0].clases[0].dia,
          m.cursos[0].clases[0].fin
        ),
        title: m.cursos[0].docentes,
      };
    });

    props.setEvents(events);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [materiasSeleccionadas]);

  const seleccionarMateria = (materia) => {
    if (materiasSeleccionadas.includes(materia)) {
      const materiasSeleccionadasWithoutMateria = materiasSeleccionadas.filter(
        (el) => el.nombre !== materia.nombre
      );
      setMateriasSeleccionadas([...materiasSeleccionadasWithoutMateria]);
    } else {
      setMateriasSeleccionadas([...materiasSeleccionadas, materia]);
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

            {materiasSeleccionadas.map((m) => {
              return (
                <SelectMateria
                  materiasVisibles={materiasVisibles}
                  materiasSeleccionadas={materiasSeleccionadas}
                  seleccionarMateria={seleccionarMateria}
                  materia={m}
                />
              );
            })}

            <SelectMateria
              materiasVisibles={materiasVisibles}
              materiasSeleccionadas={materiasSeleccionadas}
              seleccionarMateria={seleccionarMateria}
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

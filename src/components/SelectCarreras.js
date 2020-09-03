import React from "react";
import {
  Menu,
  MenuButton,
  MenuList,
  Button,
  Icon,
  Tag,
  MenuOptionGroup,
  MenuItemOption,
} from "@chakra-ui/core";

const SelectCarreras = (props) => {
  const { carreras, carrerasSeleccionadas, setCarrerasSeleccionadas } = props;

  const seleccionarCarrera = (carrera) => {
    if (carrerasSeleccionadas.includes(carrera)) {
      const carrerasSeleccionadasWithoutCarrera = carrerasSeleccionadas.filter(
        (el) => el.nombre !== carrera.nombre
      );
      setCarrerasSeleccionadas([...carrerasSeleccionadasWithoutCarrera]);
    } else {
      setCarrerasSeleccionadas([...carrerasSeleccionadas, carrera]);
    }
  };

  return (
    <Menu closeOnSelect={false}>
      <MenuButton as={Button} variantColor="primary" variant="outline">
        Carreras <Icon name="chevron-down" />
      </MenuButton>
      <MenuList>
        <MenuOptionGroup defaultValue={carrerasSeleccionadas} type="checkbox">
          {carreras.map((e) => {
            return (
              <MenuItemOption
                type="checkbox"
                as={Tag}
                value={e}
                onClick={() => {
                  seleccionarCarrera(e);
                }}
              >
                {e.nombre}
              </MenuItemOption>
            );
          })}
        </MenuOptionGroup>
      </MenuList>
    </Menu>
  );
};

export default SelectCarreras;

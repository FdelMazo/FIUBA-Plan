import React from "react";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  Box,
  MenuGroup,
  Input,
  Icon,
  Tag,
  MenuOptionGroup,
  MenuItemOption,
} from "@chakra-ui/core";

const SelectMateria = (props) => {
  const {
    materia,
    materiasVisibles,
    materiasSeleccionadas,
    setMateriasSeleccionadas,
  } = props;

  return (
    <Menu closeOnSelect={false}>
      <MenuButton as={Button} variantColor="primary" variant="outline">
        Agregar Materia <Icon name="search" />
      </MenuButton>
      <MenuList>
        <MenuOptionGroup defaultValue={materia?.nombre} type="checkbox">
          {materiasVisibles?.map((m) => {
            return (
              <MenuItemOption type="checkbox" as={Tag} value={m}>
                {m}
              </MenuItemOption>
            );
          })}
        </MenuOptionGroup>
      </MenuList>
    </Menu>
  );
};

export default SelectMateria;

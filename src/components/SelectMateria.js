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

const SelectMateria = (props) => {
  const { materia, materiasVisibles, seleccionarMateria } = props;

  return (
    <Menu closeOnSelect={false}>
      <MenuButton as={Button} variantColor="primary" variant="outline">
        {materia ? materia.nombre : "Agregar Materia"}
        {!materia && <Icon name="search" />}
      </MenuButton>
      <MenuList>
        <MenuOptionGroup defaultValue={materia?.nombre} type="checkbox">
          {materiasVisibles?.map((m) => {
            return (
              <MenuItemOption
                type="checkbox"
                as={Tag}
                value={m.nombre}
                onClick={() => seleccionarMateria(m)}
              >
                {m.nombre}
              </MenuItemOption>
            );
          })}
        </MenuOptionGroup>
      </MenuList>
    </Menu>
  );
};

export default SelectMateria;

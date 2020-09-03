import React from "react";
import {
  Menu,
  MenuButton,
  MenuList,
  Button,
  Icon,
  MenuItem,
} from "@chakra-ui/core";
import SelectCurso from "./SelectCurso";

const SelectMateria = (props) => {
  const { materiasVisibles } = props;
  const [materia, setMateria] = React.useState();

  return (
    <Menu>
      <MenuButton
        m={4}
        as={Button}
        variantColor="primary"
        variant="outline"
        rightIcon={!materia && "search"}
      >
        {materia?.nombre || "Buscar Materia..."}
      </MenuButton>
      <MenuList>
        {materia && (
          <MenuItem onClick={() => setMateria()}>
            <Icon name="check" />
            {materia.nombre}
          </MenuItem>
        )}
        {materiasVisibles
          .filter((m) => m !== materia)
          ?.map((m) => {
            return (
              <MenuItem
                onClick={() => {
                  setMateria(m);
                }}
              >
                {m.nombre}
              </MenuItem>
            );
          })}
        {materia && <SelectCurso materia={materia} />}
      </MenuList>
    </Menu>
  );
};

export default SelectMateria;

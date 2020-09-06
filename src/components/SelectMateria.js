import React from "react";
import {
  Menu,
  MenuButton,
  MenuList,
  Button,
  Box,
  Tag,
  Icon,
  MenuItem,
} from "@chakra-ui/core";
import SelectCurso from "./SelectCurso";

const SelectMateria = (props) => {
  const { materiasVisibles, cursosSeleccionados, seleccionarCurso } = props;
  const [materia, setMateria] = React.useState();

  return (
    <Box>
      <Menu>
        <MenuButton
          mt={2}
          as={Button}
          variantColor="primary"
          variant="outline"
          rightIcon={!materia && "search"}
          fontFamily="general"
        >
          {materia?.codigo || "Buscar Materia "}
        </MenuButton>
        <MenuList>
          {materia && (
            <MenuItem
              fontFamily="general"
              onClick={() => {
                setMateria();
              }}
            >
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
                  as={Tag}
                  fontFamily="general"
                >
                  {m.nombre}
                </MenuItem>
              );
            })}
        </MenuList>
      </Menu>
      {materia && (
        <SelectCurso
          materia={materia}
          cursosSeleccionados={cursosSeleccionados}
          seleccionarCurso={seleccionarCurso}
        />
      )}
    </Box>
  );
};

export default SelectMateria;

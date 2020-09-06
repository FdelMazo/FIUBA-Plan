import React from "react";
import {
  Menu,
  MenuButton,
  Button,
  MenuList,
  Tag,
  MenuItem,
  MenuOptionGroup,
  Icon,
} from "@chakra-ui/core";

const SelectCurso = (props) => {
  const { materia, seleccionarCurso, cursosSeleccionados } = props;

  React.useEffect(() => {
    const primerCurso = materia.cursos[0];
    if (!cursosSeleccionados.includes(primerCurso))
      seleccionarCurso(primerCurso);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Menu>
      <MenuButton
        mt={2}
        ml={2}
        as={Button}
        variantColor="primary"
        variant="outline"
        fontFamily="general"
      >
        Cursos
      </MenuButton>
      <MenuList>
        <MenuOptionGroup>
          {materia.cursos?.map((c) => {
            return (
              <MenuItem
                fontFamily="general"
                value={c}
                as={Tag}
                onClick={() => {
                  seleccionarCurso(c);
                }}
              >
                {cursosSeleccionados.includes(c) && <Icon name="check" />}
                {c?.docentes}
              </MenuItem>
            );
          })}
        </MenuOptionGroup>
      </MenuList>
    </Menu>
  );
};

export default SelectCurso;

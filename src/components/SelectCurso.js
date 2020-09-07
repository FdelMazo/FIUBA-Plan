import React from "react";
import {
  Button,
  List,
  ListItem,
  ListIcon,
  Box,
  IconButton,
} from "@chakra-ui/core";
import { useSelect } from "downshift";

const SelectCurso = (props) => {
  const {
    cursosSeleccionados,
    seleccionarCurso,
    materia,
    setMateria,
    removerMateriaDeCalendario,
  } = props;

  const removerMateria = () => {
    removerMateriaDeCalendario(materia);
    setMateria(null);
  };

  React.useEffect(() => {
    seleccionarCurso(materia.cursos[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { isOpen, getToggleButtonProps, getMenuProps } = useSelect({
    items: materia.cursos,
    selectedItem: null,
  });

  return (
    <Box>
      <Button
        mt={2}
        fontFamily="general"
        {...getToggleButtonProps()}
        backgroundColor="background"
        variantColor="primary"
        variant="outline"
        borderColor="primary"
        color="primary.500"
      >
        {materia.codigo}
      </Button>
      <IconButton
        mt={2}
        ml={2}
        backgroundColor="background"
        variantColor="primary"
        variant="outline"
        borderColor="primary"
        color="primary.500"
        icon="minus"
        onClick={() => {
          removerMateria();
        }}
      />
      {isOpen && (
        <List
          fontFamily="general"
          {...getMenuProps()}
          p={1}
          mb={0}
          border="1px"
          borderRadius="md"
          borderColor="primary.500"
          style={{
            maxHeight: "10em",
            overflowY: "scroll",
          }}
        >
          {materia.cursos.map((item, index) => (
            <Box cursor="pointer" onClick={() => seleccionarCurso(item)}>
              <ListItem
                borderRadius="md"
                fontSize="smaller"
                _hover={{ bg: "gray.500" }}
                color="primary.500"
              >
                {item.docentes}
                {cursosSeleccionados.includes(item) && item?.color && (
                  <ListIcon color={item?.color} ml={2} icon="view" />
                )}
              </ListItem>
            </Box>
          ))}
        </List>
      )}
    </Box>
  );
};

export default SelectCurso;

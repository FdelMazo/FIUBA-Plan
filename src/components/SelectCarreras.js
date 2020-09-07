import React from "react";
import { Button, List, ListItem, ListIcon, Box } from "@chakra-ui/core";
import { useSelect } from "downshift";

const SelectCarreras = (props) => {
  const { carreras, carrerasSeleccionadas, setCarrerasSeleccionadas } = props;
  const { isOpen, getToggleButtonProps, getMenuProps } = useSelect({
    items: carrerasSeleccionadas,
    selectedItem: null,
  });

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
    <>
      <Button
        {...getToggleButtonProps()}
        rightIcon={isOpen ? "chevron-up" : "chevron-down"}
        mt={8}
        w="100%"
        variantColor="primary"
        variant="outline"
        fontFamily="general"
      >
        Carreras
      </Button>
      {isOpen && (
        <List
          {...getMenuProps()}
          p={1}
          mb={0}
          border="1px"
          borderRadius="md"
          borderColor="primary.500"
        >
          {carreras.map((item, index) => (
            <Box cursor="pointer" onClick={() => seleccionarCarrera(item)}>
              <ListItem
                borderRadius="md"
                _hover={{ bg: "gray.500" }}
                color="primary.500"
              >
                {item.nombre}
                <ListIcon
                  ml={2}
                  value={item.nombre}
                  icon={carrerasSeleccionadas.includes(item) && "check"}
                />
              </ListItem>
            </Box>
          ))}
        </List>
      )}
    </>
  );
};

export default SelectCarreras;

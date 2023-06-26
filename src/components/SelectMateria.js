import { CheckIcon, ChevronRightIcon, SearchIcon } from "@chakra-ui/icons";
import {
  Box,
  Input,
  InputGroup,
  InputRightElement,
  List,
} from "@chakra-ui/react";
import { useCombobox } from "downshift";
import React from "react";
import { DataContext } from "../DataContext";

const SelectMateria = React.forwardRef(({ materiasToShow }, ref) => {
  const { toggleMateria, selections } = React.useContext(DataContext);
  const [search, setSearch] = React.useState("");

  const inputItems = React.useMemo(() => {
    return materiasToShow.filter(
      (item) =>
        item.nombre
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .includes(search) || item.codigo.includes(search)
    );
  }, [materiasToShow, search]);

  const {
    isOpen,
    getToggleButtonProps,
    getMenuProps,
    getInputProps,
    getComboboxProps,
  } = useCombobox({
    items: inputItems,
    onInputValueChange: ({ inputValue }) => {
      setSearch(inputValue.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""))
    },
  });

  return (
    <>
      <InputGroup w="100%" fontFamily="general" mt={4} mb={2}>
        <Input
          {...getToggleButtonProps()}
          {...getInputProps({}, { suppressRefError: true })}
          {...getComboboxProps({}, { suppressRefError: true })}
          ref={ref}
          colorScheme="primary"
          variant="outline"
          borderColor="primary"
          color="primary.500"
          fontFamily="body"
          placeholder="Buscar Materia..."
          _placeholder={{ color: 'gray.200' }}
        />
        <InputRightElement children={<SearchIcon color="primary.500" />} />
      </InputGroup>

      <List
        {...getMenuProps()}
        display={isOpen ? "block" : "none"}
        p={1}
        mt={4}
        mb={2}
        borderWidth={1}
        borderRadius={5}
        borderColor="primary.500"
        style={{
          maxHeight: "20em",
          overflowY: "scroll",
        }}
      >
        {inputItems.length ? (
          inputItems
            .sort((a, b) => a.codigo > b.codigo)
            .map((materia) => (
              <Box
                borderRadius={5}
                _hover={{ bg: "hovercolor" }}
                color={selections.materias.includes(materia.codigo) ? "primary.500" : "gray.200"}
                fontSize="sm"
                cursor="pointer"
                onClick={() => toggleMateria(materia.codigo)}
                key={materia.codigo}
              >
                <li>
                  {selections.materias.includes(materia.codigo) ? (
                    <CheckIcon mr={2} />
                  ) : (
                    <ChevronRightIcon mr={2} />
                  )}
                  ({materia.codigo}) {materia.nombre}
                </li>
              </Box>
            ))
        ) : (
          <Box borderRadius={5} color="primary.500" fontSize="sm">
            <li>No se encontraron materias.</li>
          </Box>
        )}
      </List>
    </>
  );
});

export default SelectMateria;

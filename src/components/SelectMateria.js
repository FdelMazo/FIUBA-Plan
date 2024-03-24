import { CheckIcon, ChevronRightIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Menu,
  MenuButton,
  MenuOptionGroup,
  MenuItemOption,
  MenuList,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  List,
  Tooltip,
  Portal,
} from "@chakra-ui/react";
import { useCombobox } from "downshift";
import React from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { DataContext } from "../DataContext";
import { stateReducer } from "../utils";

const SEMANA = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

const SelectMateria = ({ materiasToShow, drawerRef }) => {
  const { getters, toggleMateria, selectedMaterias } =
    React.useContext(DataContext);
  const [search, setSearch] = React.useState("");
  const [selectedDays, setSelectedDays] = React.useState([1, 2, 3, 4, 5, 6]);

  const filterDays = React.useCallback(
    (materia) => {
      for (const curso of getters.getCursosMateria(materia.codigo)) {
        for (const clase of curso.clases) {
          if (selectedDays.includes(clase.dia)) {
            return true;
          }
        }
      }

      return false;
    },
    [getters, selectedDays],
  );

  const inputItems = React.useMemo(() => {
    return materiasToShow.filter(filterDays).filter(
      (item) =>
        item.nombre
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .includes(search) || item.codigo.includes(search),
    );
  }, [filterDays, materiasToShow, search]);

  const {
    isOpen,
    getToggleButtonProps,
    getMenuProps,
    getInputProps,
    getItemProps,
    highlightedIndex,
  } = useCombobox({
    items: inputItems,
    itemToString: (item) => search,
    onInputValueChange: ({ inputValue }) => {
      setSearch(
        inputValue
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, ""),
      );
    },
    stateReducer,
  });

  useHotkeys(
    "enter",
    () => {
      if (highlightedIndex === -1) return;
      const materia = inputItems[highlightedIndex];
      toggleMateria(materia.codigo);
    },
    { enableOnFormTags: ["input"] },
  );

  return (
    <>
      <InputGroup w="100%" fontFamily="general" mt={4} mb={2}>
        <Input
          {...getToggleButtonProps()}
          {...getInputProps()}
          colorScheme="primary"
          variant="outline"
          borderColor="primary"
          color="primary.500"
          fontFamily="body"
          placeholder="Buscar Materia..."
          _placeholder={{ color: "gray.200" }}
        />
        <InputRightElement
          children={
            <Menu closeOnSelect={false}>
              <MenuButton
                colorScheme="primary"
                variant="outline"
                border="none"
                as={Button}
                rightIcon={
                  <Tooltip placement="top" label="Filtrar materias por día">
                    <Icon boxSize={5} mr={2} viewBox="0 0 24 24">
                      <svg fill="currentColor">
                        {selectedDays.length < 6 ? (
                          <>
                            <path fill="none" d="M0 0h24m0 24H0" />
                            <path d="M4.25 5.61C6.27 8.2 10 13 10 13v6c0 .55.45 1 1 1h2c.55 0 1-.45 1-1v-6s3.72-4.8 5.74-7.39A.998.998 0 0 0 18.95 4H5.04c-.83 0-1.3.95-.79 1.61z" />
                          </>
                        ) : (
                          <>
                            <path fill="none" d="M0 0h24v24H0V0z" />
                            <path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z" />
                          </>
                        )}
                      </svg>
                    </Icon>
                  </Tooltip>
                }
              />
              <Portal containerRef={drawerRef}>
                <MenuList color="black">
                  <MenuOptionGroup
                    type="checkbox"
                    value={selectedDays}
                    onChange={setSelectedDays}
                  >
                    {SEMANA.map((day, index) => {
                      return (
                        <MenuItemOption key={index + 1} value={index + 1}>
                          {day}
                        </MenuItemOption>
                      );
                    })}
                  </MenuOptionGroup>
                </MenuList>
              </Portal>
            </Menu>
          }
        />
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
            .map((materia, index) => (
              <Box
                borderRadius={5}
                bg={highlightedIndex === index && "hovercolor"}
                color={
                  selectedMaterias.includes(materia.codigo)
                    ? "primary.500"
                    : "gray.200"
                }
                fontSize="sm"
                cursor="pointer"
                onClick={() => toggleMateria(materia.codigo)}
                key={materia.codigo}
              >
                <li
                  {...getItemProps({
                    item: materia,
                    index,
                  })}
                >
                  {selectedMaterias.includes(materia.codigo) ? (
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
};

export default SelectMateria;

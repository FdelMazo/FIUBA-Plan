import React from "react";
import {
  List,
  ListIcon,
  Input,
  Icon,
  InputGroup,
  InputRightElement,
  PseudoBox,
} from "@chakra-ui/core";
import { useCombobox } from "downshift";
import { DataContext } from "../Context";

const SelectMateria = (props) => {
  const { data, agregarMateria } = React.useContext(DataContext);
  const [inputItems, setInputItems] = React.useState([]);
  const [visibleSubjects, setVisibleSubjects] = React.useState([]);

  React.useEffect(() => {
    const materiasVisibles = data.materias.filter((m) => m.show);
    setVisibleSubjects(materiasVisibles);
    setInputItems(materiasVisibles);
  }, [data]);

  const {
    isOpen,
    getToggleButtonProps,
    getMenuProps,
    getInputProps,
    getComboboxProps,
  } = useCombobox({
    items: inputItems,
    onInputValueChange: ({ inputValue }) => {
      let toSearch = inputValue.toLowerCase();
      toSearch = toSearch.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      setInputItems(
        visibleSubjects.filter(
          (item) =>
            item.nombre
              .toLowerCase()
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
              .includes(toSearch) || item.codigo.includes(toSearch)
        )
      );
    },
  });

  return (
    <>
      <InputGroup w="100%" fontFamily="general" mt={4}>
        <Input
          {...getToggleButtonProps()}
          backgroundColor="background"
          variantColor="primary"
          variant="outline"
          borderColor="primary"
          color="primary.500"
          {...getInputProps()}
          {...getComboboxProps()}
          placeholder="Buscar Materia..."
        />
        <InputRightElement
          children={<Icon name="search" color="primary.500" />}
        />
      </InputGroup>
      {isOpen && (
        <List
          textAlign={["left"]}
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
          {inputItems.length ? (
            inputItems
              .sort((a, b) => a.codigo > b.codigo)
              .map((item) => (
                <PseudoBox
                  borderRadius="md"
                  _hover={{ bg: "gray.500" }}
                  color="primary.500"
                  fontSize="small"
                  onClick={() => {
                    !item.visible && agregarMateria(item);
                  }}
                >
                  <li>
                    <ListIcon icon={item.visible ? "check" : "chevron-right"} />
                    ({item.codigo}) {item.nombre}
                  </li>
                </PseudoBox>
              ))
          ) : (
            <PseudoBox
              borderRadius="md"
              _hover={{ bg: "gray.500" }}
              color="primary.500"
              fontSize="small"
            >
              <li>No se encontraron materias.</li>
            </PseudoBox>
          )}
        </List>
      )}
    </>
  );
};

export default SelectMateria;

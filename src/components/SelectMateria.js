import React from "react";
import {
  List,
  Box,
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
    const materias = materiasVisibles.length ? materiasVisibles : data.materias;
    setVisibleSubjects(materias);
    setInputItems(materias);
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
      setInputItems(
        visibleSubjects.filter(
          (item) =>
            item.nombre.toLowerCase().includes(inputValue.toLowerCase()) ||
            item.codigo.includes(inputValue)
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
      {isOpen &&
        (inputItems.length ? (
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
            {inputItems
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
              ))}
          </List>
        ) : (
          <Box p={1} mt={3} mb={0} color="primary.500">
            No hay materias con ese código.
          </Box>
        ))}
    </>
  );
};

export default SelectMateria;

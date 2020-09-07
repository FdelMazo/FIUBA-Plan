import React from "react";
import {
  List,
  Box,
  ListIcon,
  Input,
  Icon,
  InputGroup,
  InputRightElement,
  ListItem,
} from "@chakra-ui/core";
import { useCombobox } from "downshift";
import SelectCurso from "./SelectCurso";

const SelectMateria = (props) => {
  const {
    materiasVisibles,
    cursosSeleccionados,
    seleccionarCurso,
    agregarSelectMateria,
    removerMateriaDeCalendario,
  } = props;
  const [materia, setMateria] = React.useState(null);
  const [inputItems, setInputItems] = React.useState(materiasVisibles);

  React.useEffect(() => {
    if (!materia) {
      setInputItems(materiasVisibles);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [materia]);

  const {
    isOpen,
    getToggleButtonProps,
    getMenuProps,
    getInputProps,
    getComboboxProps,
    getItemProps,
  } = useCombobox({
    items: inputItems,
    onInputValueChange: ({ inputValue }) => {
      setInputItems(
        materiasVisibles.filter(
          (item) =>
            item.nombre.toLowerCase().startsWith(inputValue.toLowerCase()) ||
            item.codigo.startsWith(inputValue)
        )
      );
    },
    onSelectedItemChange: () => {
      agregarSelectMateria();
    },
  });

  return (
    <>
      {materia ? (
        <SelectCurso
          removerMateriaDeCalendario={removerMateriaDeCalendario}
          cursosSeleccionados={cursosSeleccionados}
          seleccionarCurso={seleccionarCurso}
          materia={materia}
          setMateria={setMateria}
        />
      ) : (
        <>
          <InputGroup w="60%" fontFamily="general" mt={4}>
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
              pr={10}
              value={materia?.codigo}
            />
            <InputRightElement
              children={<Icon ml={20} name="search" color="primary.500" />}
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
                {inputItems.map((item, index) => (
                  <Box cursor="pointer" onClick={() => setMateria(item)}>
                    <ListItem
                      {...getItemProps({ item, index })}
                      fontSize="smaller"
                      borderRadius="md"
                      _hover={{ bg: "gray.500" }}
                      color="primary.500"
                    >
                      <ListIcon icon="chevron-right" />({item.codigo}){" "}
                      {item.nombre}
                    </ListItem>
                  </Box>
                ))}
              </List>
            ) : (
              <Box p={1} mt={3} mb={0} color="primary.500">
                No hay materias con ese código.
              </Box>
            ))}
        </>
      )}
    </>
  );
};

export default SelectMateria;

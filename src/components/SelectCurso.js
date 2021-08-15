import {
  ChevronDownIcon,
  ChevronUpIcon,
  MinusIcon,
  ViewIcon,
} from "@chakra-ui/icons";
import { Box, Button, Flex, IconButton, List, Tooltip } from "@chakra-ui/react";
import { useSelect } from "downshift";
import React from "react";
import { DataContext } from "../Context";

const SelectCurso = (props) => {
  const { toggleCurso, selectedCursos, getMateria, toggleMateria, getCursos } =
    React.useContext(DataContext);
  const { codigo } = props;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const items = React.useMemo(() => getCursos(codigo), []);
  const materia = React.useMemo(() => getMateria(codigo), [codigo, getMateria]);

  const { isOpen, getItemProps, getToggleButtonProps, getMenuProps } =
    useSelect({
      stateReducer,
      items,
      selectedItem: null,
    });

  return (
    <>
      <Flex direction="row" justify="flex-end">
        <Box {...getToggleButtonProps()}>
          <Tooltip placement="left" hasArrow label={materia.nombre}>
            <Button
              my={2}
              colorScheme="primary"
              variant="outline"
              borderColor="primary"
              color="primary.500"
              rightIcon={isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
            >
              {materia.codigo}
            </Button>
          </Tooltip>
        </Box>

        <IconButton
          my={2}
          ml={2}
          colorScheme="primary"
          variant="outline"
          borderColor="primary"
          color="primary.500"
          icon={<MinusIcon />}
          onClick={() => {
            toggleMateria(materia.codigo);
          }}
        />
      </Flex>

      {isOpen && (
        <List
          {...getMenuProps()}
          p={1}
          borderWidth={1}
          borderRadius={5}
          borderColor="primary.500"
          style={{
            maxHeight: "10em",
            overflowY: "scroll",
          }}
        >
          {items.map((item, index) => (
            <Box
              borderRadius={5}
              _hover={{ bg: "gray.500" }}
              color={
                selectedCursos.find((i) => i.codigo === item.codigo)
                  ? selectedCursos.find((i) => i.codigo === item.codigo).color
                  : "primary.500"
              }
              fontSize="xs"
              onClick={() => toggleCurso(item, materia)}
            >
              <li
                {...getItemProps({
                  item,
                  index,
                })}
                key={item.codigo}
              >
                {selectedCursos.find((i) => i.codigo === item.codigo) && (
                  <ViewIcon
                    mr={2}
                    color={
                      selectedCursos.find((i) => i.codigo === item.codigo).color
                    }
                  />
                )}
                {item.docentes}
              </li>
            </Box>
          ))}
        </List>
      )}
    </>
  );
};

function stateReducer(state, actionAndChanges) {
  const { changes, type } = actionAndChanges;
  switch (type) {
    case useSelect.stateChangeTypes.MenuKeyDownEnter:
    case useSelect.stateChangeTypes.MenuKeyDownSpaceButton:
    case useSelect.stateChangeTypes.ItemClick:
      return {
        ...changes,
        isOpen: true,
        highlightedIndex: state.highlightedIndex,
      };
    default:
      return changes;
  }
}

export default SelectCurso;

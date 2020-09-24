import React from "react";
import {
  Button,
  List,
  PseudoBox,
  ListIcon,
  Box,
  IconButton,
  Flex,
  Tooltip,
} from "@chakra-ui/core";
import { useSelect } from "downshift";
import { DataContext } from "../Context";
import useWindowSize from "../utils/useWindowSize";

const SelectCurso = (props) => {
  const { data, toggleCurso, removerMateria } = React.useContext(DataContext);
  const { width } = useWindowSize();
  const { materia } = props;
  const items = data.cursos.filter((c) => materia.cursos.includes(c.codigo));
  const {
    isOpen,
    getItemProps,
    getToggleButtonProps,
    getMenuProps,
  } = useSelect({
    stateReducer,
    items,
    selectedItem: null,
  });

  const formatName = (name) => {
    if (name.length <= 10) return name;
    return `${name.substring(0, 10)}...`;
  };

  return (
    <>
      <Flex direction="row" justify="flex-end">
        <Box {...getToggleButtonProps()}>
          <Tooltip
            hasArrow
            label={materia.nombre}
            zIndex={10000}
            fontFamily="general"
            backgroundColor="tooltipBackground"
          >
            <Button
              mt={2}
              fontFamily="general"
              backgroundColor="background"
              variantColor="primary"
              variant="outline"
              borderColor="primary"
              color="primary.500"
              rightIcon={isOpen ? "chevron-up" : "chevron-down"}
              style={{
                width: "13em"
              }}
            >
              {width > 1000 ? formatName(materia.nombre) : materia.codigo}
            </Button>
          </Tooltip>
        </Box>

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
            removerMateria(materia);
          }}
        />
      </Flex>

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
          {items.map((item, index) => (
            <PseudoBox
              borderRadius="md"
              _hover={{ bg: "gray.500" }}
              color="primary.500"
              fontSize="x-small"
              onClick={() => toggleCurso(item, materia)}
            >
              <li
                {...getItemProps({
                  item,
                  index,
                })}
              >
                {item.docentes}
                {item.show && (
                  <ListIcon color={item?.color} ml={2} icon="view" />
                )}
              </li>
            </PseudoBox>
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

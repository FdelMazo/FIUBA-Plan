import {
  Box,
  Button,
  Flex,
  IconButton,
  List,
  ListIcon,
  PseudoBox,
  Tooltip,
} from "@chakra-ui/react";
import { useSelect } from "downshift";
import React from "react";
import { DataContext } from "../Context";

const SelectCurso = (props) => {
  const { data, toggleCurso, removerMateria } = React.useContext(DataContext);
  const { materia } = props;
  const items = data.cursos.filter((c) => materia.cursos.includes(c.codigo));
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
              colorScheme="primary"
              variant="outline"
              borderColor="primary"
              color="primary.500"
              rightIcon={isOpen ? "chevron-up" : "chevron-down"}
            >
              {materia.codigo}
            </Button>
          </Tooltip>
        </Box>

        <IconButton
          mt={2}
          ml={2}
          backgroundColor="background"
          colorScheme="primary"
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

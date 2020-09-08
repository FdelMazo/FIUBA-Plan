import React from "react";
import {
  Button,
  List,
  PseudoBox,
  ListIcon,
  Box,
  IconButton,
  Tooltip,
} from "@chakra-ui/core";
import { useSelect } from "downshift";
import { DataContext } from "../Context";

const SelectCurso = (props) => {
  const { toggleCurso, removerMateria } = React.useContext(DataContext);
  const { materia } = props;

  React.useEffect(() => {
    toggleCurso(materia, materia.cursos[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    isOpen,
    getItemProps,
    getToggleButtonProps,
    getMenuProps,
  } = useSelect({
    stateReducer,
    items: materia.cursos,
    selectedItem: null,
  });

  return (
    <Box>
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
          {...getToggleButtonProps()}
          backgroundColor="background"
          variantColor="primary"
          variant="outline"
          borderColor="primary"
          color="primary.500"
        >
          {materia.codigo}
        </Button>
      </Tooltip>

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
            <PseudoBox
              borderRadius="md"
              _hover={{ bg: "gray.500" }}
              color="primary.500"
              fontSize="smaller"
              onClick={() => toggleCurso(materia, item)}
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
    </Box>
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
        isOpen: true, // keep menu open after selection.
        highlightedIndex: state.highlightedIndex,
      };
    default:
      return changes;
  }
}

export default SelectCurso;

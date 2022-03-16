import { CheckIcon, ChevronDownIcon, ChevronRightIcon, ChevronUpIcon } from "@chakra-ui/icons";
import { Box, Button, List } from "@chakra-ui/react";
import { useSelect } from "downshift";
import React from "react";
import { DataContext } from "../Context";

const SelectCarreras = () => {
  const { carreras, toggleCarrera, selectedCarreras } =
    React.useContext(DataContext);
  const { isOpen, getItemProps, getToggleButtonProps, getMenuProps } =
    useSelect({
      items: carreras,
      stateReducer,
    });

  return (
    <Box mb={4}>
      <Button
        {...getToggleButtonProps()}
        rightIcon={isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
        w="100%"
        colorScheme="primary"
        variant="outline"
      >
        Carreras
      </Button>

      <List
        display={isOpen ? "block" : "none"}
        {...getMenuProps()}
        p={1}
        mt={4}
        borderWidth={1}
        borderRadius={5}
        borderColor="primary.500"
      >
        {carreras
          .sort((a, b) => a.nombre > b.nombre)
          .map((c, index) => (
            <Box
              borderRadius={5}
              _hover={{ bg: "hovercolor" }}
              color={selectedCarreras.includes(c) ? "primary.500" : "gray.200"}
              cursor="pointer"
              onClick={() => toggleCarrera(c)}
              key={c}
            >
              <li
                {...getItemProps({
                  c,
                  index,
                })}
              >
                {selectedCarreras.includes(c) ? (
                  <CheckIcon mr={1} />
                ) : (
                  <ChevronRightIcon mr={1} />
                )}
                {c}
              </li>
            </Box>
          ))}
      </List>
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
        isOpen: true,
        highlightedIndex: state.highlightedIndex,
      };
    default:
      return changes;
  }
}

export default SelectCarreras;

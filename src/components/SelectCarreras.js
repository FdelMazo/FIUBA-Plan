import { Box, Button, List, ListIcon, PseudoBox } from "@chakra-ui/react";
import { useSelect } from "downshift";
import React from "react";
import { DataContext } from "../Context";

const SelectCarreras = (props) => {
  const { data, toggleCarrera } = React.useContext(DataContext);

  const { isOpen, getItemProps, getToggleButtonProps, getMenuProps } =
    useSelect({
      items: data.carreras,
      stateReducer,
    });

  return (
    <Box mb={4}>
      <Button
        {...getToggleButtonProps()}
        rightIcon={isOpen ? "chevron-up" : "chevron-down"}
        mt={8}
        w="100%"
        colorScheme="primary"
        variant="outline"
        fontFamily="general"
      >
        Carreras
      </Button>
      {isOpen && (
        <List
          {...getMenuProps()}
          p={1}
          mb={0}
          border="1px"
          borderRadius="md"
          borderColor="primary.500"
          fontFamily="general"
          textAlign={["left"]}
        >
          {data.carreras
            .sort((a, b) => a.nombre > b.nombre)
            .map((c, index) => (
              <PseudoBox
                borderRadius="md"
                _hover={{ bg: "gray.500" }}
                color="primary.500"
                onClick={() => toggleCarrera(c)}
              >
                <li
                  key={`${c}${index}`}
                  {...getItemProps({
                    c,
                    index,
                  })}
                >
                  {c.nombre}
                  <ListIcon ml={2} icon={c.show && "check"} />
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
        isOpen: true,
        highlightedIndex: state.highlightedIndex,
      };
    default:
      return changes;
  }
}

export default SelectCarreras;

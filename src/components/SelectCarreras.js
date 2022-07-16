import { CheckIcon, ChevronDownIcon, ChevronRightIcon, ChevronUpIcon } from "@chakra-ui/icons";
import { Box, Button, List, Flex, Tooltip, Link, Icon } from "@chakra-ui/react";
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
      <Flex alignItems="center">
        <Button
          {...getToggleButtonProps()}
          rightIcon={isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
          w="100%"
          colorScheme="primary"
          variant="outline"
        >
          Carreras
        </Button>

        <Tooltip closeOnClick hasArrow label="Calendario Académico" placement="bottom-start">
          <Link color="primary.500" href={"https://www.fi.uba.ar/estudiantes/calendario-academico"} isExternal>
            <Icon boxSize={5} mx={2} viewBox="0 0 512 512">
              <path
                fill="currentColor"
                d="M496 128v16a8 8 0 0 1-8 8h-24v12c0 6.627-5.373 12-12 12H60c-6.627 0-12-5.373-12-12v-12H24a8 8 0 0 1-8-8v-16a8 8 0 0 1 4.941-7.392l232-88a7.996 7.996 0 0 1 6.118 0l232 88A8 8 0 0 1 496 128zm-24 304H40c-13.255 0-24 10.745-24 24v16a8 8 0 0 0 8 8h464a8 8 0 0 0 8-8v-16c0-13.255-10.745-24-24-24zM96 192v192H60c-6.627 0-12 5.373-12 12v20h416v-20c0-6.627-5.373-12-12-12h-36V192h-64v192h-64V192h-64v192h-64V192H96z"
              />
            </Icon>
          </Link>
        </Tooltip>
      </Flex>

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

import { ChevronDownIcon, ChevronUpIcon, MinusIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Editable,
  EditableInput,
  EditablePreview,
  Flex,
  IconButton,
  List,
  Tooltip,
  Text,
} from "@chakra-ui/react";
import { useSelect } from "downshift";
import React from "react";
import { DataContext } from "../Context";

const SelectCurso = () => {
  const {
    extraEvents,
    removerHorariosExtra,
    removerHorarioExtra,
    renombrarHorarioExtra,
    activeTabId
  } = React.useContext(DataContext);
  const items = extraEvents.filter(e => e.curso.tabId === activeTabId);
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
            placement="left"
            hasArrow
            label="ACTIVIDADES EXTRACURRICULARES"
          >
            <Button
              my={2}
              px={2}
              colorScheme="primary"
              variant="outline"
              borderColor="primary"
              color="primary.500"
              rightIcon={isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
            >
              <Text fontSize="xs">EXTRA</Text>
            </Button>
          </Tooltip>
        </Box>

        <Tooltip placement="top" label="Remover de todos los planes">
          <IconButton
            my={2}
            ml={2}
            colorScheme="primary"
            variant="outline"
            borderColor="primary"
            color="primary.500"
            icon={<MinusIcon />}
            onClick={() => {
              removerHorariosExtra();
            }}
          />
        </Tooltip>
      </Flex>

      <List
        {...getMenuProps()}
        display={isOpen ? "block" : "none"}
        onKeyDown={undefined}
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
          <Box borderRadius={5} color={item.color} key={item.id}>
            <li
              {...getItemProps({
                item,
                index,
              })}
              onClick={(ev) => {
                ev.stopPropagation();
              }}
            >
              <Editable
                placeholder="EXTRA"
                fontSize="small"
                defaultValue={item.materia}
                onSubmit={(nombre) => {
                  renombrarHorarioExtra(item, nombre);
                }}
                onClick={(ev) => {
                  ev.stopPropagation();
                }}
              >
                <Flex justifyContent="space-between">
                  <EditablePreview />
                  <EditableInput
                    _focus={{
                      boxShadow: "0 0 0 1px rgba(183,148,244, 0.6)",
                    }}
                  />
                  <IconButton
                    size="xs"
                    borderColor={item.color}
                    _hover={{
                      bg: "initial",
                      border: "1px solid",
                    }}
                    variant="ghost"
                    onClick={() => removerHorarioExtra(item)}
                    icon={<MinusIcon />}
                  />
                </Flex>
              </Editable>
            </li>
          </Box>
        ))}
      </List>
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

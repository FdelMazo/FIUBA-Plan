import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  MinusIcon,
  WarningTwoIcon,
} from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  IconButton,
  List,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import { useSelect } from "downshift";
import React from "react";
import { DataContext } from "../Context";

const SelectCurso = (props) => {
  const {
    toggleCurso,
    activeTabId,
    selectedCursos,
    getMateria,
    toggleMateria,
    getColor,
    isBlocked,
    getCursosMateria,
  } = React.useContext(DataContext);
  const { codigo } = props;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const items = React.useMemo(() => getCursosMateria(codigo), []);
  const materia = React.useMemo(() => getMateria(codigo), [codigo, getMateria]);
  const allItemsBlocked = items.every((item) => isBlocked(item.codigo));

  const { isOpen, getItemProps, getToggleButtonProps, getMenuProps } =
    useSelect({
      stateReducer,
      items,
      selectedItem: null,
    });

  return (
    <>
      <Flex direction="row" justify="flex-end" alignItems="center">
        {allItemsBlocked && (
          <Tooltip placement="left" hasArrow label={
            <>
              <Text>Todos los cursos de esta materia</Text>
              <Text>se solapan con el resto del plan</Text>
            </>
          }>
            <WarningTwoIcon
              color="primary.500"
              mr={2}
            />
          </Tooltip>
        )}
        <Box {...getToggleButtonProps()}>
          <Button
            justifyContent={"space-between"}
            my={2}
            colorScheme="primary"
            variant="outline"
            borderColor="primary"
            color="primary.500"
            width="200px"
            rightIcon={isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
          >
            <Text fontSize="xs" isTruncated>{materia.nombre}</Text>
          </Button>
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
              toggleMateria(materia.codigo);
            }}
          />
        </Tooltip>
      </Flex>

        <List
          {...getMenuProps()}
          display={isOpen ? "block" : "none"}
          p={1}
          borderWidth={1}
          borderRadius={5}
          borderColor="primary.500"
          style={{
            maxHeight: "18em",
            overflowY: "scroll",
          }}
        >
          {items.map((item, index) => {
            const isActive = selectedCursos.find(
              (i) => i.codigo === item.codigo && i.tabId === activeTabId
            );
            const color = getColor(
              selectedCursos.find((i) => i.codigo === item.codigo)?.codigo
            );
            const isItemBlocked = isBlocked(item.codigo);
            return (
              <Tooltip
                placement="left"
                hasArrow
                fontSize="xs"
                label={
                  isItemBlocked ? (
                    <>
                      <Text>Este curso se solapa</Text>
                      <Text>con el resto del plan</Text>
                    </>
                  ) : undefined
                }
                key={item.codigo}
              >
                <Box
                  py={1}
                  _hover={{ bg: "hovercolor" }}
                  color={isActive ? color : "gray.200"}
                  cursor="pointer"
                  fontSize="xs"
                  px={2}
                  onClick={() => toggleCurso(item)}
                  _notLast={{
                    borderBottom: "1px dashed violet",
                  }}
                >
                  <li
                    {...getItemProps({
                      item,
                      index,
                    })}
                    key={item.codigo}
                  >
                    {isActive && <CheckIcon mr={1} />}
                    {isItemBlocked && (
                      <WarningTwoIcon
                        mr={1}
                      />
                    )}
                    {item.docentes}
                  </li>
                </Box>
              </Tooltip>
            );
          })}
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

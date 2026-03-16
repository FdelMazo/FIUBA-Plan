import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  MinusIcon,
  WarningTwoIcon,
} from "@chakra-ui/icons";
import {
  Badge,
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
import { useHotkeys } from "react-hotkeys-hook";
import { DataContext } from "../DataContext";
import { cursoToDates, stateReducer } from "../utils";
import ConfigCurso from "./ConfigCurso";

const WEEKDAYS_CHAR = ["D", "L", "M", "X", "J", "V", "S"];

const SelectCurso = ({ codigo }) => {
  const {
    coloresCursos,
    setColorCurso,
    toggleCurso,
    events,
    toggleMateria,
    getters,
    isCursoIgnorado,
  } = React.useContext(DataContext);
  const materia = getters.getMateria(codigo);
  const items = getters.getCursosMateria(codigo);

  const isBlocked = React.useCallback(
    (codigo) => {
      const curso = getters.getCurso(codigo);
      const eventos = events.filter((e) => {
        const anotherCurso = getters.getCurso(e.curso);
        if (!anotherCurso) return false;
        if (anotherCurso.materia === curso.materia) return false;

        const dia = e.start?.getDay?.();
        return !isCursoIgnorado(e.curso, dia, e.start, e.end);
      });
      for (const clase of curso.clases) {
        const { inicio, fin } = cursoToDates(clase);

        if (isCursoIgnorado(codigo, clase.dia, inicio, fin)) {
          continue;
        }

        for (const evento of eventos) {
          if (inicio < evento.end && fin > evento.start) {
            return true;
          }
        }
      }
      return false;
    },
    [events, getters, isCursoIgnorado],
  );

  const allItemsBlocked = items.every((item) => isBlocked(item.codigo));

  const {
    isOpen,
    getItemProps,
    getToggleButtonProps,
    highlightedIndex,
    getMenuProps,
  } = useSelect({
    stateReducer,
    items,
  });

  useHotkeys("space, enter", () => {
    if (highlightedIndex === -1) return;
    const curso = items[highlightedIndex];
    toggleCurso(curso.codigo);
  });

  const cursosActivos = React.useMemo(
    () =>
      items.filter((item) =>
        events.some((event) => event.curso === item.codigo),
      ),
    [items, events],
  );

  return (
    <>
      <Flex direction="row" justify="flex-end" alignItems="center">
        {allItemsBlocked ? (
          <Tooltip
            opacity={allItemsBlocked ? 1 : 0}
            placement="left"
            hasArrow
            label={
              <>
                <Text>Todos los cursos de esta materia</Text>
                <Text>se solapan con otros cursos</Text>
              </>
            }
          >
            <WarningTwoIcon size={14} color="primary.500" mr={2} />
          </Tooltip>
        ) : (
          <div
            style={{
              flexShrink: 0,
              width: "16px",
              height: "16px",
              marginRight: "8px",
            }}
          />
        )}
        <Box {...getToggleButtonProps()} width="100%">
          <Button
            justifyContent={"space-between"}
            my={2}
            px={2}
            colorScheme="primary"
            variant="outline"
            borderColor="primary"
            color="primary.500"
            width="100%"
            _hover={{
              "&>p": { whiteSpace: "normal" },
              bg: "var(--chakra-colors-whiteAlpha-400)",
            }}
            _focus={{ "&>p": { whiteSpace: "normal" } }}
            rightIcon={
              isOpen ? (
                <ChevronUpIcon />
              ) : (
                <>
                  <Text alignSelf="center" fontSize="x-small">
                    ({items.length})
                  </Text>
                  <ChevronDownIcon />
                </>
              )
            }
          >
            <Text fontSize="xs" isTruncated>
              {materia.nombre}
            </Text>
          </Button>
        </Box>

        <Tooltip placement="top" label="Remover materia">
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

        <ConfigCurso
          setColorCurso={setColorCurso}
          cursosActivos={cursosActivos}
        />
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
          const event = events.find((i) => i.curso === item.codigo);
          const isActive = !!event;
          const color = event?.color ?? coloresCursos[item.codigo];
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
                    <Text>con otros cursos</Text>
                  </>
                ) : undefined
              }
              key={item.codigo}
            >
              <Box
                py={1}
                bg={highlightedIndex === index && "hovercolor"}
                color={isActive ? color : "gray.200"}
                cursor="pointer"
                fontSize="xs"
                px={2}
                onClick={() => toggleCurso(item.codigo)}
                _notLast={{
                  borderBottom: "1px dashed violet",
                }}
                key={item.codigo}
                position="relative"
              >
                <li
                  {...getItemProps({
                    item,
                    index,
                  })}
                >
                  {isActive && <CheckIcon mr={1} />}
                  {isItemBlocked && <WarningTwoIcon mr={1} />}
                  {item.docentes}
                  <Badge
                    fontSize="x-small"
                    position="absolute"
                    bottom="2px"
                    right="0"
                  >
                    {[
                      ...new Set(
                        item.clases.map((clase) => WEEKDAYS_CHAR[clase.dia]),
                      ),
                    ].join(" | ")}
                  </Badge>
                </li>
              </Box>
            </Tooltip>
          );
        })}
      </List>
    </>
  );
};

export default SelectCurso;

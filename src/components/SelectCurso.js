import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  MinusIcon,
  WarningTwoIcon,
  SettingsIcon,
} from "@chakra-ui/icons";
import {
  Badge,
  Box,
  Button,
  Flex,
  IconButton,
  List,
  Switch,
  Text,
  Tooltip,
  Popover,
  PopoverTrigger,
  PopoverArrow,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody,
  PopoverContent,
  DarkMode,
} from "@chakra-ui/react";
import { useSelect } from "downshift";
import React from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { DataContext } from "../DataContext";
import { getColor, stateReducer } from "../utils";
import { HexColorPicker } from "react-colorful";

const INICIALES_SEMANA = ["D", "L", "M", "X", "J", "V", "S"];
const COMPLETOS_SEMANA = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
];

const PopoverConfigCurso = ({
  codigo,
  materiaColor,
  setColorMateria,
  cursosActivos,
  esVirtualCursoDia,
  setVirtualidadCursoDia,
}) => (
  <Popover
    placement="auto"
    gutter={8}
    modifiers={[
      {
        name: "preventOverflow",
        options: {
          boundary: "viewport",
          padding: 8,
        },
      },
      {
        name: "flip",
        options: {
          fallbackPlacements: ["top", "bottom"],
        },
      },
    ]}
  >
    <PopoverTrigger>
      <IconButton
        my={2}
        ml={2}
        colorScheme="primary"
        variant="outline"
        borderColor="primary"
        color="primary.500"
        icon={<SettingsIcon />}
      />
    </PopoverTrigger>

    <DarkMode>
      <PopoverContent color="white" maxH="calc(100dvh - 16px)">
        <PopoverArrow />
        <PopoverCloseButton top={3} right={3} />
        <PopoverBody px={4} py={4} overflowY="auto">
          <Box>
            <Text mb={2}>Color para materia</Text>
            <HexColorPicker
              style={{
                width: "100%",
                padding: "4px",
              }}
              color={materiaColor}
              onChange={(c) => setColorMateria(codigo, c)}
            />
          </Box>

          <Box borderTop="1px solid" borderColor="whiteAlpha.300" my={4} />

          <Box mt={4}>
            <Text mb={2}>Clases virtuales por cátedra</Text>

            <Box maxH="220px" overflowY="auto" pr={1}>
              {!cursosActivos.length ? (
                <Text fontSize="xs" color="gray.400">
                  No hay cátedras activas en este plan para esta materia.
                </Text>
              ) : (
                cursosActivos.map((curso, cursoIndex) => (
                  <Box
                    key={curso.codigo}
                    mt={cursoIndex === 0 ? 0 : 3}
                    pt={cursoIndex === 0 ? 0 : 3}
                    borderTop={cursoIndex === 0 ? "none" : "1px solid"}
                    borderColor="whiteAlpha.300"
                  >
                    <Text fontSize="xs" fontWeight="bold" mb={1}>
                      {curso.docentes}
                    </Text>

                    {curso.clases
                      .slice()
                      .sort((a, b) => a.dia - b.dia)
                      .map((clase) => (
                        <Flex
                          key={`${curso.codigo}-${clase.dia}`}
                          alignItems="center"
                          justifyContent="space-between"
                          py={1}
                        >
                          <Text fontSize="sm">
                            {COMPLETOS_SEMANA[clase.dia]}
                          </Text>
                          <Switch
                            isChecked={esVirtualCursoDia(
                              curso.codigo,
                              clase.dia,
                            )}
                            onChange={(e) =>
                              setVirtualidadCursoDia(
                                curso.codigo,
                                clase.dia,
                                e.target.checked,
                              )
                            }
                          />
                        </Flex>
                      ))}
                  </Box>
                ))
              )}
            </Box>
          </Box>
        </PopoverBody>
      </PopoverContent>
    </DarkMode>
  </Popover>
);

const SelectCurso = ({ codigo }) => {
  const {
    coloresMaterias,
    setColorMateria,
    setVirtualidadCursoDia,
    esVirtualCursoDia,
    toggleCurso,
    events,
    toggleMateria,
    getters,
  } = React.useContext(DataContext);
  const materia = getters.getMateria(codigo);
  const items = getters.getCursosMateria(codigo);

  const isBlocked = React.useCallback(
    (codigo) => {
      const curso = getters.getCurso(codigo);
      const eventos = events.filter((e) => {
        const anotherCurso = getters.getCurso(e.curso);
        if (!anotherCurso) return false;
        return anotherCurso.materia !== curso.materia;
      });
      for (const clase of curso.clases) {
        const inicio = new Date(2018, 0, clase.dia);
        const [inicioHora, inicioMinutos] = clase.inicio.split(":");
        inicio.setHours(inicioHora, inicioMinutos);
        const fin = new Date(2018, 0, clase.dia);
        const [finHora, finMinutos] = clase.fin.split(":");
        fin.setHours(finHora, finMinutos);

        for (const evento of eventos) {
          if (inicio < evento.end && fin > evento.start) {
            return true;
          }
        }
      }
      return false;
    },
    [events, getters],
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

  const materiaColor =
    coloresMaterias[codigo] ?? getColor({ id: materia.codigo });

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

        <PopoverConfigCurso
          codigo={codigo}
          materiaColor={materiaColor}
          setColorMateria={setColorMateria}
          cursosActivos={cursosActivos}
          esVirtualCursoDia={esVirtualCursoDia}
          setVirtualidadCursoDia={setVirtualidadCursoDia}
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
          const color = event?.color ?? materiaColor;
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
                        item.clases.map((clase) => INICIALES_SEMANA[clase.dia]),
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

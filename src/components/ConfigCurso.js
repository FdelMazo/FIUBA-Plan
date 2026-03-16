import { ChevronDownIcon, SettingsIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  DarkMode,
  Flex,
  FormControl,
  FormErrorMessage,
  IconButton,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
  Switch,
  Text,
} from "@chakra-ui/react";
import React from "react";
import { BlockPicker } from "react-color";
import { DataContext } from "../DataContext";
import { getColor } from "../utils";

const HEX_COLOR_REGEX = /^#(?:[0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;

const SUGGESTED_COLORS = [
  "#FF3B30",
  "#FF9500",
  "#FFCC00",
  "#34C759",
  "#00C7BE",
  "#32ADE6",
  "#007AFF",
  "#5856D6",
  "#AF52DE",
  "#FF2D55",
  "#FF6B6B",
  "#00E5FF",
  "#76FF03",
  "#FFD600",
];

const DIAS_SEMANA = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
];

const ConfigCurso = ({ setColorCurso, cursosActivos }) => {
  const { coloresCursos, toggleIgnorarCurso, isCursoIgnorado } =
    React.useContext(DataContext);
  const [selectedCursoCodigo, setSelectedCursoCodigo] = React.useState(
    cursosActivos[0]?.codigo,
  );

  React.useEffect(() => {
    if (!cursosActivos.length) {
      setSelectedCursoCodigo(undefined);
      return;
    }

    const cursoSigueExistiendo = cursosActivos.some(
      (c) => c.codigo === selectedCursoCodigo,
    );

    if (!selectedCursoCodigo || !cursoSigueExistiendo) {
      setSelectedCursoCodigo(cursosActivos[0].codigo);
    }
  }, [cursosActivos, selectedCursoCodigo]);

  const selectedCurso = React.useMemo(
    () => cursosActivos.find((c) => c.codigo === selectedCursoCodigo),
    [cursosActivos, selectedCursoCodigo],
  );

  const getCursoColor = React.useCallback(
    (curso) => {
      if (!curso) {
        return "#ffffff";
      }
      const id = curso.clases + curso.codigo + curso.docentes;
      return coloresCursos[curso.codigo] ?? getColor({ id });
    },
    [coloresCursos],
  );

  const clasesPorDia = React.useMemo(() => {
    if (!selectedCurso?.clases?.length) {
      return [];
    }

    const porDia = selectedCurso.clases.reduce((acc, clase) => {
      if (!acc[clase.dia]) {
        acc[clase.dia] = [];
      }
      acc[clase.dia].push(clase);
      return acc;
    }, {});

    return Object.entries(porDia)
      .map(([dia, clases]) => ({
        dia: Number(dia),
        clases: clases.sort((a, b) => a.inicio.localeCompare(b.inicio)),
      }))
      .sort((a, b) => a.dia - b.dia);
  }, [selectedCurso]);

  const claseToDates = (dia, clase) => {
    // 2026 solo se utiliza como una fecha ancla para obtener las horas en el formato correcto.
    // Realmente de la fecha solo se utilizan la hora y los minutos.

    const inicio = new Date(2026, 0, dia);
    const [inicioHora, inicioMinutos] = clase.inicio.split(":");
    inicio.setHours(inicioHora, inicioMinutos);

    const fin = new Date(2026, 0, dia);
    const [finHora, finMinutos] = clase.fin.split(":");
    fin.setHours(finHora, finMinutos);

    return { inicio, fin };
  };

  return (
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
          <PopoverBody
            px={4}
            py={4}
            display="flex"
            flexDirection="column"
            minH="300px"
          >
            <Box>
              <Text mb={2}>Configurar curso</Text>
              <Menu matchWidth>
                <MenuButton
                  as={Button}
                  width="100%"
                  justifyContent="space-between"
                  px={2}
                  colorScheme="primary"
                  variant="outline"
                  borderColor="primary"
                  color="primary.500"
                  isDisabled={!cursosActivos.length}
                  rightIcon={
                    <>
                      <Text alignSelf="center" fontSize="x-small">
                        ({cursosActivos.length})
                      </Text>
                      <ChevronDownIcon />
                    </>
                  }
                >
                  <Text
                    fontSize="xs"
                    isTruncated
                    color={
                      selectedCurso
                        ? getCursoColor(selectedCurso)
                        : "primary.500"
                    }
                  >
                    {selectedCurso?.docentes ?? "Sin cursos activos"}
                  </Text>
                </MenuButton>
                <MenuList maxH="220px" overflowY="auto">
                  {cursosActivos.map((curso) => (
                    <MenuItem
                      key={curso.codigo}
                      fontSize="xs"
                      color={getCursoColor(curso)}
                      onClick={() => setSelectedCursoCodigo(curso.codigo)}
                    >
                      {curso.docentes}
                    </MenuItem>
                  ))}
                </MenuList>
              </Menu>
            </Box>

            <Box mt={4} flex="1" display="flex" flexDirection="column">
              {!selectedCurso ? (
                <Box
                  flex="1"
                  width="100%"
                  border="1px dashed"
                  borderColor="whiteAlpha.400"
                  borderRadius="md"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Text fontSize="sm" color="whiteAlpha.500" textAlign="center">
                    No hay curso para configurar
                  </Text>
                </Box>
              ) : (
                <>
                  <Box>
                    <Text mb={2}>Seleccionar color del curso</Text>

                    <CursoColorPicker
                      color={getCursoColor(selectedCurso)}
                      onColorChange={(color) => {
                        if (!selectedCurso) return;
                        setColorCurso(selectedCurso.codigo, color);
                      }}
                    />
                  </Box>

                  <Box mt={4}>
                    <Text mb={2}>Seleccionar clases ignoradas</Text>

                    {clasesPorDia.map(({ dia, clases }) => (
                      <Box key={dia} mb={3}>
                        <Text fontSize="sm" color="whiteAlpha.800" mb={1}>
                          {DIAS_SEMANA[dia] ?? `Día ${dia}`}
                        </Text>

                        {clases.map((clase) => {
                          const { inicio, fin } = claseToDates(dia, clase);
                          const checked = isCursoIgnorado(
                            selectedCurso.codigo,
                            dia,
                            inicio,
                            fin,
                          );

                          return (
                            <Flex
                              key={`${dia}-${clase.inicio}-${clase.fin}`}
                              align="center"
                              justify="space-between"
                              py={1}
                            >
                              <Text fontSize="sm">
                                {clase.inicio} - {clase.fin}
                              </Text>
                              <Switch
                                isChecked={checked}
                                onChange={() =>
                                  toggleIgnorarCurso(
                                    selectedCurso.codigo,
                                    dia,
                                    inicio,
                                    fin,
                                  )
                                }
                                colorScheme="primary"
                              />
                            </Flex>
                          );
                        })}
                      </Box>
                    ))}
                  </Box>
                </>
              )}
            </Box>
          </PopoverBody>
        </PopoverContent>
      </DarkMode>
    </Popover>
  );
};

const CursoColorPicker = ({ color, onColorChange }) => {
  const [inputColor, setInputColor] = React.useState(color);

  React.useEffect(() => {
    setInputColor((color || "").toUpperCase());
  }, [color]);

  const isColorInvalid =
    inputColor?.length > 0 && !HEX_COLOR_REGEX.test(inputColor);

  return (
    <>
      <BlockPicker
        width="100%"
        triangle="hide"
        colors={SUGGESTED_COLORS}
        styles={{
          default: {
            body: {
              padding: "10px 10px 0",
            },
            label: {
              textTransform: "uppercase",
            },
            input: {
              display: "none",
            },
          },
        }}
        color={HEX_COLOR_REGEX.test(color) ? color : "#FFFFFF"}
        onChange={(nextColor) => {
          const hexColor = nextColor.hex.toUpperCase();
          setInputColor(hexColor);
          onColorChange(hexColor);
        }}
      />

      <FormControl mt={3} isInvalid={isColorInvalid}>
        <Flex align="center" gap={2}>
          <Text fontSize="sm" fontWeight="semibold">
            HEX:
          </Text>
          <Input
            value={inputColor}
            placeholder="#AABBCC o #ABC"
            textTransform="uppercase"
            onChange={(event) => {
              const nextColor = event.target.value.toUpperCase();
              setInputColor(nextColor);

              if (HEX_COLOR_REGEX.test(nextColor)) {
                onColorChange(nextColor);
              }
            }}
          />
        </Flex>
        <FormErrorMessage>Código de color inválido</FormErrorMessage>
      </FormControl>
    </>
  );
};

export default ConfigCurso;

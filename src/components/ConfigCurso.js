import { SettingsIcon } from "@chakra-ui/icons";
import {
  Box,
  DarkMode,
  Flex,
  IconButton,
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
import { HexColorPicker } from "react-colorful";

const COMPLETOS_SEMANA = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
];

const ConfigCurso = ({
  codigo,
  colorCurso,
  setColorCurso,
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

export default ConfigCurso;

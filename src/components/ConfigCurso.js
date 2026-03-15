import { ChevronDownIcon, SettingsIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  DarkMode,
  IconButton,
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
  Text,
} from "@chakra-ui/react";
import React from "react";
import { HexColorPicker } from "react-colorful";
import { DataContext } from "../DataContext";
import { getColor } from "../utils";

const ConfigCurso = ({ setColorCurso, cursosActivos }) => {
  const { coloresCursos } = React.useContext(DataContext);
  const [selectedCursoCodigo, setSelectedCursoCodigo] = React.useState(
    cursosActivos[0]?.codigo,
  );

  React.useEffect(() => {
    if (!cursosActivos.length) {
      setSelectedCursoCodigo(undefined);
      return;
    }

    const cursoSigueExistiendo = cursosActivos.some(
      (curso) => curso.codigo === selectedCursoCodigo,
    );

    if (!selectedCursoCodigo || !cursoSigueExistiendo) {
      setSelectedCursoCodigo(cursosActivos[0].codigo);
    }
  }, [cursosActivos, selectedCursoCodigo]);

  const selectedCurso = React.useMemo(
    () => cursosActivos.find((curso) => curso.codigo === selectedCursoCodigo),
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
              <Text mb={2}>Curso a configurar</Text>
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
                  <HexColorPicker
                    style={{
                      width: "100%",
                    }}
                    color={getCursoColor(selectedCurso)}
                    onChange={(color) => {
                      if (!selectedCurso) return;
                      setColorCurso(selectedCurso.codigo, color);
                    }}
                  />
                </>
              )}
            </Box>
          </PopoverBody>
        </PopoverContent>
      </DarkMode>
    </Popover>
  );
};

export default ConfigCurso;

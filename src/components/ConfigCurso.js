import { Box, Flex, Switch, Text } from "@chakra-ui/react";
import React from "react";
import { DataContext } from "../DataContext";
import { cursoToDates, getColor } from "../utils";
import ConfigColorPopover from "./ConfigColorPopover";

const WEEKDAYS = [
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
    <ConfigColorPopover
      items={cursosActivos}
      getItemId={(curso) => curso?.codigo}
      getItemLabel={(curso) => curso.docentes}
      getItemColor={getCursoColor}
      onColorChange={(curso, color) => setColorCurso(curso.codigo, color)}
      title="Configurar curso"
      emptyLabel="Sin cursos activos"
      emptyConfigLabel="No hay curso para configurar"
      colorLabel="Seleccionar color del curso"
      minHeight="300px"
    >
      {(selectedCurso) => (
        <IgnoredClassesConfig
          selectedCurso={selectedCurso}
          toggleIgnorarCurso={toggleIgnorarCurso}
          isCursoIgnorado={isCursoIgnorado}
        />
      )}
    </ConfigColorPopover>
  );
};

const IgnoredClassesConfig = ({
  selectedCurso,
  toggleIgnorarCurso,
  isCursoIgnorado,
}) => {
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

  return (
    <Box mt={4}>
      <Text mb={2}>Seleccionar clases ignoradas</Text>

      {clasesPorDia.map(({ dia, clases }) => (
        <Box key={dia} mb={3}>
          <Text fontSize="sm" color="whiteAlpha.800" mb={1}>
            {WEEKDAYS[dia]}
          </Text>

          {clases.map((clase) => {
            const { inicio, fin } = cursoToDates(clase);
            const checked = isCursoIgnorado(
              selectedCurso.codigo,
              clase.dia,
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
                      clase.dia,
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
  );
};

export default ConfigCurso;

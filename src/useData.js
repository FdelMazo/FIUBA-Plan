/* eslint-disable react-hooks/exhaustive-deps */
import ColorHash from "color-hash";
import React from "react";
import { data as jsonData } from "./data/horarios";

const toggler = (arr, setArr, item) => {
  let newArr = [];

  if (arr.includes(item)) {
    newArr = arr.filter((i) => !!i && i !== item);
  } else {
    newArr = [...arr, item];
  }

  setArr(newArr);
};

const useGraph = () => {
  const select = (key) => {
    if (
      JSON.parse(window.localStorage.getItem("fiubaplan"))?.cuatrimestre !==
      jsonData.cuatrimestre
    )
      return null;
    return JSON.parse(window.localStorage.getItem("fiubaplan"))?.[key];
  };
  console.log(window.localStorage.getItem("fiubaplan")?.selectedMaterias);
  const colorHash = new ColorHash({ lightness: 0.7, saturation: 0.7 });
  const [selectedCarreras, setSelectedCarreras] = React.useState(
    select("selectedCarreras") || []
  );
  const [selectedMaterias, setSelectedMaterias] = React.useState(
    select("selectedMaterias") || []
  );
  const [selectedCursos, setSelectedCursos] = React.useState(
    select("selectedCursos") || []
  );
  const [events, setEvents] = React.useState([]);
  const [materiasToShow, setMateriasToShow] = React.useState([]);

  React.useEffect(() => {
    window.localStorage.setItem(
      "fiubaplan",
      JSON.stringify({
        cuatrimestre: jsonData.cuatrimestre,
        selectedCarreras,
        selectedMaterias,
        selectedCursos,
      })
    );
  }, [selectedCarreras, selectedMaterias, selectedCursos]);

  const carreras = React.useMemo(
    () => jsonData.carreras.map((c) => c.nombre).sort(),
    []
  );

  const actualizacion = React.useMemo(
    () => ({
      cuatrimestre: jsonData.cuatrimestre,
    }),
    []
  );

  React.useEffect(() => {
    let codigos = [];
    if (!selectedCarreras.length) {
      codigos = carreras
        .map((nombre) => jsonData.carreras.find((c) => c.nombre === nombre))
        .filter((materia) => !!materia)
        .reduce((arr, c) => arr.concat(...c.materias), []);
    } else {
      codigos = selectedCarreras
        .map((nombre) => jsonData.carreras.find((c) => c.nombre === nombre))
        .filter((materia) => !!materia)
        .reduce((arr, c) => arr.concat(...c.materias), []);
    }
    const codigosUnicos = [...new Set(codigos)].sort();
    let materias = codigosUnicos
      .map((c) => jsonData.materias.find((m) => m.codigo === c))
      .filter((materia) => !!materia)
      .map((m) => {
        return { codigo: m.codigo, nombre: m.nombre };
      });
    setMateriasToShow(materias);
  }, [carreras, selectedCarreras]);

  const getMateria = (codigo) => {
    const materia = jsonData.materias.find((m) => m.codigo === codigo);
    return {
      codigo: materia.codigo,
      nombre: materia.nombre,
    };
  };

  const getCursos = (codigo) => {
    const comisiones = jsonData.materias.find(
      (m) => m.codigo === codigo
    ).cursos;
    return comisiones
      .map((codigo) => jsonData.cursos.find((c) => c.codigo === codigo))
      .filter((curso) => !!curso)
      .map((curso) => ({
        codigo: curso.codigo,
        docentes: curso.docentes,
        materia: getMateria(codigo).nombre,
      }));
  };

  React.useEffect(() => {
    console.log(selectedCursos);
    let eventos = selectedCursos
      .map((curso) => ({
        ...jsonData.cursos.find((c) => c.codigo === curso.codigo),
        materia: curso.materia,
      }))
      .filter((curso) => !!curso)
      .map((curso) =>
        curso.clases.map((clase) => {
          const inicio = new Date(2018, 0, clase.dia);
          const [inicioHora, inicioMinutos] = clase.inicio.split(":");
          inicio.setHours(inicioHora, inicioMinutos);
          const fin = new Date(2018, 0, clase.dia);
          const [finHora, finMinutos] = clase.fin.split(":");
          fin.setHours(finHora, finMinutos);

          return {
            start: inicio,
            end: fin,
            codigo: curso.codigo,
            id: `${curso.codigo}${inicio}`,
            title: curso.docentes,
            color: colorHash.hex(curso.docentes),
            materia: curso.materia.nombre,
          };
        })
      )
      .reduce((arr, e) => arr.concat(...e), []);
    setEvents(eventos);
  }, [selectedCursos]);

  const toggleCarrera = (nombre) => {
    toggler(selectedCarreras, setSelectedCarreras, nombre);
  };
  const toggleMateria = (codigo) => {
    const materia = getMateria(codigo);
    if (selectedMaterias.includes(codigo)) {
      const remover = getCursos(codigo).filter((curso) =>
        selectedCursos.find((c) => c.codigo === curso.codigo)
      );
      removerCursos(remover);
    } else {
      toggleCurso(getCursos(codigo)[0], materia);
    }
    toggler(selectedMaterias, setSelectedMaterias, codigo);
  };

  const removerCursos = (cursos) => {
    let newSelectedCursos = selectedCursos.filter(
      (item) => !!item && !cursos.map((c) => c.codigo).includes(item.codigo)
    );
    setSelectedCursos(newSelectedCursos);
  };

  const toggleCurso = (curso, materia) => {
    let newSelectedCursos = [];
    if (selectedCursos.find((item) => item.codigo === curso.codigo)) {
      newSelectedCursos = selectedCursos.filter(
        (item) => !!item && item.codigo !== curso.codigo
      );
    } else {
      newSelectedCursos = [
        ...selectedCursos,
        {
          codigo: curso.codigo,
          color: colorHash.hex(curso.docentes),
          materia,
        },
      ];
    }
    setSelectedCursos(newSelectedCursos);
  };

  return {
    toggleCarrera,
    toggleMateria,
    selectedMaterias,
    carreras,
    selectedCarreras,
    materiasToShow,
    actualizacion,
    selectedCursos,
    getCursos,
    getMateria,
    events,
    toggleCurso,
  };
};

export default useGraph;

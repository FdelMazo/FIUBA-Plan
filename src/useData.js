/* eslint-disable react-hooks/exhaustive-deps */
import ColorHash from "color-hash";
import React from "react";
import { carreras as jsonCarreras } from "./data/carreras";
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

const ValidCurso = (curso) => {
  return !!jsonData.cursos.find((c) => c.codigo === curso.codigo);
};

const ValidMateria = (codigo) => {
  const materia = jsonData.materias.find(
    (materia) => materia.codigo === codigo
  );
  if (!materia) return false;
  return materia.cursos.filter(
    (codigo) => !!jsonData.cursos.find((c) => c.codigo === codigo)
  ).length;
};

const useData = () => {
  const select = (key) => {
    if (
      JSON.parse(window.localStorage.getItem("fiubaplan"))?.cuatrimestre !==
      jsonData.cuatrimestre
    )
      return null;
    return JSON.parse(window.localStorage.getItem("fiubaplan"))?.[key];
  };
  const colorHash = new ColorHash({
    lightness: [0.6, 0.65, 0.7, 0.75, 0.8, 0.85],
    saturation: [0.6, 0.65, 0.7, 0.75, 0.8, 0.85],
  });

  const [showSabado, setShowSabado] = React.useState(false);

  const [activeTabId, setActiveTabId] = React.useState(0);
  const [tabs, setTabs] = React.useState(
    select("tabs") || [{ title: "", id: 0 }]
  );

  const [selectedCarreras, setSelectedCarreras] = React.useState(
    select("selectedCarreras") || []
  );
  const [selectedMaterias, setSelectedMaterias] = React.useState(
    select("selectedMaterias")?.filter(ValidMateria) || []
  );
  const [selectedCursos, setSelectedCursos] = React.useState(
    select("selectedCursos")?.filter(ValidCurso) || []
  );
  const [events, setEvents] = React.useState([]);
  const [noCursar, setNoCursar] = React.useState(select("noCursar") || []);
  const [materiasToShow, setMateriasToShow] = React.useState([]);

  React.useEffect(() => {
    window.localStorage.setItem(
      "fiubaplan",
      JSON.stringify({
        cuatrimestre: jsonData.cuatrimestre,
        selectedCarreras,
        selectedMaterias,
        selectedCursos,
        noCursar,
        tabs,
      })
    );
  }, [selectedCarreras, selectedMaterias, selectedCursos, tabs, noCursar]);

  const carreras = React.useMemo(
    () => jsonCarreras.map((c) => c.nombre).sort(),
    []
  );

  const actualizacion = React.useMemo(
    () => ({
      cuatrimestre: jsonData.cuatrimestre,
      timestamp: jsonData.timestamp,
    }),
    []
  );

  React.useEffect(() => {
    let sabado = false;
    for (const e of events) {
      if (e.end.getDay() === 6) {
        sabado = true;
        break;
      }
    }
    setShowSabado(sabado);
  }, [events]);

  React.useEffect(() => {
    let codigos = [];
    if (!selectedCarreras.length) {
      codigos = jsonData.materias.map((m) => m.codigo);
    } else {
      codigos = selectedCarreras
        .map((nombre) => jsonCarreras.find((c) => c.nombre === nombre))
        .filter((carrera) => !!carrera)
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
        tabId: activeTabId,
      }));
  };

  React.useEffect(() => {
    let eventos = selectedCursos
      .map((curso) => ({
        ...jsonData.cursos.find((c) => c.codigo === curso.codigo),
        materia: curso.materia,
        tabId: curso.tabId,
      }))
      .filter((curso) => !!curso.codigo)
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
            tooltip: `\n[${curso.materia.codigo}] ${curso.materia.nombre}\n${curso.docentes}`,
            tabId: curso.tabId,
            color: colorHash.hex(curso.codigo + curso.docentes),
            materia: `[${curso.materia.codigo}] ${curso.materia.nombre}`,
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
    let newNoCursar = noCursar.filter(
      (id) => !!id && !cursos.some((c) => id.startsWith(c.codigo))
    );
    setNoCursar(newNoCursar);
    setSelectedCursos(newSelectedCursos);
  };

  const toggleCurso = (curso, materia) => {
    let newSelectedCursos = [];
    if (
      selectedCursos.find(
        (item) => item.codigo === curso.codigo && item.tabId === activeTabId
      )
    ) {
      newSelectedCursos = selectedCursos.filter(
        (item) => !!item && item.codigo !== curso.codigo
      );
      setNoCursar(
        noCursar.filter((id) => !!id && !id.startsWith(curso.codigo))
      );
    } else {
      newSelectedCursos = [
        ...selectedCursos,
        {
          codigo: curso.codigo,
          color: colorHash.hex(curso.codigo + curso.docentes),
          materia,
          tabId: activeTabId,
        },
      ];
    }
    setSelectedCursos(newSelectedCursos);
  };

  const limpiarCursos = () => {
    setSelectedCursos([]);
    setNoCursar([]);
  };

  const limpiarMaterias = () => {
    limpiarCursos();
    setSelectedMaterias([]);
  };

  const toggleNoCursar = (id) => {
    toggler(noCursar, setNoCursar, id);
  };

  const addTab = () => {
    const ids = tabs.map((t) => t.id);
    let id = 0;
    while (ids.includes(id)) {
      id += 1;
    }
    setTabs([...tabs, { id, title: "" }]);
  };

  const selectTab = (id) => {
    setActiveTabId(id);
  };

  const renameTab = (id, newtitle) => {
    let newTabs = [...tabs];
    newTabs.find((t) => t.id === id).title = newtitle;
    setTabs(newTabs);
  };

  const removeTab = (id) => {
    selectedCursos
      .filter((c) => c.tabId === id)
      .forEach((c) => {
        toggleCurso(c, c.materia);
      });

    setTabs(tabs.filter((t) => t.id !== id));
    setActiveTabId(0);
  };

  return {
    toggleCarrera,
    toggleMateria,
    noCursar,
    selectedMaterias,
    carreras,
    selectedCarreras,
    materiasToShow,
    actualizacion,
    selectedCursos,
    limpiarCursos,
    limpiarMaterias,
    getCursos,
    getMateria,
    events,
    showSabado,
    toggleCurso,
    toggleNoCursar,
    addTab,
    selectTab,
    renameTab,
    removeTab,
    tabs,
    activeTabId,
  };
};

export default useData;

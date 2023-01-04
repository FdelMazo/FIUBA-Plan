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

const ValidCurso = (codigo) => {
  return !!jsonData.cursos.find((c) => c.codigo === codigo)?.clases?.length;
};

const ValidMateria = (codigo) => {
  const materia = jsonData.materias.find(
    (materia) => materia.codigo === codigo
  );
  if (!materia) return false;
  return !!materia.cursos.filter(ValidCurso).length;
};

const getMateria = (codigo) => {
  return jsonData.materias.find((m) => m.codigo === codigo);
};

const getCurso = (codigo) => {
  return jsonData.cursos.find((c) => c.codigo === codigo);
};

const getCarrera = (nombre) => {
  return jsonCarreras.find((c) => c.nombre === nombre);
};

const getCursosMateria = (codigoMateria) => {
  const cursos = jsonData.materias.find(
    (m) => m.codigo === codigoMateria
  ).cursos;
  return cursos.filter(ValidCurso).map(getCurso);
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

  const [selectedCarreras, setSelectedCarreras] = React.useState(
    select("selectedCarreras") || []
  );
  const [selectedMaterias, setSelectedMaterias] = React.useState(
    select("selectedMaterias")?.filter(ValidMateria) || []
  );
  const [selectedCursos, setSelectedCursos] = React.useState(
    select("selectedCursos")?.filter((c) => ValidCurso(c.codigo)) || []
  );
  const [extraEvents, setExtraEvents] = React.useState(
    select("extraEvents")?.map((e) => ({
      ...e,
      start: new Date(e.start),
      end: new Date(e.end),
    })) || []
  );
  const [events, setEvents] = React.useState([]);
  const [noCursar, setNoCursar] = React.useState(select("noCursar") || []);
  const [materiasToShow, setMateriasToShow] = React.useState([]);

  const [activeTabId, setActiveTabId] = React.useState(0);
  const [tabs, setTabs] = React.useState(select("tabs") || [{ id: 0 }]);

  const colorHash = new ColorHash({
    lightness: [0.6, 0.65, 0.7, 0.75, 0.8, 0.85],
    saturation: [0.6, 0.65, 0.7, 0.75, 0.8, 0.85],
  });

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
        extraEvents,
      })
    );
  }, [
    selectedCarreras,
    selectedMaterias,
    selectedCursos,
    tabs,
    noCursar,
    extraEvents,
  ]);

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
    let codigos = [];
    if (!selectedCarreras.length) {
      codigos = jsonData.materias.map((m) => m.codigo);
    } else {
      codigos = selectedCarreras
        .map(getCarrera)
        .reduce((arr, c) => arr.concat(...c.materias), []);
    }
    const codigosUnicos = [...new Set(codigos)].sort();
    let materias = codigosUnicos.filter(ValidMateria).map(getMateria);
    setMateriasToShow(materias);
  }, [carreras, selectedCarreras]);

  React.useEffect(() => {
    let eventos = selectedCursos
      .map((c) => ({
        ...c,
        ...getCurso(c.codigo),
      }))
      .map((curso) => {
        let materia = getMateria(curso.materia);
        return curso.clases.map((clase) => {
          const inicio = new Date(2018, 0, clase.dia);
          const [inicioHora, inicioMinutos] = clase.inicio.split(":");
          inicio.setHours(inicioHora, inicioMinutos);
          const fin = new Date(2018, 0, clase.dia);
          const [finHora, finMinutos] = clase.fin.split(":");
          fin.setHours(finHora, finMinutos);
          return {
            start: inicio,
            end: fin,
            id: `${curso.codigo}-${inicio}`,
            title: curso.docentes,
            tooltip: `[${materia.codigo}] ${materia.nombre}\n${curso.docentes}`,
            materia: `[${materia.codigo}] ${materia.nombre}`,
            curso,
          };
        });
      })
      .reduce((arr, e) => arr.concat(...e), []);
    setEvents([...eventos, ...extraEvents]);
  }, [selectedCursos, extraEvents]);

  const toggleCarrera = (nombre) => {
    toggler(selectedCarreras, setSelectedCarreras, nombre);
  };
  const toggleMateria = (codigo) => {
    if (selectedMaterias.includes(codigo)) {
      const remover = getCursosMateria(codigo).filter((curso) =>
        selectedCursos.find((c) => c.codigo === curso.codigo)
      );
      removerCursosDeTodosLosTabs(remover);
    } else {
      toggleCurso(getCursosMateria(codigo)[0]);
    }
    toggler(selectedMaterias, setSelectedMaterias, codigo);
  };

  const removerCursosDeTodosLosTabs = (cursos) => {
    let newSelectedCursos = selectedCursos.filter(
      (item) => !cursos.map((c) => c.codigo).includes(item.codigo)
    );
    let newNoCursar = noCursar.filter(
      (nc) => !cursos.some((c) => nc.id.startsWith(c.codigo))
    );
    setNoCursar(newNoCursar);
    setSelectedCursos(newSelectedCursos);
  };

  const toggleCurso = (curso) => {
    let newSelectedCursos = [];
    if (
      selectedCursos.find(
        (item) => item.codigo === curso.codigo && item.tabId === activeTabId
      )
    ) {
      newSelectedCursos = selectedCursos.filter(
        (item) =>
          item.codigo !== curso.codigo ||
          (item.codigo === curso.codigo && item.tabId !== activeTabId)
      );
      setNoCursar(
        noCursar.filter(
          (item) =>
            !item.id.startsWith(curso.codigo) ||
            (item.id.startsWith(curso.codigo) && item.tabId !== activeTabId)
        )
      );
    } else {
      newSelectedCursos = [
        ...selectedCursos,
        {
          codigo: curso.codigo,
          tabId: activeTabId,
        },
      ];
    }
    setSelectedCursos(newSelectedCursos);
  };

  const limpiarCursos = (tabId) => {
    let newSelectedCursos = selectedCursos.filter((i) => i.tabId !== tabId);
    setSelectedCursos(newSelectedCursos);
    let newNoCursar = noCursar.filter((i) => i.tabId !== tabId);
    setNoCursar(newNoCursar);
  };

  const toggleNoCursar = (id) => {
    let newNoCursar = [];
    if (noCursar.find((item) => item.id === id && item.tabId === activeTabId)) {
      newNoCursar = noCursar.filter(
        (item) =>
          item.id !== id || (item.id !== id && item.tabId !== activeTabId)
      );
    } else {
      newNoCursar = [
        ...noCursar,
        {
          id,
          tabId: activeTabId,
        },
      ];
    }
    setNoCursar(newNoCursar);
  };

  const addTab = () => {
    const ids = tabs.map((t) => t.id);
    let id = 0;
    while (ids.includes(id)) {
      id += 1;
    }
    setTabs([...tabs, { id }]);
    const clonedSelectedCursos = selectedCursos.filter(c => c.tabId === activeTabId).map(c => {
      const newC = JSON.parse(JSON.stringify(c))
      newC.tabId = id
      return newC
    });
    const clonedNoCursar = noCursar.filter(c => c.tabId === activeTabId).map(c => {
      const newC = JSON.parse(JSON.stringify(c))
      newC.tabId = id
      return newC
    });
    const clonedExtraEvents = extraEvents.filter(e => e.curso.tabId === activeTabId).map(e => {
      const newE = JSON.parse(JSON.stringify(e))
      newE.curso.tabId = id
      newE.start = new Date(e.start)
      newE.end = new Date(e.end)
      return newE
    });
    setSelectedCursos([...selectedCursos, ...clonedSelectedCursos]);
    setNoCursar([...noCursar, ...clonedNoCursar]);
    setExtraEvents([...extraEvents, ...clonedExtraEvents]);
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
    limpiarCursos(id);
    setTabs(tabs.filter((t) => t.id !== id));
    setActiveTabId(0);
  };

  const getColor = (codigo) => {
    let curso = getCurso(codigo);
    if (!curso) return null;
    return colorHash.hex(curso.clases + curso.codigo + curso.docentes);
  };

  const getNHoras = (tabId) => {
    return selectedCursos
      .filter((c) => c.tabId === tabId)
      .flatMap((c) => getCurso(c.codigo).clases)
      .map((clase) => {
        const inicio = new Date(2018, 0, clase.dia);
        const [inicioHora, inicioMinutos] = clase.inicio.split(":");
        inicio.setHours(inicioHora, inicioMinutos);
        const fin = new Date(2018, 0, clase.dia);
        const [finHora, finMinutos] = clase.fin.split(":");
        fin.setHours(finHora, finMinutos);
        return Math.abs(fin - inicio) / 36e5;
      })
      .reduce((a, b) => a + b, 0);
  };

  const testAll = () => {
    const allMaterias = jsonData.materias.map((m) => m.codigo);
    setSelectedMaterias(allMaterias);
    const allCursos = jsonData.cursos.map((c) => ({
      codigo: c.codigo,
      tabId: activeTabId,
    }));
    setSelectedCursos(allCursos);
  };

  const addHorarioExtra = ({ start, end }) => {
    // We don't want simple clicks to trigger the creation of an event
    // Limiting the time event to at least 60 minutes means the user dragged the mouse, instead of just clicking
    const minutes = Math.floor(((end - start) / 1000) / 60);
    if (minutes < 60) return

    const id = start.getTime() + end.getTime() + (Math.random() * 100);
    const randomLetter = String.fromCharCode(
      65 + Math.floor(id % 23) + Math.floor(id % 3)
    );
    setExtraEvents([
      ...extraEvents,
      {
        start,
        end,
        id: id.toString(),
        title: "ACTIVIDAD EXTRACURRICULAR",
        materia: "ACTIVIDAD " + randomLetter,
        tooltip: `ACTIVIDAD ${randomLetter}\nACTIVIDAD EXTRACURRICULAR`,
        curso: { tabId: activeTabId },
        color: colorHash.hex(id.toString()),
        isExtra: true,
      },
    ]);
  };

  const removerHorarioExtra = (evento) => {
    const newExtras = extraEvents.filter((e) => e.id !== evento.id || e.materia !== evento.materia || (e.id === evento.id && e.curso.tabId !== activeTabId));
    setExtraEvents(newExtras);
    const newNoCursar = noCursar.filter(
      (item) =>
        item.id !== evento.id ||
        (item.id === evento.id && item.tabId !== evento.curso.tabId)
    );
    setNoCursar(newNoCursar);
  };

  const renombrarHorarioExtra = (evento, str) => {
    let nuevoNombre = str.trim() ? str.trim() : "EXTRA";
    let newExtras = [...extraEvents];
    newExtras.find((e) => e.id === evento.id && e.materia === evento.materia && e.curso.tabId === activeTabId).materia = nuevoNombre;
    newExtras.find(
      (e) => e.id === evento.id && e.tooltip === evento.tooltip
    ).tooltip = `${nuevoNombre}\nACTIVIDAD EXTRACURRICULAR`;
    setExtraEvents(newExtras);
  };
  const removerHorariosExtra = () => {
    const extraEventsIds = extraEvents.map((e) => e.id);
    const newNoCursar = noCursar.filter(
      (nc) => !extraEventsIds.includes(nc.id)
    );
    setNoCursar(newNoCursar);
    setExtraEvents([]);
  };

  const isBlocked = (codigo) => {
    const curso = getCurso(codigo);
    const eventos = events.filter((e) => e.curso.materia !== curso.materia && e.curso.tabId === activeTabId);
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
  };

  // Función para imprimir todas las materias sin carrera
  // React.useEffect(() => {
  //   const allMateriasInCarreras = [];
  //   const materiasSinCasa = [];
  //   jsonCarreras.forEach((c) => {
  //     allMateriasInCarreras.push(...c.materias);
  //   });
  //   jsonData.materias.forEach((m) => {
  //     if (!allMateriasInCarreras.includes(m.codigo)) {
  //       materiasSinCasa.push(m.codigo)
  //     }
  //   });
  //   console.log(materiasSinCasa)
  // }, []);

  return {
    toggleCarrera,
    testAll,
    toggleMateria,
    selectedMaterias,
    carreras,
    noCursar,
    selectedCarreras,
    materiasToShow,
    actualizacion,
    selectedCursos,
    limpiarCursos,
    getMateria,
    events,
    toggleCurso,
    toggleNoCursar,
    addTab,
    selectTab,
    renameTab,
    removeTab,
    tabs,
    activeTabId,
    getCursosMateria,
    getColor,
    getNHoras,
    extraEvents,
    addHorarioExtra,
    removerHorarioExtra,
    removerHorariosExtra,
    renombrarHorarioExtra,
    isBlocked,
  };
};

export default useData;

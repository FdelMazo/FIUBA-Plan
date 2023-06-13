import ColorHash from "color-hash";
import React from "react";
import { carreras as jsonCarreras } from "./data/carreras";
import { data as jsonData } from "./data/horarios";
import { Buffer } from 'buffer'
import pako from 'pako'
import { useImmer } from "use-immer";

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

const coerceExtraEvent = (e) => ({
  ...e,
  start: new Date(e.start),
  end: new Date(e.end),
})

const getFromStorage = (key, group = undefined) => {
  const json = JSON.parse(window.localStorage.getItem("fiubaplan"))
  if (json?.cuatrimestre !== jsonData.cuatrimestre)
    return null;
  return group ? json?.[group]?.[key] : json?.[key];
};

const colorHash = new ColorHash({
  lightness: [0.6, 0.65, 0.7, 0.75, 0.8, 0.85],
  saturation: [0.6, 0.65, 0.7, 0.75, 0.8, 0.85],
});

const carreras = jsonCarreras.map((c) => c.nombre).sort()
const actualizacion = {
  cuatrimestre: jsonData.cuatrimestre,
  timestamp: jsonData.timestamp,
}

const initialSelections = () => {
  return {
    carreras: getFromStorage("carreras", "selections") || [],
    materias: getFromStorage("materias", "selections")?.filter(ValidMateria) || [],
  }
}

const useData = () => {
  const [selections, setSelections] = useImmer(initialSelections)
  const select = (type, item) => {
    setSelections((draft) => {
      const arr = draft[type]
      if (arr.includes(item)) {
        draft[type] = draft[type].filter((i) => i && i !== item);
      } else {
        arr.push(item)
      }
    })
  }
  const overrideSelections = (type, newSelections) => {
    setSelections((draft) => {
      draft[type] = newSelections
    })
  }

  const [selectedCursos, setSelectedCursos] = React.useState(
    getFromStorage("selectedCursos")?.filter((c) => ValidCurso(c.codigo)) || []
  );
  const [extraEvents, setExtraEvents] = React.useState(
    getFromStorage("extraEvents")?.map(coerceExtraEvent) || []
  );
  const [events, setEvents] = React.useState([]);

  const [activeTabId, setActiveTabId] = React.useState(0);
  const [tabs, setTabs] = React.useState(getFromStorage("tabs") || [{ id: 0 }]);

  const permalink = React.useMemo(() => {
    const savedata = {
      cuatrimestre: jsonData.cuatrimestre,
      selections,
      selectedCursos,
      tabs,
      extraEvents,
    }

    // json => pako => b64 => hash
    const savedataPako = pako.gzip(JSON.stringify(savedata), { to: 'string' })
    const savedatab64 = Buffer.from(savedataPako).toString('base64');
    return `https://fede.dm/FIUBA-Plan/#${savedatab64}`
    // We want to track the selections object
    // https://github.com/facebook/react/issues/14476#issuecomment-471199055
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(selections), selectedCursos, tabs, extraEvents])


  React.useEffect(() => {
    if (permalink === "") {
      return
    }
    if (window.location.hash) {
      // hash => b64 => pako => json
      const savedataPako = Buffer.from(window.location.hash.slice(1), 'base64')
      const savedata = JSON.parse(pako.ungzip(savedataPako, { to: 'string' }));

      // El permalink no esta pensado para más de un uso => Pongo el url original
      // eslint-disable-next-line no-restricted-globals
      history.pushState("", document.title, window.location.pathname + window.location.search);

      // Si me pasaron estado de otro cuatri, no hago nada
      if (savedata.cuatrimestre !== jsonData.cuatrimestre) {
        return
      }

      // Si no tengo cursos seleccionados, uso el link
      // Si mis cursos seleccionados son los mismos que los del link, es como si entre dos veces seguidas a la pagina, uso el link
      // Si tengo otros cursos seleccionados, pregunto
      if (!selectedCursos.length ||
        (selectedCursos.toString() === savedata.selectedCursos.toString()) ||
        (window.confirm(`Pisar tus datos con los del permalink ingresado?\n\nGuarda tu permalink actual por las dudas!!\n${permalink}`))) {
        overrideSelections('carreras', savedata.selections.carreras);
        overrideSelections('materias', savedata.selections.materias);
        setSelectedCursos(savedata.selectedCursos);
        setTabs(savedata.tabs);
        setExtraEvents(savedata.extraEvents.map((e) => ({
          ...e,
          start: new Date(e.start),
          end: new Date(e.end),
        })))
      }
    }
    // Repensar para que esto no sea un hook
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [permalink])

  React.useEffect(() => {
    const savedata = {
      cuatrimestre: jsonData.cuatrimestre,
      selections,
      selectedCursos,
      tabs,
      extraEvents,
    }
    window.localStorage.setItem(
      "fiubaplan",
      JSON.stringify(savedata)
    );
    // We want to track the selections object
    // https://github.com/facebook/react/issues/14476#issuecomment-471199055
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(selections), selectedCursos, tabs, extraEvents]);

  const materiasToShow = React.useMemo(() => {
    let codigos = [];
    if (!selections.carreras.length) {
      codigos = jsonData.materias.map((m) => m.codigo);
    } else {
      codigos = selections.carreras
        .map(getCarrera)
        .reduce((arr, c) => arr.concat(...c.materias), []);
    }
    const codigosUnicos = [...new Set(codigos)].sort();
    return codigosUnicos.filter(ValidMateria).map(getMateria);
  }, [selections.carreras]);

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
    select('carreras', nombre)
  };
  const toggleMateria = (codigo) => {
    if (selections.materias.includes(codigo)) {
      const remover = getCursosMateria(codigo).filter((curso) =>
        selectedCursos.find((c) => c.codigo === curso.codigo)
      );
      removerCursosDeTodosLosTabs(remover);
    } else {
      toggleCurso(getCursosMateria(codigo)[0]);
    }
    select('materias', codigo)
  };

  const removerCursosDeTodosLosTabs = (cursos) => {
    let newSelectedCursos = selectedCursos.filter(
      (item) => !cursos.map((c) => c.codigo).includes(item.codigo)
    );
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
    const clonedExtraEvents = extraEvents.filter(e => e.curso.tabId === activeTabId).map(e => {
      const newE = JSON.parse(JSON.stringify(e))
      newE.curso.tabId = id
      newE.start = new Date(e.start)
      newE.end = new Date(e.end)
      return newE
    });
    setSelectedCursos([...selectedCursos, ...clonedSelectedCursos]);
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
    overrideSelections('materias', allMaterias);
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
    carreras,
    materiasToShow,
    actualizacion,
    selectedCursos,
    limpiarCursos,
    getMateria,
    events,
    toggleCurso,
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
    permalink,
    selections
  };
};

export default useData;

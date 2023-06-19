import React from "react";
import { carreras as jsonCarreras } from "./data/carreras";
import { data as jsonData } from "./data/horarios";
import { Buffer } from 'buffer'
import pako from 'pako'
import { useImmer } from "use-immer";
import {
  colorHash,
  ValidCurso,
  ValidMateria,
  getMateria,
  getCurso,
  getCarrera,
  getCursosMateria,
  getColor,
  getFromStorage,
  coerceExtraEvent,
} from "./utils";

let permalinksavedata = null;
if (window.location.hash) {
  // hash => b64 => pako => json
  const savedataPako = Buffer.from(window.location.hash.slice(1), 'base64')
  const savedata = JSON.parse(pako.ungzip(savedataPako, { to: 'string' }));

  // El permalink no esta pensado para más de un uso => Pongo el url original
  // eslint-disable-next-line no-restricted-globals
  history.pushState("", document.title, window.location.pathname + window.location.search);

  // Solo tomo el estado del permalink si estamos en el mismo cuatrimestre
  if (savedata.cuatrimestre === jsonData.cuatrimestre) {
    permalinksavedata = savedata
  }
}

const carreras = jsonCarreras.map((c) => c.nombre).sort()
const actualizacion = {
  cuatrimestre: jsonData.cuatrimestre,
  timestamp: jsonData.timestamp,
}

const initialSelections = () => {
  return {
    carreras: permalinksavedata?.selections.carreras || getFromStorage("carreras", "selections") || [],
    materias: permalinksavedata?.selections.materias?.filter(ValidMateria) || getFromStorage("materias", "selections")?.filter(ValidMateria) || [],
  }
}

const initialSelectedCursos = () => {
  return permalinksavedata?.selectedCursos?.filter((c) => ValidCurso(c.codigo)) || getFromStorage("selectedCursos")?.filter((c) => ValidCurso(c.codigo)) || []
}

const initialExtraEvents = () => {
  return permalinksavedata?.extraEvents?.map(coerceExtraEvent) || getFromStorage("extraEvents")?.map(coerceExtraEvent) || []
}

const initialTabs = () => {
  return permalinksavedata?.tabs || getFromStorage("tabs") || [{ id: 0 }]
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

  const [selectedCursos, setSelectedCursos] = React.useState(initialSelectedCursos);
  const [extraEvents, setExtraEvents] = React.useState(initialExtraEvents);
  const [events, setEvents] = React.useState([]);
  const [activeTabId, setActiveTabId] = React.useState(0);
  const [tabs, setTabs] = React.useState(initialTabs);
  const [readOnly, setReadOnly] = React.useState(!!permalinksavedata);

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
    if (readOnly) {
      return
    }
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
  }, [JSON.stringify(selections), readOnly, selectedCursos, tabs, extraEvents]);

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

  return {
    toggleCarrera,
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
    extraEvents,
    addHorarioExtra,
    removerHorarioExtra,
    removerHorariosExtra,
    renombrarHorarioExtra,
    isBlocked,
    permalink,
    selections,
    readOnly,
    setReadOnly
  };
};

export default useData;

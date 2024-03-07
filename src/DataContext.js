/* https://github.com/facebook/react/issues/14476#issuecomment-471199055 */
/* eslint-disable react-hooks/exhaustive-deps */

import { Buffer } from "buffer";
import pako from "pako";
import React from "react";
import { useImmer, useImmerReducer } from "use-immer";
import { parseSIU } from "./siuparser";

// Si tengo un permalink, parseo su info y reseteo la URL
let permalinksavedata = null;
if (window.location.hash) {
  // hash => b64 => pako => json
  const savedataPako = Buffer.from(window.location.hash.slice(1), "base64");
  const savedata = JSON.parse(pako.ungzip(savedataPako, { to: "string" }));

  // eslint-disable-next-line no-restricted-globals
  history.pushState("", "", window.location.pathname + window.location.search);
  permalinksavedata = savedata;
}

export const DataContext = React.createContext();

export const DataProvider = ({ children }) => {
  const data = Data();

  return <DataContext.Provider value={data}>{children}</DataContext.Provider>;
};

const Data = () => {
  // ESTADO 0: el usuario cargo a manopla los horarios de su propio SIU
  const [horariosSIU, setHorariosSIU] = React.useState(initialHorariosSIU);

  // Getters que verifican contra el SIU del usuario
  const getters = React.useMemo(() => {
    const ValidCurso = (codigo) => {
      return !!horariosSIU.cursos.find((c) => c.codigo === codigo)?.clases
        ?.length;
    };

    const ValidMateria = (codigo) => {
      const materia = horariosSIU?.materias.find(
        (materia) => materia.codigo === codigo,
      );
      if (!materia) return false;
      return !!materia.cursos.filter(ValidCurso).length;
    };

    const getMateria = (codigo) => {
      return horariosSIU.materias.find((m) => m.codigo === codigo);
    };

    const getCurso = (codigo) => {
      return horariosSIU.cursos.find((c) => c.codigo === codigo);
    };

    const getCursosMateria = (codigoMateria) => {
      const cursos = horariosSIU.materias.find(
        (m) => m.codigo === codigoMateria,
      ).cursos;
      return cursos.filter(ValidCurso).map(getCurso);
    };

    return {
      ValidCurso,
      ValidMateria,
      getMateria,
      getCurso,
      getCursosMateria,
    };
  }, [horariosSIU]);

  // ESTADO 1: Las carreras y materias tickeadas por el usuario para verlas en el drawer
  const [selections, setSelections] = useImmer(() =>
    initialSelections(getters),
  );

  // ESTADO 2: Las tabs y el nombre que el usuario les puso
  const [activeTabId, setActiveTabId] = React.useState(0);

  const tabsReducer = (draft, action) => {
    // eslint-disable-next-line default-case
    switch (action.type) {
      case "add":
        return void draft.push({ id: action.id });
      case "rename":
        return void (draft.find((t) => t.id === action.id).title =
          action.title);
      case "remove":
        return draft.filter((t) => t.id !== action.id);
    }
  };

  const [tabs, tabsDispatch] = useImmerReducer(
    tabsReducer,
    [{ id: 0 }],
    initialTabs,
  );

  // ESTADO 3, el mas importante: Todos los eventos que hay en cada tab
  const tabEventsReducer = (draft, action) => {
    // eslint-disable-next-line default-case
    switch (action.type) {
      case "select":
        if (getters.getCurso(action.id)) {
          if (!draft[activeTabId].cursos.includes(action.id)) {
            draft[activeTabId].cursos.push(action.id);
          } else {
            draft[activeTabId].cursos = draft[activeTabId].cursos.filter(
              (i) => i !== action.id,
            );
          }
        } else {
          if (!draft[activeTabId].extra.includes(action.id)) {
            draft[activeTabId].extra.push(action.id);
          } else {
            draft[activeTabId].extra = draft[activeTabId].extra.filter(
              (i) => i !== action.id,
            );
          }
        }
        return;
      case "resetTab":
        draft[action.tabId] = { cursos: [], extra: [] };
        return;
      case "removeTab":
        delete draft[action.tabId];
        return;
      case "removeExtra":
        return Object.fromEntries(
          Object.entries(draft).map(([tabId, { cursos, extra }]) => [
            tabId,
            { cursos, extra: extra.filter((i) => i !== action.id) },
          ]),
        );
      case "removeCursos":
        return Object.fromEntries(
          Object.entries(draft).map(([tabId, { cursos, extra }]) => [
            tabId,
            { cursos: cursos.filter((i) => !action.ids.includes(i)), extra },
          ]),
        );
      case "removeAllExtra":
        return Object.fromEntries(
          Object.entries(draft).map(([tabId, { cursos, _extra }]) => [
            tabId,
            { cursos, extra: [] },
          ]),
        );
    }
  };

  const [tabEvents, tabEventsDispatch] = useImmerReducer(
    tabEventsReducer,
    { 0: { cursos: [], extra: [] } },
    (defvalue) => initialTabEvents(defvalue, getters),
  );

  // ESTADO 4: Los horarios extracurriculares que agrega el usuario, y el nombre que les puso
  const extraEventsReducer = (draft, action) => {
    // eslint-disable-next-line default-case
    switch (action.type) {
      case "add":
        return void draft.push({
          id: action.event.id,
          start: action.event.start,
          end: action.event.end,
          title: action.event.title,
        });
      case "rename":
        return void (draft.find((t) => t.id === action.id).title =
          action.title);
      case "remove":
        return draft.filter((t) => t.id !== action.id);
      case "reset":
        return [];
    }
  };

  const [extraEvents, extraEventsDispatch] = useImmerReducer(
    extraEventsReducer,
    [],
    initialExtraEvents,
  );

  const applyHorariosSIU = async (rawdata) => {
    let horarios;
    try {
      horarios = await parseSIU(rawdata);
      if (!horarios.materias.length || !horarios.cursos.length) {
        throw new Error("No se encontraron cursos en el archivo");
      }
    } catch (e) {
      console.warn(e);
      throw new Error("Error al parsear los horarios del SIU");
    }

    // Limpiamos todas las materias seleccionadas por el usuario
    selections.materias.forEach((codigo) => {
      toggleMateria(codigo);
    });
    setHorariosSIU(horarios);
  };

  const removeHorariosSIU = () => {
    // Limpiamos todas las materias seleccionadas por el usuario
    selections.materias.forEach((codigo) => {
      toggleMateria(codigo);
    });
    setHorariosSIU(null);
  };

  // El estado que se guarda y determina el permalink es el `savedata` del usuario
  const savedata = React.useMemo(() => {
    return {
      selections,
      tabEvents,
      tabs,
      extraEvents,
      horariosSIU,
    };
  }, [
    JSON.stringify(selections),
    JSON.stringify(tabEvents),
    JSON.stringify(tabs),
    JSON.stringify(extraEvents),
    JSON.stringify(horariosSIU),
  ]);

  // Si venimos de un permalink, estamos en una sesion de read - only hasta que el usuario quiera pisar los datos
  const [readOnly, setReadOnly] = React.useState(!!permalinksavedata);

  const permalink = React.useMemo(() => {
    // json => pako => b64 => hash
    const savedataPako = pako.gzip(JSON.stringify(savedata), { to: "string" });
    const savedatab64 = Buffer.from(savedataPako).toString("base64");
    return `https://fede.dm/FIUBA-Plan/#${savedatab64}`;
  }, [JSON.stringify(savedata)]);

  React.useEffect(() => {
    if (readOnly) return;
    window.localStorage.setItem("fiubaplan", JSON.stringify(savedata));
  }, [JSON.stringify(savedata), readOnly]);

  // INTERFACES DE CADA ESTADO

  // Tildar/destildar cursos, carreras y materias
  const select = (type, item) => {
    setSelections((draft) => {
      const arr = draft[type];
      if (arr.includes(item)) {
        draft[type] = draft[type].filter((i) => i && i !== item);
      } else {
        arr.push(item);
      }
    });
  };

  const toggleCarrera = (nombre) => {
    select("carreras", nombre);
  };

  const toggleMateria = (codigo) => {
    if (selections.materias.includes(codigo)) {
      // Si destildamos una materia, removemos todos sus eventos
      const ids = getters.getCursosMateria(codigo).map((c) => c.codigo);
      tabEventsDispatch({ type: "removeCursos", ids });
    } else {
      // Si tildamos una materia, agregamos el primer curso
      toggleCurso(getters.getCursosMateria(codigo)[0].codigo);
    }
    select("materias", codigo);
  };

  const toggleCurso = (codigo) => {
    tabEventsDispatch({ type: "select", id: codigo, tabId: activeTabId });
  };

  // Agregar, eliminar, renombrar horarios extras
  const addExtra = ({ start, end }) => {
    // We don't want simple clicks to trigger the creation of an event
    // Limiting the time event to at least 60 minutes means the user dragged the mouse, instead of just clicking
    const minutes = Math.floor((end - start) / 1000 / 60);
    if (minutes < 60) return;

    const id = start.getTime() + end.getTime() + Math.random() * 100;
    const randomLetter = String.fromCharCode(
      65 + Math.floor(id % 23) + Math.floor(id % 3),
    );
    const title = `ACTIVIDAD ${randomLetter}`;

    extraEventsDispatch({ type: "add", event: { start, end, id, title } });
    toggleExtra(id);
  };

  const toggleExtra = (id) => {
    tabEventsDispatch({ type: "select", id });
  };

  const removeExtra = (id) => {
    if (tabEvents[activeTabId].extra.includes(id)) {
      toggleExtra(id);
    }
    tabEventsDispatch({ type: "removeExtra", id });
    extraEventsDispatch({ type: "remove", id });
  };

  const removeExtraFromTab = (id) => {
    const tabs = Object.values(tabEvents).filter((tab) =>
      tab.extra.includes(id),
    );
    if (tabs.length === 1) {
      removeExtra(id);
    } else {
      toggleExtra(id);
    }
  };

  const renameExtra = (id, str) => {
    extraEventsDispatch({
      type: "rename",
      id: id,
      title: str.trim() || "EXTRA",
    });
  };

  const removeAllExtra = () => {
    tabEventsDispatch({ type: "removeAllExtra" });
    extraEventsDispatch({ type: "reset" });
  };

  // Agregar, eliminar, renombrar tabs
  const limpiarTab = () => {
    tabEventsDispatch({ type: "resetTab", tabId: activeTabId });
  };

  const selectTab = (id) => {
    setActiveTabId(id);
  };

  const addTab = () => {
    const ids = tabs.map((t) => t.id);
    let id = 0;
    while (ids.includes(id)) {
      id += 1;
    }
    tabsDispatch({ type: "add", id });
    tabEventsDispatch({ type: "resetTab", tabId: id });
  };

  const renameTab = (id, title) => {
    tabsDispatch({ type: "rename", id, title });
  };

  const removeTab = (id) => {
    selectTab(0);
    tabsDispatch({ type: "remove", id });
    tabEventsDispatch({ type: "removeTab", tabId: id });
  };

  // Los eventos a mostrar en el calendario son todos los cursos seleccionados por el usuario
  // y los horarios extracurriculares que esten presentes en la tab actual
  const events = React.useMemo(() => {
    const extraevents = tabEvents[activeTabId].extra.map((ev) => {
      const event = extraEvents.find((e) => e.id === ev);
      const title = event.title;
      const subtitle = "ACTIVIDAD EXTRACURRICULAR";
      const tooltip = `${title}\n${subtitle}`;

      return {
        start: event.start,
        end: event.end,
        id: event.id,
        title,
        subtitle,
        tooltip,
        curso: null,
      };
    });

    const clases = tabEvents[activeTabId].cursos
      .map(getters.getCurso)
      .flatMap((curso) => {
        const materia = getters.getMateria(curso.materia);
        return curso.clases.map((clase) => {
          const inicio = new Date(2018, 0, clase.dia);
          const [inicioHora, inicioMinutos] = clase.inicio.split(":");
          inicio.setHours(inicioHora, inicioMinutos);
          const fin = new Date(2018, 0, clase.dia);
          const [finHora, finMinutos] = clase.fin.split(":");
          fin.setHours(finHora, finMinutos);
          const title = `[${materia.codigo}] ${materia.nombre}`;
          const subtitle = curso.docentes;
          const tooltip = `[${materia.codigo}] ${materia.nombre}\n${curso.docentes}`;

          return {
            start: inicio,
            end: fin,
            id: curso.clases + curso.codigo + curso.docentes,
            title,
            subtitle,
            tooltip,
            curso: curso.codigo,
          };
        });
      });

    if (extraEvents.length === 0) return clases;
    return [...clases, ...extraevents];
  }, [activeTabId, extraEvents, JSON.stringify(tabEvents)]);

  const materiasToShow = React.useMemo(() => {
    let codigos = [];

    if (horariosSIU) codigos = horariosSIU.materias.map((m) => m.codigo);
    const codigosUnicos = [...new Set(codigos)].sort();
    const res = codigosUnicos
      .filter(getters.ValidMateria)
      .map(getters.getMateria);

    return res;
  }, [horariosSIU]);

  return {
    selections,
    activeTabId,
    tabs,
    extraEvents,
    readOnly,
    setReadOnly,
    permalink,
    toggleCarrera,
    toggleMateria,
    toggleCurso,
    addExtra,
    toggleExtra,
    removeExtra,
    removeExtraFromTab,
    renameExtra,
    removeAllExtra,
    limpiarTab,
    selectTab,
    addTab,
    renameTab,
    removeTab,
    events,
    horariosSIU,
    applyHorariosSIU,
    removeHorariosSIU,
    materiasToShow,
    getters,
  };
};

const getFromStorage = (key, group = undefined) => {
  const json = JSON.parse(window.localStorage.getItem("fiubaplan"));

  return group ? json?.[group]?.[key] : json?.[key];
};

// STATE INITIALIZERS: le pasamos una funcion a useState/useReducer/useImmer/useImmerReducer para evitar que se ejecuten en cada render
const initialSelections = (getters) => {
  return {
    carreras:
      permalinksavedata?.selections.carreras ||
      getFromStorage("carreras", "selections") ||
      [],
    materias:
      permalinksavedata?.selections.materias?.filter(getters.ValidMateria) ||
      getFromStorage("materias", "selections")?.filter(getters.ValidMateria) ||
      [],
  };
};

const initialTabs = (defvalue) => {
  return permalinksavedata?.tabs || getFromStorage("tabs") || defvalue;
};

const initialTabEvents = (defvalue, getters) => {
  const tabEvents =
    permalinksavedata?.tabEvents || getFromStorage("tabEvents") || defvalue;
  return Object.fromEntries(
    Object.entries(tabEvents).map(([tabid, { cursos, extra }]) => [
      tabid,
      { cursos: cursos.filter(getters.ValidCurso), extra },
    ]),
  );
};

const initialExtraEvents = (defvalue) => {
  const coerceExtraEvent = (e) => ({
    ...e,
    start: new Date(e.start),
    end: new Date(e.end),
  });
  return (
    permalinksavedata?.extraEvents?.map(coerceExtraEvent) ||
    getFromStorage("extraEvents")?.map(coerceExtraEvent) ||
    defvalue
  );
};

const initialHorariosSIU = () => {
  return (
    permalinksavedata?.horariosSIU || getFromStorage("horariosSIU") || null
  );
};

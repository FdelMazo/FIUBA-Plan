import React from "react";
import { data as jsonData } from "./data/horarios";
import { randomColor } from "./utils/colorHelper";

const useGraph = () => {
  const [data, setData] = React.useState(jsonData);
  const [events, setEvents] = React.useState([]);

  const toggleCarrera = (item) => {
    const newData = JSON.parse(JSON.stringify(data));
    const carrera = newData.carreras.find((c) => c.nombre === item.nombre);
    const v = !!carrera.show;
    carrera.show = !v;

    const materiasAMostrar = new Set(
      newData.carreras
        .filter((c) => c?.show)
        .reduce((arr, c) => arr.concat(...c.materias), [])
    );
    const materiasShown = data.materias.filter((_, index) =>
      materiasAMostrar.has(index)
    );

    const materiasNotShown = newData.materias.filter(
      (_, index) => !materiasAMostrar.has(index)
    );
    materiasShown.forEach((m) => (m.show = true));
    materiasNotShown.forEach((m) => (m.show = false));
    newData.materias = [...materiasShown, ...materiasNotShown];
    setData(newData);
  };

  const agregarMateria = (item) => {
    const newData = JSON.parse(JSON.stringify(data));
    const materia = newData.materias.find((m) => m.nombre === item.nombre);
    materia.visible = true;
    setData(newData);
  };

  const removerMateria = (item) => {
    const newData = JSON.parse(JSON.stringify(data));
    const materia = newData.materias.find((m) => m.nombre === item.nombre);
    materia.visible = false;
    materia.cursos.forEach((c) => {
      c.show = false;
    });
    const cursos = materia.cursos.map((c) => c.docentes);
    setEvents(events.filter((e) => !cursos.includes(e.docentes)));

    setData(newData);
  };

  const toggleCurso = (materia, item) => {
    const newData = JSON.parse(JSON.stringify(data));

    const curso = data.materias
      .find((m) => m.nombre === materia.nombre)
      .cursos.find((c) => c.docentes === item.docentes);
    const v = !!curso.show;
    if (v) {
      const curso = newData.materias
        .find((m) => m.nombre === materia.nombre)
        .cursos.find((c) => c.docentes === curso.docentes);

      curso.show = false;

      const addEvents = events.filter((e) => e.docentes !== curso.docentes);

      setEvents(addEvents);
    } else {
      const curso = newData.materias
        .find((m) => m.nombre === materia.nombre)
        .cursos.find((c) => c.docentes === item.docentes);

      curso.show = true;
      curso.color = randomColor(10);

      // +10 only for test data. Remove once it hits prod!!
      const addEvents = curso.clases.map((clase) => ({
        start: new Date(2018, 0, clase.dia, clase.inicio + 10),
        end: new Date(2018, 0, clase.dia, clase.fin + 10),
        title: curso.docentes,
        docentes: curso.docentes,
        color: curso.color,
      }));
      setEvents([...events, ...addEvents]);
    }

    setData(newData);
  };

  return {
    data,
    events,
    toggleCarrera,
    agregarMateria,
    toggleCurso,
    removerMateria,
  };
};

export default useGraph;

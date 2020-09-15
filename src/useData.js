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

    const materiasShown = data.materias.filter((m) =>
      materiasAMostrar.has(m.codigo)
    );
    const materiasNotShown = newData.materias.filter(
      (m) => !materiasAMostrar.has(m.codigo)
    );

    materiasShown.forEach((m) => (m.show = true));
    materiasNotShown.forEach((m) => (m.show = false));
    newData.materias = [...materiasShown, ...materiasNotShown];
    newData.materias.sort((a, b) => a.codigo > b.codigo);
    setData(newData);
  };

  const agregarMateria = (item) => {
    const newData = JSON.parse(JSON.stringify(data));
    const materia = newData.materias.find((m) => m.nombre === item.nombre);
    materia.visible = true;
    const idPrimerCurso = materia.cursos[0];
    const curso = newData.cursos.find((c) => c.codigo === idPrimerCurso);
    curso.show = true;
    curso.color = randomColor(10);

    const addEvents = curso.clases.map((clase) => {
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
        title: curso.docentes,
        color: curso.color,
        materia: materia.nombre,
      };
    });
    setEvents([...events, ...addEvents]);
    setData(newData);
  };

  const removerMateria = (item) => {
    const newData = JSON.parse(JSON.stringify(data));
    const materia = newData.materias.find((m) => m.nombre === item.nombre);
    materia.visible = false;
    
    const cursos = materia.cursos;

    cursos.forEach((codigo) => {
      const curso = newData.cursos.find((c) => c.codigo === codigo);
      const v = !!curso.show;
      if(v){
        curso.show = false;
      }
    });

    setEvents(events.filter((e) => !materia.cursos.includes(e.codigo)));
    setData(newData);
  };

  const toggleCurso = (item, materia) => {
    const newData = JSON.parse(JSON.stringify(data));

    const curso = newData.cursos.find((c) => c.codigo === item.codigo);
    const v = !!curso.show;
    if (v) {
      curso.show = false;
      const addEvents = events.filter((e) => e.codigo !== curso.codigo);
      setEvents(addEvents);
    } else {
      curso.show = true;
      curso.color = randomColor(10);

      const addEvents = curso.clases.map((clase) => {
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
          title: curso.docentes,
          color: curso.color,
          materia: materia.nombre,
        };
      });
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

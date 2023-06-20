import ColorHash from "color-hash";
import { data as jsonData } from "./data/horarios";
import { carreras as jsonCarreras } from "./data/carreras";

export const colorHash = new ColorHash({
  lightness: [0.6, 0.65, 0.7, 0.75, 0.8, 0.85],
  saturation: [0.6, 0.65, 0.7, 0.75, 0.8, 0.85],
});

export const ValidCurso = (codigo) => {
  return !!jsonData.cursos.find((c) => c.codigo === codigo)?.clases?.length;
};

export const ValidMateria = (codigo) => {
  const materia = jsonData.materias.find(
    (materia) => materia.codigo === codigo
  );
  if (!materia) return false;
  return !!materia.cursos.filter(ValidCurso).length;
};

export const getMateria = (codigo) => {
  return jsonData.materias.find((m) => m.codigo === codigo);
};

export const getCurso = (codigo) => {
  return jsonData.cursos.find((c) => c.codigo === codigo);
};

export const getCarrera = (nombre) => {
  return jsonCarreras.find((c) => c.nombre === nombre);
};

export const getCursosMateria = (codigoMateria) => {
  const cursos = jsonData.materias.find(
    (m) => m.codigo === codigoMateria
  ).cursos;
  return cursos.filter(ValidCurso).map(getCurso);
};

export const getColor = (event) => {
  if (!event) return null
  return colorHash.hex(event.id.toString());
};

export const getFromStorage = (key, group = undefined) => {
  const json = JSON.parse(window.localStorage.getItem("fiubaplan"))
  if (json?.cuatrimestre !== jsonData.cuatrimestre)
    return null;
  return group ? json?.[group]?.[key] : json?.[key];
};

export const coerceExtraEvent = (e) => ({
  ...e,
  start: new Date(e.start),
  end: new Date(e.end),
})

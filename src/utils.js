import ColorHash from "color-hash";
import { useCombobox, useSelect } from "downshift";
import jsonCarreras from "./data/carreras";
import jsonData from "./data/horarios";

const arr = (min, max, int) => {
  const arr = [];
  for (let i = min; i <= max; i += int) {
    arr.push(i);
  }
  return arr;
};

const colorHash = new ColorHash({
  lightness: arr(0.6, 0.85, 0.1),
  saturation: arr(0.6, 0.85, 0.1),
  hash: "bkdr",
});

export const getColor = (event) => {
  if (!event) return null;
  return colorHash.hex(event.id.toString());
};

export const ValidCurso = (codigo) => {
  return !!jsonData.cursos.find((c) => c.codigo === codigo)?.clases?.length;
};

export const ValidMateria = (codigo) => {
  const materia = jsonData.materias.find(
    (materia) => materia.codigo === codigo,
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
    (m) => m.codigo === codigoMateria,
  ).cursos;
  return cursos.filter(ValidCurso).map(getCurso);
};

// Downshift util to not close the menu on an item selection (with click, space or enter)
export function stateReducer(state, actionAndChanges) {
  const { changes, type } = actionAndChanges;
  switch (type) {
    case useCombobox.stateChangeTypes.InputKeyDownEnter:
    case useCombobox.stateChangeTypes.ItemClick:
    case useSelect.stateChangeTypes.ToggleButtonKeyDownEnter:
    case useSelect.stateChangeTypes.ToggleButtonKeyDownSpaceButton:
    case useSelect.stateChangeTypes.ItemClick:
      return {
        ...changes,
        isOpen: true,
        highlightedIndex: state.highlightedIndex,
      };
    default:
      return changes;
  }
}

export async function parseSIU(rawData) {
  // Temporalmente: solo hacer que haya dos cursos de AM2 que pisen todo el resto.
  // TODO: agregar logica de verdad
  return {
    cursos: [
      {
        clases: [
          {
            dia: 2,
            fin: "09:00",
            inicio: "07:00",
          },
          {
            dia: 2,
            fin: "11:00",
            inicio: "09:00",
          },
          {
            dia: 4,
            fin: "09:00",
            inicio: "07:00",
          },
          {
            dia: 4,
            fin: "11:00",
            inicio: "09:00",
          },
        ],
        codigo: "6103-CURSO: 02A",
        docentes:
          "ACERO, FERNANDO RODOLFO - LOPEZ, CLAUDIA ANDREA - ENDELLI, JORGE RODOLFO",
        materia: "6103",
      },
      {
        clases: [
          {
            dia: 2,
            fin: "09:00",
            inicio: "07:00",
          },
          {
            dia: 2,
            fin: "11:00",
            inicio: "09:00",
          },
          {
            dia: 4,
            fin: "09:00",
            inicio: "07:00",
          },
          {
            dia: 4,
            fin: "11:00",
            inicio: "09:00",
          },
        ],
        codigo: "6103-CURSO: 02B",
        docentes:
          "ACERO, FERNANDO RODOLFO - GARCIA, ADRIANA EVA - PORTOCARRERO MIRANDA, MICHAEL",
        materia: "6103",
      },
    ],
    materias: [
      {
        codigo: "6103",
        cursos: ["6103-CURSO: 02A", "6103-CURSO: 02B"],
      },
    ],
  };
}

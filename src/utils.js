import ColorHash from "color-hash";
import { useCombobox, useSelect } from "downshift";

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

export async function parseSIU(rawdata) {
  const pattern = /Actividad:(.*?)(?=(Actividad:|$))/gs;
  const matches = rawdata.matchAll(pattern);
  const semana = [
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ];

  const result = {
    materias: [],
    cursos: [],
  };
  for (const match of matches) {
    const actividad = match[0];
    const materiaPattern = /Actividad:(.*?) \((.+?)\)/;
    const materiaMatch = actividad.match(materiaPattern);
    if (!materiaMatch) {
      continue;
    }
    const materia = {
      nombre: materiaMatch[1],
      codigo: materiaMatch[2],
      cursos: [],
    };

    const cursosPattern =
      /Comisión: (.*)[\s\S]*?Turno:.*Docentes: ([\s\S]*?)Tipo de clase\s+Día\s+Horario\s+Aula([\s\S]*?)(?=(Comisión: CURSO:|$))/g;

    let matchCurso;
    while ((matchCurso = cursosPattern.exec(actividad)) !== null) {
      const codigo = matchCurso[1];
      let docentes = matchCurso[2].trim().replace(/\(.*?\)/g, "");

      const clases = [];
      for (let claseLine of matchCurso[3].trim().split("\n")) {
        if (
          matchCurso[3].includes("Sin definir") ||
          !claseLine.includes("\t")
        ) {
          continue;
        }
        // eslint-disable-next-line no-unused-vars
        const [_tipo, dia, horario, _aula] = claseLine.split("\t");
        const [inicio, fin] = horario.split(" a ");
        const clase = {
          dia: semana.indexOf(dia),
          inicio,
          fin,
        };
        clases.push(clase);
      }
      if (clases.length === 0) {
        continue;
      }
      result.cursos.push({
        materia: materia.codigo,
        codigo,
        docentes,
        clases,
      });
      materia.cursos.push(codigo);
    }
    result.materias.push(materia);
  }
  return result;
}

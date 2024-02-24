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
        nombre: "AnalisisSIU",
      },
    ],
  };
}

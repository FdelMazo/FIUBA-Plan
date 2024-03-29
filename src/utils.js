import { Buffer } from "buffer";
import ColorHash from "color-hash";
import { useCombobox, useSelect } from "downshift";
import pako from "pako";

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

export function base64tojson(data) {
  // b64 => pako => json
  const savedataPako = Buffer.from(data, "base64");
  return JSON.parse(pako.ungzip(savedataPako, { to: "string" }));
}

export function jsontobase64(jsondata) {
  // json => pako => b64
  const savedataPako = pako.gzip(JSON.stringify(jsondata), { to: "string" });
  return Buffer.from(savedataPako).toString("base64");
}

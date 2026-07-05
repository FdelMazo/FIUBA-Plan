import React from "react";
import { getColor } from "../utils";
import ConfigColorPopover from "./ConfigColorPopover";

const ConfigExtra = ({ activeExtras, setColorExtra }) => {
  const getExtraColor = React.useCallback((extra) => {
    if (!extra) {
      return "#ffffff";
    }

    return extra.color ?? getColor({ id: extra.id });
  }, []);

  return (
    <ConfigColorPopover
      configs={activeExtras}
      getConfigId={(extra) => extra?.id}
      getConfigLabel={(extra) => extra.title}
      getColorConfig={getExtraColor}
      onColorChange={(extra, color) => setColorExtra(extra.id, color)}
      title="Configurar actividad"
      emptyLabel="Sin actividades activas"
      emptyConfigLabel="No hay actividad para configurar"
      colorLabel="Seleccionar color de la actividad"
    />
  );
};

export default ConfigExtra;

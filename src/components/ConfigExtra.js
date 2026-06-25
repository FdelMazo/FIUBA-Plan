import React from "react";
import { getColor } from "../utils";
import ConfigColorPopover from "./ConfigColorPopover";

const ConfigExtra = ({ extrasActivas, setColorExtra }) => {
  const getExtraColor = React.useCallback((extra) => {
    if (!extra) {
      return "#ffffff";
    }

    return extra.color ?? getColor({ id: extra.id });
  }, []);

  return (
    <ConfigColorPopover
      items={extrasActivas}
      getItemId={(extra) => extra?.id}
      getItemLabel={(extra) => extra.title}
      getItemColor={getExtraColor}
      onColorChange={(extra, color) => setColorExtra(extra.id, color)}
      title="Configurar actividad"
      emptyLabel="Sin actividades activas"
      emptyConfigLabel="No hay actividad para configurar"
      colorLabel="Seleccionar color de la actividad"
    />
  );
};

export default ConfigExtra;

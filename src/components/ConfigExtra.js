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
      configs={extrasActivas}
      getConfigId={(extra) => extra?.id}
      getConfigLabel={(extra) => extra.title}
      getColorConfig={getExtraColor}
      alCambiarColor={(extra, color) => setColorExtra(extra.id, color)}
      titulo="Configurar actividad"
      labelVacia="Sin actividades activas"
      labelConfigVacia="No hay actividad para configurar"
      labelColor="Seleccionar color de la actividad"
    />
  );
};

export default ConfigExtra;

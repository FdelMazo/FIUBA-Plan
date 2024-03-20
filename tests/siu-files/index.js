import { siuAxelRaw } from "./siu-raw/siu-axel";
import { siuFedeRaw } from "./siu-raw/siu-fede";
import { siuExactasRaw } from "./siu-raw/siu-exactas-computacion-primer-cuatri";

import siuAxelJSON from "./siu-json/siu-axel";
import siuFedeJSON from "./siu-json/siu-fede";
import siuExactasJSON from "./siu-json/siu-exactas-computacion-primer-cuatri";

export const siuAxel = [ "siuAxel", siuAxelRaw, siuAxelJSON ];
export const siuFede = [ "siuFede", siuFedeRaw, siuFedeJSON ];
export const siuExactas = [ "siuExactas", siuExactasRaw, siuExactasJSON ];

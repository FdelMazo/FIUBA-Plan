import { parseSIU } from "../src/siuparser";
import { siuAxelRaw } from "./siu-raw/siu-axel";
import { siuFedeRaw } from "./siu-raw/siu-fede";
import { siuExactasRaw } from "./siu-raw/siu-exactas-computacion-primer-cuatri";
import siuAxelJSON from "./siu-json/siu-axel";
import siuFedeJSON from "./siu-json/siu-fede";
import siuExactasJSON from "./siu-json/siu-exactas-computacion-primer-cuatri";

const sius = [
  ["siuAxel", siuAxelRaw, siuAxelJSON],
  ["siuFede", siuFedeRaw, siuFedeJSON], 
  ["siuExactas", siuExactasRaw, siuExactasJSON]
];

describe.each(sius)("essential tests", (siuName, siuRawData, siuJSON) => {
  const parsedSIU = parseSIU(siuRawData);

  test(`expect ${siuName} parsed siu hasn't changed`, () => {
    siuJSON.forEach((json, index) => {
      json.timestamp = parsedSIU[index].timestamp;
    });
    expect(parsedSIU).toEqual(siuJSON);
  });

  test(`${siuName} periodo is a string`, () => {
    parsedSIU.forEach((periodo) => {
      expect(typeof periodo.periodo).toBe("string");
    });
  });

  test(`${siuName} every materia has a codigo`, () => {
    parsedSIU.forEach((periodo) => {
      periodo.materias.forEach((materia) => {
        expect(typeof materia.codigo).toBe("string");
        expect(materia.codigo.length).toBeGreaterThan(0);
      });
    });
  });

  test(`${siuName} every materia has a name`, () => {
    parsedSIU.forEach((periodo) => {
      periodo.materias.forEach((materia) => {
        expect(typeof materia.nombre).toBe("string");
        expect(materia.nombre.length).toBeGreaterThan(0);
      });
    });
  });

  test(`${siuName} every materia has cursos`, () => {
    parsedSIU.forEach((periodo) => {
      periodo.materias.forEach((materia) => {
        expect(materia.cursos.length).not.toBe(0);

        materia.cursos.forEach((curso) => {
          expect(typeof curso).toBe("string");
          expect(curso.length).toBeGreaterThan(0);
          // es necesario hacer este regex????? que probablemente 
          // se rompa (y lo va a hacer) dependiendo de la facultad
          // expect(curso).toMatch(/\S+-CURSO-?:?\s?\S+/i);
        });
      });
    });
  });

  test(`${siuName} timestamp matches expected`, () => {
    // timestamp is greater than 18/01/2021
    parsedSIU.forEach((periodo) => {
      expect(Number.isInteger(periodo.timestamp)).toBeTruthy();
      expect(periodo.timestamp).toBeGreaterThan(1610950282);
    });
  });
});

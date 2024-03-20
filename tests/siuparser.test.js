import { parseSIU } from "../src/siuparser";
import { siuAxelRaw } from "./siu-raw/siu-axel";
import { siuFedeRaw } from "./siu-raw/siu-fede";
import { siuExactasRaw } from "./siu-raw/siu-exactas-computacion-primer-cuatri";
import siuAxelJSON from "./siu-json/siu-axel";
import siuFedeJSON from "./siu-json/siu-fede";
import siuExactasJSON from "./siu-json/siu-exactas-computacion-primer-cuatri";

describe("siuAxel", () => {
  const parsedSIU = parseSIU(siuAxelRaw);

  test("expect parsedSIU hasn't changed", () => {
    // Tendria que ver una mejor solucion no tan hardcode
    siuAxelJSON[0].timestamp = parsedSIU[0].timestamp;
    expect(parsedSIU).toEqual(siuAxelJSON);
  });

  test("periodo is a string", () => {
    expect(typeof parsedSIU[0].periodo).toBe("string");
  });

  test("periodo matches expected string", () => {
    expect(parsedSIU[0].periodo).toBe("2024 - 1er Cuatrimestre");
  });

  test("there are 26 materias", () => {
    expect(parsedSIU[0].materias.length).toBe(26);
  });

  test("every materia has a codigo", () => {
    parsedSIU[0].materias.forEach((materia) => {
      expect(typeof materia.codigo).toBe("string");
      expect(materia.codigo.length).toBeGreaterThan(0);
    });
  });

  test("every materia has a name", () => {
    parsedSIU[0].materias.forEach((materia) => {
      expect(typeof materia.nombre).toBe("string");
      expect(materia.nombre.length).toBeGreaterThan(0);
    });
  });

  test("every materia has cursos", () => {
    parsedSIU[0].materias.forEach((materia) => {
      expect(materia.cursos.length).not.toBe(0);

      materia.cursos.forEach((curso) => {
        expect(typeof curso).toBe("string");
        expect(curso.length).toBeGreaterThan(0);
        // chequear: algunos no tienen el :, otros no tienen el \s
        expect(curso).toMatch(/\S+-CURSO:?\s?\S+/i);
      });
    });
  });

  test("timestamp matches expected", () => {
    expect(Number.isInteger(parsedSIU[0].timestamp)).toBeTruthy();
    // timestamp is greater than 18/01/2021
    expect(parsedSIU[0].timestamp).toBeGreaterThan(1610950282);
  });
});

describe("siuFede", () => {
  const parsedSIU = parseSIU(siuFedeRaw);

  test("expect parsedSIU hasn't changed", () => {
    siuFedeJSON[0].timestamp = parsedSIU[0].timestamp;
    siuFedeJSON[1].timestamp = parsedSIU[1].timestamp;
    expect(parsedSIU).toEqual(siuFedeJSON);
  });
});

describe("siuExactas", () => {
  const parsedSIU = parseSIU(siuExactasRaw);

  test("expect parsedSIU hasn't changed", () => {
    siuExactasJSON[0].timestamp = parsedSIU[0].timestamp;
    siuExactasJSON[1].timestamp = parsedSIU[1].timestamp;
    siuExactasJSON[2].timestamp = parsedSIU[2].timestamp;
    expect(parsedSIU).toEqual(siuExactasJSON);
  });
});

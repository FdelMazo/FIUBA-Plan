import { siuAxel } from "./siu-files/siu-axel";
import { siuFede } from "./siu-files/siu-fede";
import { siuExactas } from "./siu-files/siu-usuario-exactas-computacion-primer-cuatri";
import { parseSIU } from "../src/siuparser";

describe("siuAxel", () => {
  const parsedSIU = parseSIU(siuAxel)[0]; 

  test("periodo is a string", () => {
    expect(typeof parsedSIU.periodo).toBe("string");
  });

  test("periodo matches expected string", () => {
    expect(parsedSIU.periodo).toBe("2024 - 1er Cuatrimestre");
  });

  test("there are 26 materias", () => {
    expect(parsedSIU.materias.length).toBe(26);
  });
  
  test("every materia has a codigo", () => {
    parsedSIU.materias.forEach(materia => {
      expect(typeof materia.codigo).toBe("string");
      expect(materia.codigo.length).toBeGreaterThan(0);
    });
  })

  test("every materia has a name", () => {
    parsedSIU.materias.forEach(materia => {
      expect(typeof materia.nombre).toBe("string");
      expect(materia.nombre.length).toBeGreaterThan(0);
    });
  });

  test("every materia has cursos", () => {
    parsedSIU.materias.forEach(materia => {
      expect(materia.cursos.length).not.toBe(0);

      materia.cursos.forEach(curso => {
        expect(typeof curso).toBe("string");
        expect(curso.length).toBeGreaterThan(0);
        // chequear: algunos no tienen el :, otros no tienen el \s
        expect(curso).toMatch(/\S+-CURSO:?\s?\S+/i);
      });
    });
  });

  test("timestamp matches expected", () => {
    expect(Number.isInteger(parsedSIU.timestamp)).toBeTruthy();
    // timestamp is greater than 18/01/2021
    expect(parsedSIU.timestamp).toBeGreaterThan(1610950282);
  });
});

describe("siuFede", () => {
  const parsedSIU = parseSIU(siuFede)[0];
});

describe("siuExactas", () => {
  const parsedSIU = parseSIU(siuExactas)[0];
});

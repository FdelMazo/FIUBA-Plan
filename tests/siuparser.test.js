import { siuAxel, siuFede, siuExactas } from "./siu-files";
import { parseSIU } from "../src/siuparser";

const sius = [ siuAxel, siuFede, siuExactas ];

describe.each(sius)("essential tests", (siuName, siuRawData, siuJSON) => {
  console.debug = jest.fn(); // Deshabilitar el debugging que se usa en el browser
  const parsedSIU = parseSIU(siuRawData);

  test(`${siuName} parsed siu does not change`, () => {
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

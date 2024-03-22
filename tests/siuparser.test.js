import path from "node:path";
import fs from "node:fs";
import { parseSIU } from "../src/siuparser";

const directoryPath = path.dirname(__filename);
const siusNames = fs
  .readdirSync(path.join(directoryPath), "siu-json")
  .map((f) => path.parse(f).name);

const sius = siusNames.map((siuName) => {
  const siuRawDataPath = path.join(directoryPath, "siu-raw", `${siuName}.js`);
  const siuJSONPath = path.join(directoryPath, "siu-json", `${siuName}.json`);

  const siuRawData = fs.readFileSync(siuRawDataPath, "utf8");
  const siuJSONData = JSON.parse(fs.readFileSync(siuJSONPath, "utf8"));

  return [siuName, siuRawData, siuJSONData];
});

describe.each(sius)("siu parser tests", (siuName, siuRawData, siuJSON) => {
  console.debug = jest.fn(); // Deshabilitar el debugging que se usa en el browser
  const parsedSIU = parseSIU(siuRawData);

  // Testear que los sius parseados no hayan cambiado en comparacion
  // con una copia anterior en JSON
  test(`${siuName} parsed siu does not change`, () => {
    siuJSON.forEach((json, index) => {
      json.timestamp = parsedSIU[index].timestamp;
    });

    expect(parsedSIU).toEqual(siuJSON);
  });

  // Recursivamente testear que no haya ninguna string o array vacios
  test(`${siuName} parsed siu has not empty strings nor arrays`, () => {
    const recursiveTest = (obj) => {
      for (const prop in obj) {
        if (!obj.hasOwnProperty(prop)) continue;
        if (typeof obj[prop] === "string")
          expect(obj[prop].length).toBeGreaterThan(0);
        else {
          if (Array.isArray(obj[prop]))
            expect(obj[prop].length).toBeGreaterThan(0);
          if (typeof obj[prop] === "object" && typeof obj[prop] !== null)
            recursiveTest(obj[prop]);
        }
      }
    };

    recursiveTest(parsedSIU);
  });

  // Testear que el nombre de cada periodo no sea una string vacia
  test(`${siuName} periodo is a non-empty string`, () => {
    parsedSIU.forEach((periodo) => {
      expect(typeof periodo.periodo).toBe("string");
      expect(periodo.periodo.length).toBeGreaterThan(0);
    });
  });

  // Testear que cada periodo no tenga ni materias ni cursos vacios
  test(`${siuName} periodos materias and cursos is not empty`, () => {
    parsedSIU.forEach((periodo) => {
      expect(periodo.materias.length).toBeGreaterThan(0);
      expect(periodo.cursos.length).toBeGreaterThan(0);
    });
  });

  // Testear que no hayan materias ni cursos con codigos repetidos
  test.each([["materias"], ["cursos"]])(
    `${siuName} periodos has not repeated %s codigos`,
    (prop) => {
      parsedSIU.forEach((periodo) => {
        const codigosArray = periodo[prop].map((m) => {
          return m.codigo;
        });
        const hasRepeatedCodigos = codigosArray.some((codigo, index, array) => {
          return array.indexOf(codigo) !== index;
        });
        expect(hasRepeatedCodigos).toBeFalsy();
      });
    },
  );

  // Testear que no hayan materias con el nombre o codigo vacios
  test.each([["codigo"], ["nombre"]])(
    `${siuName} every materia has a %s`,
    (prop) => {
      parsedSIU.forEach((periodo) => {
        periodo.materias.forEach((materia) => {
          expect(typeof materia[prop]).toBe("string");
          expect(materia[prop].length).toBeGreaterThan(0);
        });
      });
    },
  );

  // Testear en cada periodo, que los cursos de cada materia existan en
  // los cursos globales
  test(`${siuName} every materia cursos exists in global cursos`, () => {
    const globalCodigos = parsedSIU
      .map((periodo) => {
        return periodo.cursos.map((curso) => curso.codigo);
      })
      .flat(Infinity);

    parsedSIU.forEach((periodo) => {
      periodo.materias.forEach((materia) => {
        materia.cursos.forEach((codigoCurso) => {
          expect(globalCodigos.includes(codigoCurso)).toBeTruthy();
        });
      });
    });
  });

  // Testear en cada periodo, que cada curso global sea el curso de
  // alguna materia
  test(`${siuName} every global curso exists in a materia cursos`, () => {
    const cursosCodigos = parsedSIU
      .map((periodo) => {
        return periodo.materias.map((materia) => materia.cursos);
      })
      .flat(Infinity);

    parsedSIU.forEach((periodo) => {
      periodo.cursos.forEach((curso) => {
        expect(cursosCodigos.includes(curso.materia));
      });
    });
  });

  // Testear que cada materia tiene cursos
  test(`${siuName} every materia has cursos`, () => {
    parsedSIU.forEach((periodo) => {
      periodo.materias.forEach((materia) => {
        expect(materia.cursos.length).not.toBe(0);

        materia.cursos.forEach((curso) => {
          expect(typeof curso).toBe("string");
          expect(curso.length).toBeGreaterThan(0);
        });
      });
    });
  });

  // Testear que el dia de cada clase este en el intervalo del 1 al 6
  // (lunes a sabado)
  test(`${siuName} every class allows expected weekdays`, () => {
    parsedSIU.forEach((periodo) => {
      periodo.cursos.forEach((curso) => {
        curso.clases.forEach((clase) => {
          expect(clase.dia).toBeGreaterThanOrEqual(1);
          expect(clase.dia).toBeLessThanOrEqual(6);
        });
      });
    });
  });

  // Testear que el horario de cada clase cumpla con el formato "hora:hora"
  test(`${siuName} every class allows expected horarios`, () => {
    parsedSIU.forEach((periodo) => {
      periodo.cursos.forEach((curso) => {
        curso.clases.forEach((clase) => {
          ["inicio", "fin"].forEach((prop) => {
            expect(typeof clase[prop]).toBe("string");
            expect(clase[prop]).toMatch(/[0-9]{1,2}:[0-9]{1,2}/);
          });
        });
      });
    });
  });

  // Testear que el timestamp de cada periodo es mayor al 14/11/2023
  test(`${siuName} timestamp matches expected`, () => {
    parsedSIU.forEach((periodo) => {
      expect(Number.isInteger(periodo.timestamp)).toBeTruthy();
      expect(periodo.timestamp).toBeGreaterThan(1700000000);
    });
  });
});

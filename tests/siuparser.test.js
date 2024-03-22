import path from "node:path";
import fs from "node:fs";
import { parseSIU } from "../src/siuparser";


const directoryPath = path.join(path.dirname(__filename), "siu-json");
const siusNames = fs.readdirSync(directoryPath).map((f) => path.parse(f).name);

const sius = siusNames.map((siuName) => {
  const siuRawDataPath = path.join(path.dirname(__filename), "siu-raw", `${siuName}.js`);
  const siuJSONPath = path.join(path.dirname(__filename), "siu-json", `${siuName}.json`);

  const siuRawData = fs.readFileSync(siuRawDataPath, "utf8");
  const siuJSONData = JSON.parse(fs.readFileSync(siuJSONPath, "utf8"));

  return [siuName, siuRawData, siuJSONData];
});

describe.each(sius)("essential tests", (siuName, siuRawData, siuJSON) => {
  console.debug = jest.fn(); // Deshabilitar el debugging que se usa en el browser
  const parsedSIU = parseSIU(siuRawData);

  test(`${siuName} parsed siu does not change`, () => {
    siuJSON.forEach((json, index) => {
      json.timestamp = parsedSIU[index].timestamp;
    });
    expect(parsedSIU).toEqual(siuJSON);
  });

  // test(`${siuName} parsed siu has not empty strings nor arrays`, () => {
  //   const recursive = (obj) => {
  //     for (const prop in obj) {
  //       if (!obj.hasOwnProperty(prop)) {
  //         continue;
  //       } else if (typeof obj[prop] === "object" && obj[prop] !== null) {
  //         recursive(obj);
  //       } else if (typeof obj[prop] === "string") {
  //         expect(obj[prop].length).toBeGreaterThan(0);
  //       }
  //     }
  //   };
  //   recursive(parsedSIU);
  // });

  test(`${siuName} periodo is a non-empty string`, () => {
    parsedSIU.forEach((periodo) => {
      expect(typeof periodo.periodo).toBe("string");
      expect(periodo.periodo.length).toBeGreaterThan(0);
    });
  });

  test(`${siuName} periodos materias and cursos is not empty`, () => {
    parsedSIU.forEach((periodo) => {
      expect(periodo.materias.length).toBeGreaterThan(0);
      expect(periodo.cursos.length).toBeGreaterThan(0);
    });
  });

  test.each([["materias"], ["cursos"]])(
    `${siuName} periodos has not repeated %s codigos`, (prop) => {
      parsedSIU.forEach((periodo) => {
        const codigosArray = periodo[prop].map((m) => { return m.codigo });
        const hasRepeatedCodigos = codigosArray.some((codigo, index, array) => {
          return array.indexOf(codigo) !== index;
        });
        expect(hasRepeatedCodigos).toBeFalsy();
      });
    });

  test.each([["codigo"], ["nombre"]])(
    `${siuName} every materia has a %s`, (prop) => {
      parsedSIU.forEach((periodo) => {
        periodo.materias.forEach((materia) => {
          expect(typeof materia[prop]).toBe("string");
          expect(materia[prop].length).toBeGreaterThan(0);
        });
      });
    }
  )

  test(`${siuName} every materia cursos exists in global cursos`, () => {
    const globalCodigos = parsedSIU.map((periodo) => {
      return periodo.cursos.map((curso) => curso.codigo);
    }).flat(Infinity);

    parsedSIU.forEach((periodo) => {
      periodo.materias.forEach((materia) => {
        materia.cursos.forEach((codigoCurso) => {
          expect(globalCodigos.includes(codigoCurso)).toBeTruthy();
        });
      });
    });
  });

  test(`${siuName} every global curso exists in a materia cursos`, () => {
    const cursosCodigos = parsedSIU.map((periodo) => {
      return periodo.materias.map((materia) => materia.cursos);
    }).flat(Infinity);

    parsedSIU.forEach((periodo) => {
      periodo.cursos.forEach((curso) => {
        expect(cursosCodigos.includes(curso.materia));
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
        });
      });
    });
  });

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

  test(`${siuName} timestamp matches expected`, () => {
    // timestamp is greater than 18/01/2021
    parsedSIU.forEach((periodo) => {
      expect(Number.isInteger(periodo.timestamp)).toBeTruthy();
      expect(periodo.timestamp).toBeGreaterThan(1610950282);
    });
  });
});

import path from "node:path";
import fs from "node:fs";
import { parseSIU } from "../src/siuparser";


const directoryPath = path.join(path.dirname(__filename), "siu-files", "siu-json");
const siusNames = fs.readdirSync(directoryPath).map((f) => path.parse(f).name);

const sius = siusNames.map((siuName) => {
  const siuRawDataPath = path.join(path.dirname(__filename), "siu-files", "siu-raw", `${siuName}.js`);
  const siuJSONPath = path.join(path.dirname(__filename), "siu-files", "siu-json", `${siuName}.json`);

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

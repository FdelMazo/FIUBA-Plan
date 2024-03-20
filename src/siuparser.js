const SEMANA = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
];

export function parseSIU(rawdata) {
  // Asegurarse:
  // - no agregar ningun curso sin clases
  // - no agregar ninguna materia sin cursos asociados
  // - no agregar periodos sin materias

  const result = [];

  const periodoPattern =
    /Período lectivo: ([^\n]+)\n[\s\S]*?(?=Período lectivo:|$)/g;
  const materiaPattern =
    /Actividad: ([^\n]+) \((.+?)\)\n[\s\S]*?(?=Actividad:|$)/g;
  const cursosPattern =
    /Comisión: ([^\n]+)[\s\S]*?Docentes: ([^\n]+)[\s\S]*?Tipo de clase\s+Día\s+Horario\s+Aula([\s\S]*?)(?=Comisión:|$)/g;

  const periodos = [];
  for (const periodoMatch of rawdata.matchAll(periodoPattern)) {
    const periodoFullText = periodoMatch[0];
    const periodoNombre = periodoMatch[1];

    console.debug(`Found periodo: ${periodoNombre}`)
    periodos.push({
      periodo: periodoNombre,
      raw: periodoFullText,
      materias: [],
      cursos: [],
    });
  }

  for (let periodo of periodos) {
    for (const materiaMatch of periodo.raw.matchAll(materiaPattern)) {
      const materiaFullText = materiaMatch[0];
      const materia = {
        nombre: materiaMatch[1],
        codigo: materiaMatch[2],
        cursos: [],
      };
      console.debug(`- Found materia: ${materia.nombre} (${materia.codigo})`)

      for (const cursoMatch of materiaFullText.matchAll(cursosPattern)) {
        const cursoCodigo = `${materia.codigo}-${cursoMatch[1]}`;
        const cursoDocentes = cursoMatch[2].trim().replace(/\(.*?\)/g, "");
        console.debug(`-- Found curso: ${cursoCodigo}`)

        const clases = [];
        for (let claseLine of cursoMatch[3].trim().split("\n")) {
          console.debug(`--- Found clase: ${claseLine}`)
          if (!SEMANA.some(day => claseLine.includes(day))) {
            continue;
          }

          // eslint-disable-next-line no-unused-vars
          const [_tipo, dia, horario, _aula] = claseLine.split("\t");
          const [inicio, fin] = horario.split(" a ");
          const clase = {
            dia: SEMANA.indexOf(dia),
            inicio,
            fin,
          };
          clases.push(clase);
        }

        if (clases.length === 0) {
          continue;
        }

        periodo.cursos.push({
          materia: materia.codigo,
          codigo: cursoCodigo,
          docentes: cursoDocentes,
          clases,
        });
        materia.cursos.push(cursoCodigo);
      }

      if (materia.cursos.length === 0) {
        continue;
      }
      periodo.materias.push(materia);
    }

    if (periodo.materias.length === 0) {
      continue;
    }
    result.push({
      periodo: periodo.periodo,
      materias: periodo.materias,
      cursos: periodo.cursos,
      timestamp: Date.now(),
    });
  }
  console.debug(result);
  console.debug(JSON.stringify(result));
  return result;
}

export async function parseSIU(rawdata) {
  const pattern = /Actividad:(.*?)(?=(Actividad:|$))/gs;
  const matches = rawdata.matchAll(pattern);
  const semana = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ];

  const result = {
    materias: [],
    cursos: [],
  };
  for (const match of matches) {
    const actividad = match[0];
    const materiaPattern = /Actividad:(.*?) \((.+?)\)/;
    const materiaMatch = actividad.match(materiaPattern);
    if (!materiaMatch) {
      continue;
    }
    const materia = {
      nombre: materiaMatch[1],
      codigo: materiaMatch[2],
      cursos: [],
    };

    const cursosPattern =
      /Comisión: ([^\n]+)[\s\S]*?Docentes: ([^\n]+)[\s\S]*?Tipo de clase\s+Día\s+Horario\s+Aula([\s\S]*?)(?=(Comisión:|$))/g;

    let matchCurso;
    while ((matchCurso = cursosPattern.exec(actividad)) !== null) {
      const codigo = `${materia.codigo}-${matchCurso[1]}`;
      let docentes = matchCurso[2].trim().replace(/\(.*?\)/g, "");

      const clases = [];
      for (let claseLine of matchCurso[3].trim().split("\n")) {
        if (
          matchCurso[3].includes("Sin definir") ||
          !claseLine.includes("\t")
        ) {
          continue;
        }
        // eslint-disable-next-line no-unused-vars
        const [_tipo, dia, horario, _aula] = claseLine.split("\t");
        const [inicio, fin] = horario.split(" a ");
        const clase = {
          dia: semana.indexOf(dia),
          inicio,
          fin,
        };
        clases.push(clase);
      }
      if (clases.length === 0) {
        continue;
      }
      result.cursos.push({
        materia: materia.codigo,
        codigo,
        docentes,
        clases,
      });
      materia.cursos.push(codigo);
    }
    result.materias.push(materia);
  }
  return result;
}

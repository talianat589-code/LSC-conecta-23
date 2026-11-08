type Props = {
  frase: string;
};

function normalizar(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("es-CO")
    .replace(/[¿?¡!.,;:()[\]{}"'“”]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export default function LSCContextAnalysis({
  frase,
}: Props) {
  const texto = frase.trim();
  const normalizada = normalizar(texto);
  const palabras = normalizada.split(" ").filter(Boolean);

  if (!texto) {
    return (
      <section className="lsc-context-analysis">
        <h3>Análisis contextual del mensaje</h3>
        <p>
          Habla o escribe una frase para analizar sus
          posibles características comunicativas.
        </p>
      </section>
    );
  }

  const marcadoresPregunta = [
    "que",
    "como",
    "donde",
    "cuando",
    "quien",
    "cual",
    "cuanto",
    "por que",
  ];

  const marcadoresNegacion = [
    "no",
    "nunca",
    "jamas",
    "tampoco",
  ];

  const contieneExpresion = (expresion: string) =>
  (` ${normalizada} `).includes(` ${expresion} `);

  const esPregunta =
    /[¿?]/.test(texto) ||
    marcadoresPregunta.some(contieneExpresion);

  const negacionesDetectadas =
    marcadoresNegacion.filter((palabra) =>
      palabras.includes(palabra)
    );

  const intenciones: string[] = [];

  if (
    contieneExpresion("hola") ||
    contieneExpresion("buenos dias") ||
    contieneExpresion("buenas noches")
  ) {
    intenciones.push("Posible saludo");
  }

  if (contieneExpresion("gracias")) {
    intenciones.push("Posible agradecimiento");
  }

  if (
    contieneExpresion("por favor") ||
    contieneExpresion("necesito") ||
    contieneExpresion("quiero") ||
    contieneExpresion("puedes") ||
    contieneExpresion("podrias") ||
    contieneExpresion("ayudame")
  ) {
    intenciones.push("Posible solicitud o petición");
  }

  if (contieneExpresion("si")) {
    intenciones.push("Posible respuesta afirmativa");
  }

  if (
    negacionesDetectadas.includes("no") &&
    palabras.length <= 4
  ) {
    intenciones.push("Posible respuesta negativa");
  }

  if (intenciones.length === 0) {
    intenciones.push(
      "Intención comunicativa no identificada con estas reglas"
    );
  }

  return (
    <section className="lsc-context-analysis">
      <h3>Análisis contextual del mensaje</h3>

      <div>
        <h4>Tipo de expresión</h4>

        <p>
          {esPregunta
            ? "Se detectaron indicadores de una posible pregunta."
            : "No se detectaron indicadores claros de pregunta."}
        </p>
      </div>

      <div>
        <h4>Negación</h4>

        {negacionesDetectadas.length > 0 ? (
          <>
            <p>
              Palabras detectadas:{" "}
              {negacionesDetectadas.join(", ")}
            </p>

            <p>
              El alcance y el significado completo de la
              negación todavía no están determinados.
            </p>
          </>
        ) : (
          <p>No se detectaron marcadores de negación.</p>
        )}
      </div>

      <div>
        <h4>Posible intención comunicativa</h4>

        <ul>
          {intenciones.map((intencion) => (
            <li key={intencion}>{intencion}</li>
          ))}
        </ul>
      </div>

      <div>
        <h4>Alcance del análisis</h4>

        <p>
          Estos resultados proceden de reglas de detección
          textual. No representan una interpretación
          semántica completa ni una traducción validada
          a Lengua de Señas Colombiana.
        </p>
      </div>
    </section>
  );
}
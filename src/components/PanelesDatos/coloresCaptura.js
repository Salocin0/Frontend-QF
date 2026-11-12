// html2canvas 1.4 only understands rgb()/rgba()/hsl()/hsla() and named colors. The dashboards use color-mix(),
// which browsers compute as color(srgb ...), oklab(...) and similar: html2canvas throws on them and the PDF fails.
// Before capturing, every unsupported computed color of the cloned dashboard is rewritten inline as rgba().

const NO_SOPORTADO = /color-mix\(|color\(|oklch\(|oklab\(|\blab\(|\blch\(|hwb\(/i;

export const PROPIEDADES_COLOR = [
  "color",
  "backgroundColor",
  "borderTopColor",
  "borderRightColor",
  "borderBottomColor",
  "borderLeftColor",
  "outlineColor",
  "textDecorationColor",
  "columnRuleColor",
  "fill",
  "stroke",
];
// These hold colors inside larger values; html2canvas cannot draw them, so they are dropped from the capture.
const PROPIEDADES_COMPUESTAS = ["boxShadow", "textShadow", "backgroundImage"];

export const esColorNoSoportado = (value) => typeof value === "string" && NO_SOPORTADO.test(value);

/** Converts any color the browser understands to rgba() by painting it on a 1x1 canvas. */
export const crearConversorCanvas = (doc) => {
  const canvas = doc.createElement("canvas");
  canvas.width = 1;
  canvas.height = 1;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  return (value) => {
    if (!ctx) return "rgba(0, 0, 0, 0)";
    ctx.clearRect(0, 0, 1, 1);
    ctx.fillStyle = "rgba(0, 0, 0, 0)";
    ctx.fillStyle = value;
    ctx.fillRect(0, 0, 1, 1);
    const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data;
    return `rgba(${r}, ${g}, ${b}, ${Math.round((a / 255) * 1000) / 1000})`;
  };
};

/**
 * Rewrites unsupported computed colors of `root` and its descendants as inline rgba() values.
 * @returns {number} how many declarations were rewritten.
 */
export const normalizarColoresParaCaptura = (root, { getComputedStyle, convertir }) => {
  if (!root) return 0;
  let cambios = 0;
  const elementos = [root, ...root.querySelectorAll("*")];
  for (const elemento of elementos) {
    const estilo = getComputedStyle(elemento);
    for (const propiedad of PROPIEDADES_COLOR) {
      if (esColorNoSoportado(estilo[propiedad])) {
        elemento.style[propiedad] = convertir(estilo[propiedad]);
        cambios += 1;
      }
    }
    for (const propiedad of PROPIEDADES_COMPUESTAS) {
      if (esColorNoSoportado(estilo[propiedad])) {
        elemento.style[propiedad] = "none";
        cambios += 1;
      }
    }
  }
  return cambios;
};

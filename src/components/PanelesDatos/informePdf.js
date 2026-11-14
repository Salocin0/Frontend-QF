// Helpers for the statistics PDF: paging the dashboard capture without distortion and
// drawing the comparative chart (vector, with jsPDF primitives) for "ANÁLISIS DE RENDIMIENTO".

const NARANJA = [230, 95, 0];
const TEXTO = [40, 40, 40];
const GRIS = [120, 120, 120];
const COLORES_ESTADO = {
  favorable: [46, 160, 90],
  habitual: [225, 160, 0],
  desfavorable: [205, 55, 45],
  sinBase: [160, 160, 160],
};
const ETIQUETAS_ESTADO = {
  favorable: "Favorable",
  habitual: "Habitual",
  desfavorable: "Desfavorable",
  sinBase: "Sin base",
};

/**
 * Splits a capture of `altoTotal` px into page slices [inicio, fin), preferring the
 * `cortesSeguros` (block boundaries) so cards and charts are not cut in half.
 */
export const calcularTramos = (altoTotal, cortesSeguros, altoPrimera, altoResto) => {
  const tramos = [];
  if (!(altoTotal > 0) || !(altoPrimera > 0) || !(altoResto > 0)) return tramos;
  const cortes = [...new Set(cortesSeguros)].filter((c) => c > 0 && c < altoTotal).sort((a, b) => a - b);
  let inicio = 0;
  let disponible = altoPrimera;
  while (altoTotal - inicio > 0.5) {
    const limite = inicio + disponible;
    if (limite >= altoTotal) {
      tramos.push([inicio, altoTotal]);
      break;
    }
    const desde = inicio + 1;
    const seguros = cortes.filter((c) => c > desde && c <= limite);
    const fin = seguros.length ? seguros[seguros.length - 1] : limite;
    tramos.push([inicio, fin]);
    inicio = fin;
    disponible = altoResto;
  }
  return tramos;
};

/**
 * Y positions (DOM px, relative to the root) where the dashboard can be cut: bottoms of its
 * blocks (children and grandchildren) that no other block spans.
 */
export const obtenerCortesSeguros = (raiz) => {
  if (!raiz?.getBoundingClientRect) return [];
  const top = raiz.getBoundingClientRect().top;
  const bloques = [];
  for (const hijo of Array.from(raiz.children || [])) {
    bloques.push(hijo);
    bloques.push(...Array.from(hijo.children || []));
  }
  const cajas = bloques
    .map((b) => b.getBoundingClientRect())
    .filter((r) => r.height > 0)
    .map((r) => ({ arriba: r.top - top, abajo: r.bottom - top }));
  return cajas
    .map((c) => c.abajo)
    .filter((y) => !cajas.some((c) => c.arriba < y - 1 && c.abajo > y + 1));
};

/** Adds the dashboard capture keeping its aspect ratio, across as many pages as needed. */
export const agregarCapturaPaginada = (pdf, canvas, { y, marginLeft, contentWidth, topMargin, bottomMargin, cortesPx = [] }) => {
  const pageHeight = pdf.internal.pageSize.getHeight();
  const pxPorMm = canvas.width / contentWidth;
  const tramos = calcularTramos(
    canvas.height,
    cortesPx,
    (pageHeight - bottomMargin - y) * pxPorMm,
    (pageHeight - bottomMargin - topMargin) * pxPorMm
  );
  let currentY = y;
  tramos.forEach(([inicio, fin], i) => {
    if (i > 0) {
      pdf.addPage();
      currentY = topMargin;
    }
    const alto = Math.round(fin - inicio);
    const trozo = document.createElement("canvas");
    trozo.width = canvas.width;
    trozo.height = alto;
    trozo.getContext("2d").drawImage(canvas, 0, Math.round(inicio), canvas.width, alto, 0, 0, canvas.width, alto);
    const altoMm = alto / pxPorMm;
    pdf.addImage(trozo.toDataURL("image/jpeg", 0.9), "JPEG", marginLeft, currentY, contentWidth, altoMm);
    currentY += altoMm;
  });
  return currentY;
};

const CLAVES_POR_NOMBRE = [
  [/^ticket/i, "ticketPromedio"],
  [/^valoraci/i, "valoracion"],
  [/^tiempo/i, "entrega"],
  [/^pedidos por puesto/i, "pedidosPorPuesto"],
  [/^recaudaci[oó]n por puesto/i, "recaudadoPorPuesto"],
  [/^recaudaci[oó]n por plaza/i, "recaudadoPorPlaza"],
];

export const claveDeMetrica = (m) => m?.clave || CLAVES_POR_NOMBRE.find(([re]) => re.test(m?.metrica || ""))?.[1] || null;

// es-AR in Intl does not group 4-digit numbers ("5200"), so the separators are added by hand.
const formatearNumero = (v, decimales) => {
  const [entera, decimal] = Math.abs(Number(v)).toFixed(decimales).split(".");
  const signo = Number(v) < 0 && Number(Number(v).toFixed(decimales)) !== 0 ? "-" : "";
  return `${signo}${entera.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}${decimal ? `,${decimal}` : ""}`;
};

export const formatearValor = (clave, v) => {
  if (v === null || v === undefined || v === "" || !Number.isFinite(Number(v))) return "—";
  switch (clave) {
    case "ticketPromedio":
    case "recaudadoPorPuesto":
    case "recaudadoPorPlaza":
      return `$ ${formatearNumero(v, 0)}`;
    case "valoracion":
      return formatearNumero(v, 1);
    case "entrega":
      return `${formatearNumero(v, 1)} min`;
    case "pedidosPorPuesto":
      return formatearNumero(v, 0);
    default:
      return formatearNumero(v, 1);
  }
};

export const estadoDeLectura = (lectura = "") => {
  if (lectura.startsWith("favorable")) return "favorable";
  if (lectura.startsWith("desfavorable")) return "desfavorable";
  if (lectura.startsWith("dentro")) return "habitual";
  return "sinBase";
};

const nombreCorto = (m) => (m.metrica || "").replace(/\s*\([^)]*\)\s*$/, "");
const esMenorMejor = (m) => m.menorEsMejor ?? claveDeMetrica(m) === "entrega";

const num = (v) => (v === null || v === undefined || v === "" ? null : Number(v));

export const tieneGraficoComparativo = (contexto) =>
  Boolean(contexto?.comparaciones?.some((c) => c.metricas?.length) || contexto?.concentracion);

/**
 * Draws the comparative chart at `y` and returns the new y. `asegurarEspacio(y, alto)` must
 * return the y to use (adding a page when `alto` does not fit).
 */
export const dibujarGraficoComparativo = (pdf, contexto, { y, marginLeft, contentWidth, asegurarEspacio }) => {
  const anchoEtiqueta = 56;
  const anchoDerecha = 32;
  const x0 = marginLeft + anchoEtiqueta;
  const ancho = contentWidth - anchoEtiqueta - anchoDerecha;
  const xDerecha = marginLeft + contentWidth;
  const altoFila = 13;

  for (const comparacion of contexto?.comparaciones || []) {
    if (!comparacion.metricas?.length) continue;
    y = asegurarEspacio(y, 8 + altoFila);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(9.5);
    pdf.setTextColor(...TEXTO);
    const titulo = `Frente a: ${comparacion.referencia}`;
    pdf.text(titulo, marginLeft, y);
    const anchoTitulo = pdf.getTextWidth(titulo);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8);
    pdf.setTextColor(...GRIS);
    pdf.text(`(${comparacion.unidades} unidades)`, marginLeft + anchoTitulo + 2, y);
    y += 5;

    for (const m of comparacion.metricas) {
      y = asegurarEspacio(y, altoFila);
      const clave = claveDeMetrica(m);
      const estado = estadoDeLectura(m.lectura);
      const color = COLORES_ESTADO[estado];
      const valor = num(m.valor);
      const min = num(m.referenciaMin);
      const max = num(m.referenciaMax);
      const p25 = num(m.referenciaP25);
      const p75 = num(m.referenciaP75);
      const mediana = num(m.referenciaMediana);
      const yc = y + 3.5;

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(8.5);
      pdf.setTextColor(...TEXTO);
      pdf.text(pdf.splitTextToSize(nombreCorto(m), anchoEtiqueta - 3)[0], marginLeft, y + 2.5);
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(8);
      pdf.setTextColor(...color);
      const textoValor = `Valor: ${formatearValor(clave, valor)}`;
      pdf.text(textoValor, marginLeft, y + 7);
      if (esMenorMejor(m)) {
        const anchoValor = pdf.getTextWidth(textoValor);
        pdf.setFontSize(7);
        pdf.setTextColor(...GRIS);
        pdf.text("(menor es mejor)", marginLeft + anchoValor + 1.5, y + 7);
      }

      if (min === null || max === null || valor === null) {
        pdf.setFont("helvetica", "italic");
        pdf.setFontSize(7.5);
        pdf.setTextColor(...GRIS);
        pdf.text("Sin unidades de referencia para comparar", x0, yc + 1);
      } else {
        let lo = Math.min(min, valor);
        let hi = Math.max(max, valor);
        if (hi - lo < 1e-9) {
          const pad = Math.abs(hi) * 0.1 || 1;
          lo -= pad;
          hi += pad;
        }
        const xDe = (v) => x0 + ((v - lo) / (hi - lo)) * ancho;

        pdf.setFillColor(228, 228, 228);
        pdf.roundedRect(xDe(min), yc - 1.3, Math.max(xDe(max) - xDe(min), 0.6), 2.6, 1.3, 1.3, "F");
        if (p25 !== null && p75 !== null) {
          pdf.setFillColor(175, 175, 175);
          pdf.rect(xDe(p25), yc - 1.3, Math.max(xDe(p75) - xDe(p25), 0.6), 2.6, "F");
        }
        if (mediana !== null) {
          pdf.setDrawColor(50, 50, 50);
          pdf.setLineWidth(0.6);
          pdf.line(xDe(mediana), yc - 2.6, xDe(mediana), yc + 2.6);
        }
        pdf.setDrawColor(255, 255, 255);
        pdf.setLineWidth(0.5);
        pdf.setFillColor(...color);
        pdf.circle(xDe(valor), yc, 1.9, "FD");

        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(6.5);
        pdf.setTextColor(...GRIS);
        pdf.text(formatearValor(clave, min), xDe(min), yc + 5.5);
        pdf.text(formatearValor(clave, max), xDe(max), yc + 5.5, { align: "right" });
      }

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(8);
      pdf.setTextColor(...color);
      const percentil = m.percentil === null || m.percentil === undefined ? "" : ` · P${m.percentil}`;
      pdf.text(`${ETIQUETAS_ESTADO[estado]}${percentil}`, xDerecha, y + 2.5, { align: "right" });
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(7);
      pdf.setTextColor(...GRIS);
      pdf.text(`Mediana: ${formatearValor(clave, mediana)}`, xDerecha, y + 7, { align: "right" });
      y += altoFila;
    }
    y += 2;
  }

  const conc = contexto?.concentracion;
  if (conc) {
    const lider = parseFloat(conc.participacionPuestoLider);
    const equitativa = parseFloat(conc.participacionEquitativa);
    if (Number.isFinite(lider) && Number.isFinite(equitativa)) {
      y = asegurarEspacio(y, 16);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(9.5);
      pdf.setTextColor(...TEXTO);
      pdf.text(`Concentración de la recaudación (${conc.puestos} puestos)`, marginLeft, y);
      y += 4;
      const yc = y + 2;
      pdf.setFillColor(228, 228, 228);
      pdf.rect(marginLeft, yc - 2, contentWidth, 4, "F");
      pdf.setFillColor(...NARANJA);
      pdf.rect(marginLeft, yc - 2, (contentWidth * Math.min(lider, 100)) / 100, 4, "F");
      const xEq = marginLeft + (contentWidth * Math.min(equitativa, 100)) / 100;
      pdf.setDrawColor(50, 50, 50);
      pdf.setLineWidth(0.6);
      pdf.line(xEq, yc - 3, xEq, yc + 3);
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(7);
      pdf.setTextColor(...GRIS);
      const pct = (v) => String(v).replace(".", ",");
      pdf.text(
        `Puesto líder: ${pct(conc.participacionPuestoLider)} de la recaudación · Reparto equitativo (línea): ${pct(conc.participacionEquitativa)} · Coef. de variación: ${pct(conc.coeficienteVariacionRecaudacion)}`,
        marginLeft,
        yc + 6.5
      );
      y += 12;
    }
  }

  if (contexto?.comparaciones?.some((c) => c.metricas?.length)) {
    y = asegurarEspacio(y, 14);
    let x = marginLeft;
    const yl = y + 1;
    const itemLeyenda = (dibujar, texto) => {
      dibujar(x, yl);
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(7);
      pdf.setTextColor(...GRIS);
      pdf.text(texto, x + 6, yl + 1);
      x += 8 + pdf.getTextWidth(texto);
    };
    itemLeyenda((lx, ly) => {
      pdf.setFillColor(228, 228, 228);
      pdf.rect(lx, ly - 1, 5, 2, "F");
    }, "Rango (mín.–máx.)");
    itemLeyenda((lx, ly) => {
      pdf.setFillColor(175, 175, 175);
      pdf.rect(lx, ly - 1, 5, 2, "F");
    }, "Rango habitual P25–P75");
    itemLeyenda((lx, ly) => {
      pdf.setDrawColor(50, 50, 50);
      pdf.setLineWidth(0.6);
      pdf.line(lx + 2.5, ly - 1.8, lx + 2.5, ly + 1.8);
    }, "Mediana");
    for (const estado of ["favorable", "habitual", "desfavorable"]) {
      itemLeyenda((lx, ly) => {
        pdf.setFillColor(...COLORES_ESTADO[estado]);
        pdf.circle(lx + 2.5, ly, 1.4, "F");
      }, ETIQUETAS_ESTADO[estado]);
    }
    y += 5.5;
    pdf.setFont("helvetica", "italic");
    pdf.setFontSize(7);
    pdf.setTextColor(...GRIS);
    const nota =
      "El punto es tu valor. P indica el percentil: el % de unidades de la referencia con un valor menor. Con menos de 5 unidades no se califica.";
    for (const linea of pdf.splitTextToSize(nota, contentWidth)) {
      pdf.text(linea, marginLeft, y);
      y += 3.5;
    }
    y += 3;
  }
  return y;
};

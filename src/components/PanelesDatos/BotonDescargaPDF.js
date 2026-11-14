import React, { useState } from "react";
import html2canvas from "html2canvas";
import { normalizarColoresParaCaptura, crearConversorCanvas } from "./coloresCaptura";
import {
  agregarCapturaPaginada,
  dibujarGraficoComparativo,
  obtenerCortesSeguros,
  tieneGraficoComparativo,
} from "./informePdf";
import jsPDF from "jspdf";

const esTituloRendimiento = (titulo) =>
  titulo
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase()
    .startsWith("ANALISIS DE RENDIMIENTO");

/**
 * Botón que genera un PDF con:
 *  - Captura del panel de gráficas (html2canvas), paginada sin deformarla
 *  - Gráfico comparativo (percentiles frente a la referencia) en "ANÁLISIS DE RENDIMIENTO"
 *  - Análisis ejecutivo generado por el LLM (backend)
 *
 * Props:
 *  - dashboardRef   : ref al div que contiene los gráficos
 *  - tipo           : 'encargado' | 'productor'
 *  - idConsumidor   : número
 *  - idEvento       : string ('Todos' o id)
 *  - idPuesto       : string ('Todos' o id)   (solo encargado)
 *  - nombreEvento   : string para el título del PDF
 *  - nombrePuesto   : string para el título del PDF (solo encargado)
 */
const BotonDescargaPDF = ({
  dashboardRef,
  tipo,
  idConsumidor,
  idEvento = "Todos",
  idPuesto = "Todos",
  nombreEvento = "Todos los eventos",
  nombrePuesto = "Todos los puestos",
}) => {
  const [loading, setLoading] = useState(false);

  const splitTextIntoLines = (pdf, text, maxWidth) => {
    const words = text.split(" ");
    const lines = [];
    let currentLine = "";
    for (const word of words) {
      if (pdf.getTextWidth(word) > maxWidth) {
        // Palabras sin espacios más anchas que la página (p. ej. URLs): se cortan por caracteres.
        if (currentLine) lines.push(currentLine);
        currentLine = "";
        for (const ch of word) {
          if (pdf.getTextWidth(currentLine + ch) > maxWidth) {
            lines.push(currentLine);
            currentLine = ch;
          } else {
            currentLine += ch;
          }
        }
        continue;
      }
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const testWidth = pdf.getTextWidth(testLine);
      if (testWidth > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine) lines.push(currentLine);
    return lines;
  };

  const renderAnalysisText = (pdf, text, startY, pageWidth, marginLeft, maxWidth, { despuesDeTitulo } = {}) => {
    let y = startY;
    const lineHeight = 5.5;
    const pageHeight = pdf.internal.pageSize.getHeight();
    const bottomMargin = 20;

    const checkNewPage = (neededY) => {
      if (neededY > pageHeight - bottomMargin) {
        pdf.addPage();
        y = 20;
        return true;
      }
      return false;
    };

    const paragraphs = text.split("\n").filter((l) => l.trim() !== "");

    for (const paragraph of paragraphs) {
      const trimmed = paragraph.trim();
      const isSectionTitle =
        /^[A-ZÁÉÍÓÚ\s]{5,}$/.test(trimmed) || /^[A-ZÁÉÍÓÚ][A-ZÁÉÍÓÚ\s]+:?$/.test(trimmed);

      if (isSectionTitle) {
        y += 4;
        checkNewPage(y + lineHeight + 2);
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(11);
        pdf.setTextColor(230, 95, 0);
        pdf.text(trimmed, marginLeft, y);
        y += lineHeight + 1;
        // underline
        pdf.setDrawColor(230, 95, 0);
        pdf.setLineWidth(0.3);
        pdf.line(marginLeft, y - 1, pageWidth - marginLeft, y - 1);
        y += 3;
        if (despuesDeTitulo) y = despuesDeTitulo(trimmed, y);
      } else {
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(9.5);
        pdf.setTextColor(40, 40, 40);
        const lines = splitTextIntoLines(pdf, trimmed, maxWidth);
        for (const line of lines) {
          checkNewPage(y + lineHeight);
          pdf.text(line, marginLeft, y);
          y += lineHeight;
        }
        y += 2;
      }
    }
    return y;
  };

  const handleDownload = async () => {
    if (loading) return;
    setLoading(true);

    try {
      // 1. Obtener análisis del backend
      const response = await fetch(
        `${process.env.REACT_APP_BACK_URL}estadisticas/analisis-llm`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tipo, idConsumidor, idEvento, idPuesto }),
        }
      );

      if (!response.ok) throw new Error("Error al generar el análisis");
      const result = await response.json();
      const analisisTexto = result?.data?.analisis || "No se pudo generar el análisis.";

      // 2. Capturar el dashboard con html2canvas
      let canvasPanel = null;
      let cortesPx = [];
      if (dashboardRef?.current) {
        const raiz = dashboardRef.current;
        canvasPanel = await html2canvas(raiz, {
          scale: 1.5,
          useCORS: true,
          backgroundColor: "#1a1a1a",
          logging: false,
          // Runs on html2canvas' copy of the page, so the visible dashboard is not touched.
          onclone: (clonedDoc, clonedRoot) => {
            normalizarColoresParaCaptura(clonedRoot, {
              getComputedStyle: (element) => clonedDoc.defaultView.getComputedStyle(element),
              convertir: crearConversorCanvas(clonedDoc),
            });
          },
        });
        const escala = canvasPanel.width / (raiz.getBoundingClientRect().width || canvasPanel.width);
        cortesPx = obtenerCortesSeguros(raiz).map((yPx) => yPx * escala);
      }

      // 3. Construir PDF
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const marginLeft = 15;
      const contentWidth = pageWidth - marginLeft * 2;

      // — Encabezado —
      pdf.setFillColor(230, 95, 0);
      pdf.rect(0, 0, pageWidth, 28, "F");

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(18);
      pdf.setTextColor(255, 255, 255);
      pdf.text("QuickFood — Análisis Estadístico", marginLeft, 13);

      pdf.setFontSize(10);
      pdf.setFont("helvetica", "normal");
      const subtitulo =
        tipo === "encargado"
          ? `Encargado | Evento: ${nombreEvento} | Puesto: ${nombrePuesto}`
          : `Productor | Evento: ${nombreEvento}`;
      pdf.text(subtitulo, marginLeft, 21);

      // Fecha de generación
      const fecha = new Date().toLocaleDateString("es-AR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
      pdf.setFontSize(8);
      pdf.setTextColor(240, 240, 240);
      pdf.text(`Generado el ${fecha}`, pageWidth - marginLeft - pdf.getTextWidth(`Generado el ${fecha}`), 21);

      let currentY = 34;

      // — Gráficos —
      if (canvasPanel) {
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(12);
        pdf.setTextColor(230, 95, 0);
        pdf.text("PANEL DE ESTADÍSTICAS", marginLeft, currentY);
        currentY += 5;

        // Keeps the capture's aspect ratio; tall dashboards continue on the next page.
        currentY = agregarCapturaPaginada(pdf, canvasPanel, {
          y: currentY,
          marginLeft,
          contentWidth,
          topMargin: 15,
          bottomMargin: 15,
          cortesPx,
        });
        currentY += 8;
        if (currentY > pageHeight - 40) {
          pdf.addPage();
          currentY = 20;
        }
      }

      // — Separador —
      pdf.setDrawColor(230, 95, 0);
      pdf.setLineWidth(0.5);
      pdf.line(marginLeft, currentY, pageWidth - marginLeft, currentY);
      currentY += 6;

      // — Análisis LLM —
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(13);
      pdf.setTextColor(230, 95, 0);
      pdf.text("INFORME EJECUTIVO  (Generado con FoodyAnalyst)", marginLeft, currentY);
      currentY += 7;

      // — Gráfico comparativo: va al inicio de "ANÁLISIS DE RENDIMIENTO" y el texto del LLM lo explica debajo —
      const contexto = result?.data?.contextoComparativo;
      let graficoDibujado = !tieneGraficoComparativo(contexto);
      const asegurarEspacio = (y, alto) => {
        if (y + alto > pageHeight - 20) {
          pdf.addPage();
          return 20;
        }
        return y;
      };
      const dibujarComparativo = (y) => {
        graficoDibujado = true;
        return dibujarGraficoComparativo(pdf, contexto, { y: y + 1, marginLeft, contentWidth, asegurarEspacio });
      };

      currentY = renderAnalysisText(pdf, analisisTexto, currentY, pageWidth, marginLeft, contentWidth, {
        despuesDeTitulo: (titulo, y) => (!graficoDibujado && esTituloRendimiento(titulo) ? dibujarComparativo(y) : y),
      });

      if (!graficoDibujado) {
        currentY = renderAnalysisText(pdf, "ANÁLISIS COMPARATIVO", currentY + 2, pageWidth, marginLeft, contentWidth, {
          despuesDeTitulo: (_titulo, y) => dibujarComparativo(y),
        });
      }

      // — Metodología (determinística, armada por el backend, no por el LLM) —
      const metodologia = result?.data?.metodologia;
      if (Array.isArray(metodologia) && metodologia.length) {
        currentY = renderAnalysisText(
          pdf,
          ["METODOLOGÍA Y FUENTES", ...metodologia].join("\n"),
          currentY + 2,
          pageWidth,
          marginLeft,
          contentWidth
        );
      }

      // — Pie de página en cada página —
      const totalPages = pdf.internal.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        pdf.setFont("helvetica", "italic");
        pdf.setFontSize(7.5);
        pdf.setTextColor(150, 150, 150);
        pdf.text(
          `QuickFood Analytics · Página ${i} de ${totalPages} · Informe generado automáticamente`,
          marginLeft,
          pageHeight - 8
        );
      }

      // 4. Descargar
      const nombreArchivo =
        tipo === "encargado"
          ? `QF_analisis_encargado_${idEvento}_${idPuesto}.pdf`
          : `QF_analisis_productor_${idEvento}.pdf`;
      pdf.save(nombreArchivo);
    } catch (err) {
      console.error("Error generando PDF:", err);
      alert("Hubo un error al generar el PDF. Por favor intentá de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "10px 20px",
        backgroundColor: loading ? "#888" : "var(--qf-naranja)",
        color: "#fff",
        border: "none",
        borderRadius: "8px",
        fontSize: "0.95rem",
        fontWeight: "bold",
        cursor: loading ? "not-allowed" : "pointer",
        transition: "background-color 0.2s, transform 0.1s",
        boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
      }}
      onMouseEnter={(e) => {
        if (!loading) e.currentTarget.style.backgroundColor = "#c04d00";
      }}
      onMouseLeave={(e) => {
        if (!loading) e.currentTarget.style.backgroundColor = "var(--qf-naranja)";
      }}
    >
      {loading ? (
        <>
          <span
            style={{
              width: "16px",
              height: "16px",
              border: "2px solid #fff",
              borderTopColor: "transparent",
              borderRadius: "50%",
              display: "inline-block",
              animation: "qf-spin 0.8s linear infinite",
            }}
          />
          Generando análisis...
        </>
      ) : (
        <>
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Descargar análisis en PDF
        </>
      )}
      <style>{`
        @keyframes qf-spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </button>
  );
};

export default BotonDescargaPDF;

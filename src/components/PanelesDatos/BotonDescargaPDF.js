import React, { useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

/**
 * Botón que genera un PDF con:
 *  - Captura del panel de gráficas (html2canvas)
 *  - Análisis ejecutivo generado por GPT-4o (backend)
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

  const renderAnalysisText = (pdf, text, startY, pageWidth, marginLeft, maxWidth) => {
    const sections = text.split(/\n(?=[A-ZÁÉÍÓÚ ]{4,}$)/m);
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
      let chartImgData = null;
      let chartAspect = 16 / 9;
      if (dashboardRef?.current) {
        const canvas = await html2canvas(dashboardRef.current, {
          scale: 1.5,
          useCORS: true,
          backgroundColor: "#1a1a1a",
          logging: false,
        });
        chartImgData = canvas.toDataURL("image/jpeg", 0.85);
        chartAspect = canvas.width / canvas.height;
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
      if (chartImgData) {
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(12);
        pdf.setTextColor(230, 95, 0);
        pdf.text("PANEL DE ESTADÍSTICAS", marginLeft, currentY);
        currentY += 5;

        const imgWidth = contentWidth;
        const imgHeight = Math.min(imgWidth / chartAspect, 110);
        pdf.addImage(chartImgData, "JPEG", marginLeft, currentY, imgWidth, imgHeight);
        currentY += imgHeight + 8;
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

      currentY = renderAnalysisText(pdf, analisisTexto, currentY, pageWidth, marginLeft, contentWidth);

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

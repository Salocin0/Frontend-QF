import React, { useContext, useEffect, useState, useRef } from "react";
import PageLayout from "../../ComponentesGenerales/PageLayout";
import Footer from "../../ComponentesGenerales/Footer";
import TopPuestos from "./TopPuestos";
import GraficaBarras from "../GraficaBarras";
import { UserContext } from "../../ComponentesGenerales/UserContext";
import TotalQuickFood from "./TotalGenerado";
import ValoracionPromedio from "./ValoracionPromedio";
import Breadcrumb from "../../ComponentesGenerales/Breadcrumb";
import BotonDescargaPDF from "../BotonDescargaPDF";

const PanelProductor = () => {
  const { user } = useContext(UserContext);
  const [eventos, setEventos] = useState([]);
  const [eventoSeleccionado, setEventoSeleccionado] = useState("Todos");

  const contentRef = useRef(null);
  const dashboardRef = useRef(null);
  const [contentWidth, setContentWidth] = useState(999);
  const isNarrowLayout = contentWidth <= 780;
  const isMobileLayout = contentWidth <= 600;

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      setContentWidth(entry.contentRect.width);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Layout de grilla según el ancho
  let gridCols, gridRows, gridAreas;
  if (contentWidth >= 1000) {
    gridCols = "repeat(7, 1fr)";
    gridRows = "repeat(6, 1fr)";
    gridAreas = `
      "div1 div1 div2 div2 toppuestos toppuestos toppuestos"
      "div1 div1 div2 div2 toppuestos toppuestos toppuestos"
      "grafica grafica grafica grafica toppuestos toppuestos toppuestos"
      "grafica grafica grafica grafica toppuestos toppuestos toppuestos"
      "grafica grafica grafica grafica toppuestos toppuestos toppuestos"
      "grafica grafica grafica grafica toppuestos toppuestos toppuestos"
    `;
  } else if (contentWidth >= 650) {
    // Tablet: div1+div2 en fila, toppuestos full-width, grafica abajo
    gridCols = "repeat(2, 1fr)";
    gridRows = "auto";
    gridAreas = `
      "div1 div2"
      "toppuestos toppuestos"
      "grafica grafica"
    `;
  } else {
    // Mobile: todo apilado
    gridCols = "1fr";
    gridRows = "auto";
    gridAreas = `
      "div1"
      "div2"
      "toppuestos"
      "grafica"
    `;
  }

  useEffect(() => {
    const fetchEventos = async () => {
      try {
        const response = await fetch(
          `${process.env?.REACT_APP_BACK_URL}evento/all`,
          {
            headers: {
              "Content-Type": "application/json",
              consumidorId: user?.id,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setEventos([{ nombre: "Todos", id: "Todos" }, ...data?.data] || []);
          if (data?.data?.length > 0) {
            setEventoSeleccionado(data.data[0]?.id || "Todos");
          } else {
            setEventoSeleccionado("Todos");
          }
        } else {
          console.error("Error al obtener eventos");
        }
      } catch (error) {
        console.error("Error en el fetch de eventos:", error);
      }
    };

    if (user?.id) {
      fetchEventos();
    }
  }, [user]);

  const breadcrumbItems = [
    { title: "Inicio", url: "/inicio" },
    { title: "Estadisticas", url: "/grafica-productor" },
  ];

  const handleEventoChange = (e) => {
    setEventoSeleccionado(e.target.value);
  };

  return (
    <PageLayout sidebarProps={{ tipoUsuario: user?.tipoUsuario }}>
      <div style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        flex: 1,
        minHeight: 0,
        boxSizing: "border-box",
      }}>
        {/* Header full-width */}
        <div className="qf-page-header qf-page-header--full" style={{ textAlign: "center" }}>
          <h1 className="qf-page-title" style={{ textAlign: "center", fontSize: "1.75rem" }}>
            Estadísticas Productor
          </h1>
          <hr className="qf-separator qf-separator--spaced" />
        </div>

        {/* Contenido principal */}
        <div
          ref={contentRef}
          className="qf-page-content"
          style={{ flex: 1, minHeight: 0, flexDirection: "column" }}
        >
          <div className="qf-page-content__main" style={{ overflow: "visible" }}>
            {/* Breadcrumb */}
            <Breadcrumb items={breadcrumbItems} style={{
              margin: 0,
              backgroundColor: 'var(--qf-bg-secondary)',
              width: '100%',
              padding: '8px 16px',
              borderRadius: '10px',
              border: '1px solid var(--qf-naranja)',
              boxSizing: 'border-box',
            }} />

            {/* Select de eventos */}
            <div style={{
              display: "flex",
              flexDirection: "column",
              alignItems: isMobileLayout ? "stretch" : "flex-end",
              marginTop: "12px",
              marginBottom: "12px",
              gap: "5px",
            }}>
              <label style={{
                color: "var(--qf-naranja)",
                fontSize: "0.9rem",
                fontWeight: "bold",
              }}>
                Evento:
              </label>
              <select
                style={{
                  borderRadius: "5px",
                  backgroundColor: "var(--qf-bg-secondary)",
                  border: "1px solid var(--qf-naranja)",
                  color: "var(--qf-text-primary)",
                  padding: "8px 12px",
                  width: isMobileLayout ? "100%" : "200px",
                  fontSize: "0.95rem",
                }}
                value={eventoSeleccionado || ""}
                onChange={handleEventoChange}
              >
                {eventos.map((evento) => (
                  <option key={evento.id} value={evento.id}>
                    {evento.nombre}
                  </option>
                ))}
              </select>
            </div>

            {/* Botón de descarga PDF */}
            <div style={{
              display: "flex",
              justifyContent: isMobileLayout ? "stretch" : "flex-end",
              marginBottom: "16px",
            }}>
              <BotonDescargaPDF
                dashboardRef={dashboardRef}
                tipo="productor"
                idConsumidor={user?.id}
                idEvento={eventoSeleccionado || "Todos"}
                nombreEvento={
                  eventos.find((e) => String(e.id) === String(eventoSeleccionado))?.nombre ||
                  "Todos los eventos"
                }
              />
            </div>

            {/* Grid de gráficas */}
            <div ref={dashboardRef} style={{
              display: "grid",
              gridTemplateColumns: gridCols,
              gridTemplateRows: gridRows,
              gap: "20px",
              gridTemplateAreas: gridAreas,
              width: "100%",
              paddingBottom: "60px",
            }}>
              <div style={{
                gridArea: "div1",
                overflow: "hidden",
              }}>
                <TotalQuickFood eventId={eventoSeleccionado} />
              </div>
              <div style={{
                gridArea: "div2",
                borderRadius: "20px",
                border: "2px solid var(--qf-naranja)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "var(--qf-bg-secondary)",
                padding: "16px",
              }}>
                <ValoracionPromedio eventoId={eventoSeleccionado} />
              </div>
              <div style={{
                gridArea: "toppuestos",
                borderRadius: "20px",
                background: "var(--qf-bg-secondary)",
                border: "2px solid var(--qf-naranja)",
              }}>
                <TopPuestos eventoId={eventoSeleccionado} />
              </div>
              <div style={{
                gridArea: "grafica",
                borderRadius: "20px",
                border: "2px solid var(--qf-naranja)",
                overflow: "hidden",
              }}>
                <GraficaBarras eventId={eventoSeleccionado} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </PageLayout>
  );
};

export default PanelProductor;

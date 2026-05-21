import React, { useContext, useEffect, useState } from "react";
import PageLayout from "../../ComponentesGenerales/PageLayout";
import Footer from "../../ComponentesGenerales/Footer";
import TopPuestos from "./TopPuestos";
import GraficaBarras from "../GraficaBarras";
import { UserContext } from "../../ComponentesGenerales/UserContext";
import TotalQuickFood from "./TotalGenerado";
import ValoracionPromedio from "./ValoracionPromedio";
import Breadcrumb from "../../ComponentesGenerales/Breadcrumb";
import useBreakpoint from "../../../useBreakpoint";

const PanelProductor = () => {
  const { user } = useContext(UserContext);
  const { isMobile } = useBreakpoint();
  const [eventos, setEventos] = useState([]);
  const [eventoSeleccionado, setEventoSeleccionado] = useState("Todos");

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
            // Selecciona el primer evento por su id (evita usar el state 'eventos' recién asignado)
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

  const styles = {
    header: {
      color: "var(--qf-naranja)",
      textAlign: "center",
      marginLeft: isMobile ? "0" : "20%",
      paddingTop: "10px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    select: {
      borderRadius: "5px",
      backgroundColor: "var(--qf-bg-secondary)",
      position: "absolute",
      top: "25px",
      right: "20px",
      border: "none",
      color: "white",
      padding: "5px",
      marginLeft: "20px",
      width: "200px",
    },
    hr: {
      color: "var(--qf-naranja)",
      width: "100%",
      paddingBottom: "10px",
    },
    mainContent: {
      display: "flex",
      height: isMobile ? "auto" : "70vh",
      backgroundColor: "var(--qf-bg-main)",
      marginLeft: isMobile ? "0" : "20%",
      width: isMobile ? "100%" : "80%",
    },
    graficaContainer: {
      display: "grid",
      gridTemplateColumns: isMobile ? "1fr" : "repeat(7, 1fr)",
      gridTemplateRows: isMobile ? "auto" : "repeat(6, 1fr)",
      gap: "20px",
      gridTemplateAreas: isMobile ? `
        "div1"
        "div2"
        "toppuestos"
        "grafica"
      ` : `
        "div1 div1 div2 div2 toppuestos toppuestos toppuestos"
        "div1 div1 div2 div2 toppuestos toppuestos toppuestos"
        "grafica grafica grafica grafica toppuestos toppuestos toppuestos"
        "grafica grafica grafica grafica toppuestos toppuestos toppuestos"
        "grafica grafica grafica grafica toppuestos toppuestos toppuestos"
        "grafica grafica grafica grafica toppuestos toppuestos toppuestos"
      `,
      width: "100%",
      paddingLeft: "20px",
      paddingRight: "20px",
    },
    div2: {
      gridArea: "div2",
      marginTop: "20px",
      borderRadius: "20px",
      paddingTop: "100px",
      backgroundSize: "cover",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "100% 25%",
      border: `2px solid var(--qf-naranja)`,
      position: "relative",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "var(--qf-bg-secondary)",
      color: "white",
      padding: "16px",
    },
    graficaBarras: {
      gridArea: "grafica",
      borderRadius: "20px",
      marginBottom: "20px",
      border: `2px solid var(--qf-naranja)`,
      overflow: "hidden",
    },
    toppuestos: {
      gridArea: "toppuestos",
      marginTop: "20px",
      borderRadius: "20px",
      background: "var(--qf-bg-secondary)",
      marginBottom: "20px",
      border: `2px solid var(--qf-naranja)`,
    },
    footer: {
      marginTop: "auto",
    },
    breadcrumbWrapper: {
      width: "Calc(100%)",
      paddingTop: "10px",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    },
  };
  const breadcrumbItems = [
    { title: "Inicio", url: "/inicio" },
    { title: "Estadisticas", url: "/grafica-productor" },
  ];

  const handleEventoChange = (e) => {
    setEventoSeleccionado(e.target.value);
  };

  return (
    <PageLayout sidebarProps={{ tipoUsuario: user?.tipoUsuario }}>
      <div style={styles.header}>
        <h1>Estadísticas Productor</h1>
      </div>
      <select
        style={styles.select}
        value={eventoSeleccionado || ""}
        onChange={handleEventoChange}
      >
        {eventos.map((evento) => (
          <option key={evento.id} value={evento.id}>
            {evento.nombre}
          </option>
        ))}
      </select>
      <hr style={styles.hr} />
      <div style={styles.breadcrumbWrapper}>
        <Breadcrumb
          items={breadcrumbItems}
          style={{
            width: "Calc(80% - 40px)",
            marginLeft: "Calc(20% + 20px)",
          }}
        />
      </div>
      <div style={styles.mainContent}>
        <div style={styles.graficaContainer}>
          <TotalQuickFood eventId={eventoSeleccionado} />
          <div style={styles.div2}>
            <ValoracionPromedio eventoId={eventoSeleccionado} />
          </div>
          <div style={styles.toppuestos}>
            <TopPuestos eventoId={eventoSeleccionado} />
          </div>
          <div style={styles.graficaBarras}>
            <GraficaBarras eventId={eventoSeleccionado} />
          </div>
        </div>
        <div style={styles.footer}>
          <Footer />
        </div>
      </div>
    </PageLayout>
  );
};

export default PanelProductor;

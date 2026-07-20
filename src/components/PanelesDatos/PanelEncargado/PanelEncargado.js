import React, { useEffect, useState, useContext, useRef } from "react";
import PageLayout from "../../ComponentesGenerales/PageLayout";
import Footer from "../../ComponentesGenerales/Footer";
import GraficaLineas from "../GraficaLineas";
import { UserContext } from "../../ComponentesGenerales/UserContext";
import TopProductos from "./TopProductos";
import TiempoPromedioEntrega from "./TiempoPromedioEntrega";
import ValoracionPromedio from "./ValoracionPromedio";
import TotalRecaudadoEvento from "./TotalRecaudado";
import Breadcrumb from "../../ComponentesGenerales/Breadcrumb";
import useBreakpoint from "../../../useBreakpoint";
import BotonDescargaPDF from "../BotonDescargaPDF";

const PanelEncargado = () => {
  const { user } = useContext(UserContext);
  const { isMobile } = useBreakpoint();

  const [eventos, setEventos] = useState([]);
  const [eventoSeleccionado, setEventoSeleccionado] = useState(null);
  const [puestos, setPuestos] = useState([]);
  const [puestoSeleccionado, setPuestoSeleccionado] = useState(null);

  const dashboardRef = useRef(null);
  const windowWidth = useBreakpoint().width;

  // Layout de grilla según el ancho de ventana:
  //   >= 1200px → 9 columnas (div1|div2|div3 a la izquierda, toppuestos a la derecha, grafica abajo)
  //   768-1199px → 3 columnas (div1|div2|div3 arriba, toppuestos full width, grafica abajo)
  //   < 768px → 1 columna (todo apilado)
  let gridCols, gridRows, gridAreas;
  if (windowWidth >= 1200) {
    gridCols = "repeat(9, 1fr)";
    gridRows = "auto auto 1fr 1fr 1fr 1fr";
    gridAreas = `
      "div1 div1 div2 div2 div3 div3 toppuestos toppuestos toppuestos"
      "div1 div1 div2 div2 div3 div3 toppuestos toppuestos toppuestos"
      "grafica grafica grafica grafica grafica grafica toppuestos toppuestos toppuestos"
      "grafica grafica grafica grafica grafica grafica toppuestos toppuestos toppuestos"
      "grafica grafica grafica grafica grafica grafica toppuestos toppuestos toppuestos"
      "grafica grafica grafica grafica grafica grafica toppuestos toppuestos toppuestos"
    `;
  } else if (windowWidth >= 768) {
    // Tablet: 3 cards arriba, toppuestos abajo full, grafica al final
    gridCols = "repeat(3, 1fr)";
    gridRows = "auto";
    gridAreas = `
      "div1 div2 div3"
      "toppuestos toppuestos toppuestos"
      "grafica grafica grafica"
    `;
  } else {
    gridCols = "1fr";
    gridRows = "auto";
    gridAreas = `
      "div1"
      "div2"
      "div3"
      "toppuestos"
      "grafica"
    `;
  }

  const styles = {
    pagina: {
      display: "flex",
      flexDirection: "column",
      gap: "20px",
    },
    tituloSeccion: {
      textAlign: "center",
      paddingTop: "1rem",
      fontSize: "2rem",
      color: "var(--qf-naranja)",
      margin: 0,
    },
    hrFull: {
      border: "none",
      borderTop: "1px solid var(--qf-naranja)",
      margin: 0,
      width: "100vw",
      marginLeft: "calc(-50vw + 50%)",
    },
    breadcrumbWrapper: {
      width: "100%",
    },
    selectsContainer: {
      display: "flex",
      flexDirection: isMobile ? "column" : "row",
      gap: isMobile ? "10px" : "20px",
      justifyContent: isMobile ? "stretch" : "flex-end",
      alignItems: isMobile ? "stretch" : "flex-end",
      padding: "0 20px",
      marginBottom: "20px",
    },
    selectWrapper: {
      display: "flex",
      flexDirection: "column",
      gap: "5px",
      width: isMobile ? "100%" : "auto",
    },
    selectLabel: {
      color: "var(--qf-naranja)",
      fontSize: "0.9rem",
      fontWeight: "bold",
    },
    select: {
      borderRadius: "5px",
      backgroundColor: "var(--qf-bg-secondary)",
      border: "none",
      color: "var(--qf-text-primary)",
      padding: "5px",
      width: isMobile ? "100%" : "200px",
    },
    mainContent: {
      display: "flex",
      flexDirection: "column",
      backgroundColor: "var(--qf-bg-main)",
      marginBottom: "50px",
    },
    graficaContainer: {
      display: "grid",
      width: "100%",
      height: "100%",
      gridTemplateColumns: gridCols,
      gridTemplateRows: gridRows,
      gap: "20px",
      gridTemplateAreas: gridAreas,
    },
  };

  const handleEventoChange = (e) => {
    if (e.target.value === "Todos") {
      setEventoSeleccionado({ nombre: "Todos", id: "Todos" });
      return;
    }
    const evento = eventos.find(
      (ev) => String(ev.id) === e.target.value
    );
    if (evento) {
      setEventoSeleccionado({ nombre: evento.nombre, id: evento.id });
    }
  };

  const handlePuestoChange = (e) => {
    if (e.target.value === "Todos") {
      setPuestoSeleccionado({ nombre: "Todos", id: "Todos" });
      return;
    }
    const puesto = puestos.find(
      (p) => String(p.id) === e.target.value
    );
    if (puesto) {
      setPuestoSeleccionado({
        nombre: puesto.nombreCarro,
        id: puesto.id,
      });
    }
  };

  useEffect(() => {
    const fetchEventos = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACK_URL}estadisticas/eventos-con-pedidos/${user.consumidorId}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          const eventosConPedidos = data?.data || [];
          setEventos([
            { nombre: "Todos", id: "Todos" },
            ...eventosConPedidos,
          ]);
        } else {
          throw new Error("New endpoint failed");
        }
      } catch (error) {
        console.warn("Falling back to old endpoint for eventos", error);
        try {
          const fallbackResponse = await fetch(
            `${process.env.REACT_APP_BACK_URL}evento/all`,
            { headers: { "Content-Type": "application/json" } }
          );
          if (fallbackResponse.ok) {
            const fallbackData = await fallbackResponse.json();
            const allEventos = fallbackData?.data || [];
            setEventos([
              { nombre: "Todos", id: "Todos" },
              ...allEventos,
            ]);
          } else {
            setEventos([{ nombre: "Todos", id: "Todos" }]);
          }
        } catch (fallbackError) {
          console.error("Fallback for eventos also failed", fallbackError);
          setEventos([{ nombre: "Todos", id: "Todos" }]);
        }
      }
      setEventoSeleccionado({ nombre: "Todos", id: "Todos" });
    };

    if (user?.consumidorId) {
      fetchEventos();
    }
  }, [user]);

  useEffect(() => {
    const fetchPuestos = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACK_URL}estadisticas/puestos-con-pedidos/${user.consumidorId}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          const puestosConPedidos = data?.data || [];
          setPuestos([
            { nombreCarro: "Todos", id: "Todos" },
            ...puestosConPedidos,
          ]);
        } else {
          throw new Error("New endpoint failed");
        }
      } catch (error) {
        console.warn("Falling back to old endpoint for puestos", error);
        try {
          const fallbackResponse = await fetch(
            `${process.env.REACT_APP_BACK_URL}puesto/creados`,
            {
              headers: {
                "Content-Type": "application/json",
                consumidorid: user.consumidorId,
              },
            }
          );
          if (fallbackResponse.ok) {
            const fallbackData = await fallbackResponse.json();
            const allPuestos = fallbackData?.data || [];
            setPuestos([
              { nombreCarro: "Todos", id: "Todos" },
              ...allPuestos,
            ]);
          } else {
            setPuestos([{ nombreCarro: "Todos", id: "Todos" }]);
          }
        } catch (fallbackError) {
          console.error("Fallback for puestos also failed", fallbackError);
          setPuestos([{ nombreCarro: "Todos", id: "Todos" }]);
        }
      }
      setPuestoSeleccionado({ nombre: "Todos", id: "Todos" });
    };

    if (user?.consumidorId) {
      fetchPuestos();
    }
  }, [user]);

  const breadcrumbItems = [
    { title: "Inicio", url: "/inicio" },
    { title: "Estadisticas", url: "/grafica-encargado" },
  ];

  return (
    <PageLayout sidebarProps={{ tipoUsuario: user?.tipoUsuario }}>
      <div style={styles.pagina}>
        <h1 style={styles.tituloSeccion}>Estadísticas Encargado</h1>
        <hr style={styles.hrFull} />
        <div style={styles.breadcrumbWrapper}>
          <Breadcrumb
            items={breadcrumbItems}
            style={{ width: "100%", margin: "8px 0" }}
          />
        </div>
        <div style={styles.selectsContainer}>
          <div style={styles.selectWrapper}>
            <label style={styles.selectLabel}>Evento:</label>
            <select
              style={styles.select}
              value={eventoSeleccionado?.id}
              onChange={handleEventoChange}
            >
              {eventos.map((evento) => (
                <option key={evento.id} value={evento.id}>
                  {evento.nombre}
                </option>
              ))}
            </select>
          </div>
          <div style={styles.selectWrapper}>
            <label style={styles.selectLabel}>Puesto:</label>
            <select
              style={styles.select}
              value={puestoSeleccionado?.id}
              onChange={handlePuestoChange}
            >
              {puestos.map((puesto) => (
                <option key={puesto.id} value={puesto.id}>
                  {puesto.nombreCarro}
                </option>
              ))}
            </select>
          </div>
          <BotonDescargaPDF
            dashboardRef={dashboardRef}
            tipo="encargado"
            idConsumidor={user?.consumidorId}
            idEvento={eventoSeleccionado?.id || "Todos"}
            idPuesto={puestoSeleccionado?.id || "Todos"}
            nombreEvento={eventoSeleccionado?.nombre || "Todos los eventos"}
            nombrePuesto={puestoSeleccionado?.nombre || "Todos los puestos"}
          />
        </div>
      </div>
      <div style={styles.mainContent}>
        <div ref={dashboardRef} style={styles.graficaContainer}>
          <TotalRecaudadoEvento
            puestoId={puestoSeleccionado?.id}
            eventoId={eventoSeleccionado?.id}
          />
          <ValoracionPromedio
            puestoId={puestoSeleccionado?.id}
            eventoId={eventoSeleccionado?.id}
          />
          <TiempoPromedioEntrega
            puestoId={puestoSeleccionado?.id}
            eventoId={eventoSeleccionado?.id}
          />
          <TopProductos
            puestoId={puestoSeleccionado?.id}
            eventoId={eventoSeleccionado?.id}
          />
          <div
            className="graficaBarrasEncargado"
            style={{ gridArea: "grafica" }}
          >
            <GraficaLineas
              key={eventoSeleccionado?.id}
              puestoId={puestoSeleccionado?.id}
              eventId={eventoSeleccionado?.id}
            />
          </div>
        </div>
        <Footer />
      </div>
    </PageLayout>
  );
};

export default PanelEncargado;

import React, { useEffect, useState, useContext } from "react";
import Sidebar from "../../ComponentesGenerales/Sidebar";
import Footer from "../../ComponentesGenerales/Footer";
import GraficaLineas from "../GraficaLineas";
import { UserContext } from "../../ComponentesGenerales/UserContext";
import useDynamicColors from "../../../UseDinamicColors";
import TopProductos from "./TopProductos";
import TiempoPromedioEntrega from "./TiempoPromedioEntrega";
import ValoracionPromedio from "./ValoracionPromedio";
import TotalRecaudadoEvento from "./TotalRecaudado";
import Breadcrumb from "../../ComponentesGenerales/Breadcrumb";

const PanelEncargado = () => {
  const { user } = useContext(UserContext);
  const Colors = useDynamicColors();

  const [eventos, setEventos] = useState([]);
  const [eventoSeleccionado, setEventoSeleccionado] = useState(null);
  const [puestos, setPuestos] = useState([]);
  const [puestoSeleccionado, setPuestoSeleccionado] = useState(null);

  const styles = {
    container: {
      height: "100vh",
      width: "100%",
      backgroundColor: Colors.GrisAzuladoOscuro,
    },
    header: {
      color: Colors.Naranja,
      textAlign: "center",
      marginLeft: "20%",
      paddingTop: "10px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    select1: {
      borderRadius: "5px",
      backgroundColor: Colors.GrisAzuladoClaro,
      position: "absolute",
      top: "25px",
      right: "20px",
      border: "none",
      color: "white",
      padding: "5px",
      marginLeft: "20px",
      width: "200px",
    },
    select2: {
      borderRadius: "5px",
      backgroundColor: Colors.GrisAzuladoClaro,
      position: "absolute",
      top: "25px",
      right: "230px",
      border: "none",
      color: "white",
      padding: "5px",
      marginLeft: "20px",
      width: "150px",
    },
    hr: {
      color: Colors.Naranja,
      width: "100%",
      paddingBottom: "0",
    },
    mainContent: {
      display: "flex",
      height: "Calc(100% - 200px)",
      width: "80%",
      backgroundColor: Colors.GrisAzuladoOscuro,
      marginBottom: "50px",
      marginLeft: "20%",
    },
    graficaContainer: {
      display: "grid",
      width: "100%",
      height: "100%",
      gridTemplateColumns: "repeat(9, 1fr)",
      gridTemplateRows: "repeat(6, 1fr)",
      gap: "20px",
      gridTemplateAreas: `
        "div1 div1 div2 div2 div3 div3 toppuestos toppuestos toppuestos"
        "div1 div1 div2 div2 div3 div3 toppuestos toppuestos toppuestos"
        "grafica grafica grafica grafica grafica grafica toppuestos toppuestos toppuestos"
        "grafica grafica grafica grafica grafica grafica toppuestos toppuestos toppuestos"
        "grafica grafica grafica grafica grafica grafica toppuestos toppuestos toppuestos"
        "grafica grafica grafica grafica grafica grafica toppuestos toppuestos toppuestos"
      `,
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

  const handleEventoChange = (e) => {
    if (e.target.value === "Todos") {
      setEventoSeleccionado({ nombre: "Todos", id: "Todos" });
      return;
    }
    setEventoSeleccionado({
      nombre: eventos[e.target.value].nombre,
      id: eventos[e.target.value].id,
    });
  };

  const handlePuestoChange = (e) => {
    if (e.target.value === "Todos") {
      setPuestoSeleccionado({ nombre: "Todos", id: "Todos" });
      return;
    }
    setPuestoSeleccionado({
      nombre: puestos[e.target.value].nombreCarro,
      id: puestos[e.target.value].id,
    });
  };

  useEffect(() => {
    const fetchEventos = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACK_URL}evento/all`,
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
          setEventoSeleccionado({ nombre: "Todos", id: "Todos" });
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

  useEffect(() => {
    const fetchPuestos = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACK_URL}puesto/`,
          {
            headers: {
              "Content-Type": "application/json",
              consumidorId: user?.id,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setPuestos(
            [{ nombreCarro: "Todos", id: "Todos" }, ...data?.data] || []
          );
          setPuestoSeleccionado({ nombre: "Todos", id: "Todos" });
        } else {
          console.error("Error al obtener puestos");
        }
      } catch (error) {
        console.error("Error en el fetch de puestos:", error);
      }
    };

    if (user?.id) {
      fetchPuestos();
    }
  }, [user]);

  const breadcrumbItems = [
    { title: "Inicio", url: "/inicio" },
    { title: "Estadisticas", url: "/grafica-encargado" },
  ];

  return (
    <div style={styles.container}>
      <Sidebar tipoUsuario={user?.tipoUsuario} />
      <h1 style={styles.header}>Estadísticas Encargado</h1>
      <select
        style={styles.select1}
        value={eventoSeleccionado?.id}
        onChange={handleEventoChange}
      >
        {eventos.map((evento) => (
          <option key={evento.id} value={evento.id}>
            {evento.nombre}
          </option>
        ))}
      </select>
      <select
        style={styles.select2}
        value={puestoSeleccionado?.id}
        onChange={handlePuestoChange}
      >
        {puestos.map((puesto) => (
          <option key={puesto.id} value={puesto.id}>
            {puesto.nombreCarro}
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
            style={{ marginLeft: "20px" }}
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
    </div>
  );
};

export default PanelEncargado;

import React, { useContext, useEffect, useState } from "react";
import Sidebar from "../../ComponentesGenerales/Sidebar";
import Footer from "../../ComponentesGenerales/Footer";
import TopPuestos from "./TopPuestos";
import GraficaBarras from "../GraficaBarras";
import { UserContext } from "../../ComponentesGenerales/UserContext";
import useDynamicColors from "../../../UseDinamicColors";
import TotalQuickFood from "./TotalGenerado";

const PanelProductor = () => {
  const { user } = useContext(UserContext);
  const Colors = useDynamicColors();
  const [eventos, setEventos] = useState([]);
  const [eventoSeleccionado, setEventoSeleccionado] = useState(null);
  console.log(eventoSeleccionado);

  useEffect(() => {
    const fetchEventos = async () => {
      try {
        const response = await fetch(`${process.env?.REACT_APP_BACK_URL}evento/all`, {
          headers: {
            "Content-Type": "application/json",
            consumidorId: user?.id, // Reemplaza con la propiedad correcta
          },
        });

        if (response.ok) {
          const data = await response.json();
          setEventos(data?.data || []);
          if (data?.data?.length > 0) {
            setEventoSeleccionado(data.data[0].id); // Selecciona el primer evento por defecto
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
    container: {
      height: "100vh",
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
    select: {
      borderRadius: "5px",
      backgroundColor: Colors.GrisAzuladoClaro,
      position: "absolute",
      top: "25px",
      right: "20px",
      border: "none",
      color: "white",
      padding: "5px",
      marginLeft: "20px",
    },
    hr: {
      color: Colors.Naranja,
      width: "100%",
      paddingBottom: "10px",
    },
    mainContent: {
      display: "flex",
      height: "75vh",
      backgroundColor: Colors.GrisAzuladoOscuro,
      marginBottom: "50px",
      marginLeft: "20%",
    },
    graficaContainer: {
      display: "grid",
      gridTemplateColumns: "repeat(7, 1fr)",
      gridTemplateRows: "repeat(6, 1fr)",
      gap: "20px",
      gridTemplateAreas: `
        "div1 div1 div2 div2 toppuestos toppuestos toppuestos"
        "div1 div1 div2 div2 toppuestos toppuestos toppuestos"
        "grafica grafica grafica grafica toppuestos toppuestos toppuestos"
        "grafica grafica grafica grafica toppuestos toppuestos toppuestos"
        "grafica grafica grafica grafica toppuestos toppuestos toppuestos"
        "grafica grafica grafica grafica toppuestos toppuestos toppuestos"
      `,
      marginLeft: "5%",
    },
    div2: {
      gridArea: "div2",
      marginTop: "20px",
      borderRadius: "20px",
      backgroundColor: Colors.AzulDashboard,
      paddingTop: "100px",
      backgroundImage: "url(./../../img/wave2.svg)",
      backgroundSize: "cover",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "100% 25%",
      border: "2px solid white",
      position: "relative",
    },
    graficaBarras: {
      gridArea: "grafica",
      borderRadius: "20px",
      marginBottom: "20px",
      marginLeft: "10px",
      border: "2px solid white",
      overflow: "hidden",
    },
    toppuestos: {
      gridArea: "toppuestos",
      marginTop: "20px",
      borderRadius: "20px",
      background: Colors.GrisAzuladoClaro,
      marginBottom: "20px",
      marginRight: "10px",
      border: "2px solid white",
    },
    footer: {
      marginTop: "auto",
    },
  };

  const handleEventoChange = (e) => {
    setEventoSeleccionado(e.target.value);
  };

  return (
    <div style={styles.container}>
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
      <Sidebar tipoUsuario={user?.tipoUsuario} />
      <div style={styles.mainContent}>
        <div style={styles.graficaContainer}>
          <TotalQuickFood eventId={eventoSeleccionado} />
          <div style={styles.div2}>
            <div style={{ position: "absolute", top: 0, left: 0 }}>
            </div>
            <div style={{ position: "absolute", bottom: 0, left: 0 }}>
              <h1 style={{ color: "white" }}>3.5/5</h1>
              <p>
                <strong style={{ color: "white" }}>
                  Valoración promedio en mis eventos
                </strong>
              </p>
            </div>
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
    </div>
  );
};

export default PanelProductor;

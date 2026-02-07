import React, { useEffect, useState, useContext } from "react";
import Footer from "../ComponentesGenerales/Footer";
import Sidebar from "../ComponentesGenerales/Sidebar";
import LoandingComponent from "../ComponentesGenerales/LoandingComponent";
import PuestoUser from "./PuestoUser";
import { useParams } from "react-router-dom";
import useDynamicColors from "../../UseDinamicColors";
import { UserContext } from "../ComponentesGenerales/UserContext";
import FiltersPuestosConsumidor from "../Filtros y Buscadores/filtersPuestosConsumidor";
import BuscadorPuestosConsumidor from "../Filtros y Buscadores/BuscadorPuestosConsumidor";
import Breadcrumb from "../ComponentesGenerales/Breadcrumb";
import { useLocation } from "react-router-dom";

const ListadoPuestosUser = () => {
  const Colors = useDynamicColors();
  const { idEvento } = useParams();
  const [loanding, setLoanding] = useState(false);
  const [rows, setRows] = useState([]);
  const [carritos, setCarritos] = useState([]);
  const [filteredCarritos, setFilteredCarritos] = useState([]); // Estado para los carritos filtrados
  const { user } = useContext(UserContext);
  const [estrella, setEstrella] = useState(0);
  const [tiempo, setTiempo] = useState(0);
  const [nombre, setNombre] = useState("");
  const [evento, setEvento] = useState({});
  const breadcrumbItems = [
    { title: "Inicio", url: "/inicio" },
    { title: "Eventos", url: "/Listado-eventos" },
    { title: "Puestos", url: `/listado-puestos/${idEvento}` },
  ];
  const location = useLocation();
  const selectedDay = location.state?.selectedDay || null;

  // Obtener datos iniciales
  useEffect(() => {
    setLoanding(false);
    const fetchPuestos = fetch(`${process.env?.REACT_APP_BACK_URL}puesto/evento/${idEvento}`, {
      method: "GET",
    }).then((response) => response.json());

    const fetchEvento = fetch(`${process.env?.REACT_APP_BACK_URL}evento/${idEvento}`, {
      method: "GET",
    }).then((response) => response.json());

    Promise.all([fetchPuestos, fetchEvento])
      .then(([puestosData, eventoData]) => {
        setCarritos(puestosData.data);
        setFilteredCarritos(puestosData.data);
        setEvento(eventoData.data);
        setLoanding(true);
      })
      .catch((error) => {
        console.log("Error al cargar datos.", error);
        setLoanding(true);
      });
  }, [user, idEvento]);

  // Filtrar carritos cuando cambien los filtros
  useEffect(() => {
    const applyFilters = () => {
      let filtered = [...carritos];
      // Filtrar por estrellas
      if (estrella > 0) {
        filtered = filtered.filter(
          (carrito) => carrito.estrella || 4.5 >= estrella
        );
      }
      // Filtrar por tiempo
      if (tiempo > 0) {
        filtered = filtered.filter((carrito) => carrito.tiempo || 30 <= tiempo);
      }
      console.log(filtered);
      // Filtrar por nombre
      if (nombre.trim() !== "") {
        const lowerCaseNombre = nombre.toLowerCase();
        filtered = filtered.filter(
          (carrito) =>
            carrito.nombreCarro?.toLowerCase().includes(lowerCaseNombre) ||
            carrito.tipoNegocio?.toLowerCase().includes(lowerCaseNombre)
        );
      }
      console.log(filtered);
      setFilteredCarritos(filtered);
    };

    applyFilters();
  }, [estrella, tiempo, nombre, carritos]);

  // Generar las filas para los carritos filtrados
  useEffect(() => {
    const totalCarritos = Math.ceil(filteredCarritos.length / 4) * 4;
    const carritosConNulos = [
      ...filteredCarritos,
      ...Array(totalCarritos - filteredCarritos.length).fill(null),
    ];

    const generatedRows = [];
    for (let i = 0; i < carritosConNulos.length; i += 4) {
      const row = carritosConNulos.slice(i, i + 4);
      generatedRows.push(row);
    }
    setRows(generatedRows);
  }, [filteredCarritos]);

  const styles = {
    container: {
      display: "flex",
      flexDirection: "row",
      backgroundColor: Colors.GrisAzuladoOscuro,
      height: "calc(100vh - 50px)",
      overflow: "hidden",
    },
    sidebar: {
      width: "20%",
      padding: 0,
      boxSizing: "border-box",
    },
    mainContent: {
      width: "80%",
      height: "100%",
      padding: 0,
      display: "flex",
      flexDirection: "column",
      boxSizing: "border-box",
    },
    contentRow: {
      display: "flex",
      gap: "20px",
      alignItems: "flex-start",
    },
    leftCol: {
      width: "70%",
      boxSizing: "border-box",
    },
    rightColInner: {
      width: "30%",
      boxSizing: "border-box",
      display: "flex",
      flexDirection: "column",
      gap: "12px",
      alignItems: "center",
    },
    header: {
      display: "flex",
      justifyContent: "flex-start",
      color: Colors.Naranja,
      paddingLeft: "16px",
    },
    title: {
      paddingTop: "10px",
      fontSize: "32px",
      fontWeight: "bold",
      margin: 0,
      width: "98%",
      textAlign: "left",
    },
    separator: {
      color: Colors.Naranja,
      border: "none",
      height: "2px",
      backgroundColor: Colors.Naranja,
    },
    eventsContainer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "100%",
      width: "100%",
      overflowY: "auto",
      overflowX: "hidden",
    },
    eventsWrapper: {
      height: "100%",
      width: "100%",
      display: "flex",
      flexWrap: "wrap",

      justifyContent: "center",
      gap: "10px",
      boxSizing: "border-box",
      overflowY: "scroll",
      overflowX: "hidden",
      scrollbarWidth: "none",
      msOverflowStyle: "none",
    },
    noEventsMessage: {
      fontSize: "24px",
      color: Colors.Naranja,
      textAlign: "center",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "80%",
      width: "80%",
    },
    rightCol: {
      width: "20%",
      padding: "20px",
      boxSizing: "border-box",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "12px",
    },
    buscadorBox: {
      width: "98%",
      border: `1px solid ${Colors.Naranja}`,
      borderRadius: "10px",
      padding: "8px 16px",
      boxSizing: "border-box",
    },
    filtroBox: {
      width: "98%",
      border: `1px solid ${Colors.Naranja}`,
      borderRadius: "10px",
      padding: "10px",
      boxSizing: "border-box",
      marginTop: "10px",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.sidebar}>
        <Sidebar tipoUsuario={user?.tipoUsuario} />
      </div>
      <div style={styles.mainContent}>
        <div style={styles.header}>
          <h1 style={styles.title}>{ `Puestos de ${evento.nombre}` || "Puestos"} </h1>
        </div>
        <hr style={styles.separator} />
        <div style={styles.contentRow}>
          <div style={styles.leftCol}>
            <div>
              <Breadcrumb items={breadcrumbItems} />
            </div>
            <div style={styles.eventsContainer}>
              <div style={styles.eventsWrapper}>
                {!loanding ? (
                  <LoandingComponent />
                ) : Array.isArray(filteredCarritos) && filteredCarritos.length > 0 ? (
                  rows.length > 0 &&
                  rows.map((row, rowIndex) => (
                    <div key={rowIndex} style={{ width: "100%" }}>
                      {row.map((carrito, index) => (
                        <div
                          key={index}
                          style={{ marginBottom: "10px", width: "100%" }}
                        >
                          {carrito !== null ? (
                            <PuestoUser carrito={carrito} selectedDay={selectedDay} evento={evento} />
                          ) : null}
                        </div>
                      ))}
                    </div>
                  ))
                ) : (
                    <h2 style={styles.noEventsMessage}>
                      No tienes ningún puesto en este momento.
                    </h2>
                  )}
              </div>
            </div>
          </div>

          <div style={styles.rightColInner}>
            <div style={styles.buscadorBox}>
              <BuscadorPuestosConsumidor setNombre={setNombre} />
            </div>
            <div style={styles.filtroBox}>
              <FiltersPuestosConsumidor
                setEstrella={setEstrella}
                setTiempo={setTiempo}
              />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ListadoPuestosUser;

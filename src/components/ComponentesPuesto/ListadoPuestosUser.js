import React, { useEffect, useState, useContext } from "react";
import Footer from "../ComponentesGenerales/Footer";
import Sidebar from "../ComponentesGenerales/Sidebar";
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
    fetch(`${process.env?.REACT_APP_BACK_URL}puesto/evento/${idEvento}`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        setCarritos(data.data);
        setFilteredCarritos(data.data); // Inicialmente todos los carritos están filtrados
      })
      .catch((error) => console.log("No existen carritos."));
  }, [user,idEvento]);

  useEffect(() => {
    fetch(`${process.env?.REACT_APP_BACK_URL}evento/${idEvento}`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        setEvento(data.data);
        console.log("evento",data.data);
      })
      .catch((error) => console.log("No existen eventos."));
  });

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
    header: {
      display: "flex",
      justifyContent: "center",
      color: Colors.Naranja,
    },
    title: {
      paddingTop: "10px",
      fontSize: "32px",
      fontWeight: "bold",
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
      width: "92.9%",
      marginLeft: "30px",
      overflowY: "auto",
      overflowX: "hidden",
    },
    eventsWrapper: {
      height: "100%",
      width: "100%",
      display: "flex",
      flexWrap: "wrap",

      justifyContent: "space-between",
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
    filtro: {
      width: "15%",
      position: "absolute",
      top: "230px",
      right: "2%",
      border: `1px solid ${Colors.Naranja}`,
      borderRadius: "10px",
      height: "fit-content",
      boxSizing: "border-box",
    },
    buscador: {
      width: "15%",
      position: "absolute",
      top: "90px",
      right: "2%",
      border: `1px solid ${Colors.Naranja}`,
      borderRadius: "10px",
      height: "fit-content",
      boxSizing: "border-box",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.sidebar}>
        <Sidebar tipoUsuario={user?.tipoUsuario} />
      </div>
      <div style={styles.buscador}>
        <BuscadorPuestosConsumidor setNombre={setNombre} />
      </div>
      <div style={styles.filtro}>
        <FiltersPuestosConsumidor
          setEstrella={setEstrella}
          setTiempo={setTiempo}
        />
      </div>
      <div style={styles.mainContent}>
        <div style={styles.header}>
          <h1 style={styles.title}>{ `Puestos de ${evento.nombre}` || "Puestos"} </h1>
        </div>
        <hr style={styles.separator} />
        <div>
          <Breadcrumb items={breadcrumbItems} />
        </div>
        <div style={styles.eventsContainer}>
          <div style={styles.eventsWrapper}>
            {Array.isArray(filteredCarritos) && filteredCarritos.length > 0 ? (
              rows.length > 0 &&
              rows.map((row, rowIndex) => (
                <div key={rowIndex} style={{ width: "95%" }}>
                  {row.map((carrito, index) => (
                    <div
                      key={index}
                      style={{ marginBottom: "10px", width: "100%" }}
                    >
                      {carrito !== null ? (
                        <PuestoUser carrito={carrito} selectedDay={selectedDay} />
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
      <Footer />
    </div>
  );
};

export default ListadoPuestosUser;

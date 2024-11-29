import React, { useEffect, useState, useContext } from "react";
import Sidebar from "../ComponentesGenerales/Sidebar";
import EventoUser from "./EventoUser";
import LoandingComponent from "../ComponentesGenerales/LoandingComponent";
import { UserContext } from "../ComponentesGenerales/UserContext";
import Footer from "../ComponentesGenerales/Footer";
import useDynamicColors from "../../UseDinamicColors";
import FiltersEventosConsumidor from "../Filtros y Buscadores/filtersEventosConsumidor";
import Buscador from "../Filtros y Buscadores/BuscadorEventosConsumidor";
import { useNavigate } from "react-router-dom";
import Breadcrumb from "../ComponentesGenerales/Breadcrumb";

const ListadoEventosUsers = () => {
  const navigate = useNavigate();
  const Colors = useDynamicColors();
  const [loanding, setLoanding] = useState(false);
  const [rows, setRows] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [filteredEventos, setFilteredEventos] = useState([]);
  const { user } = useContext(UserContext);

  const [distancia, setDistancia] = useState(100);
  const [nombre, setNombre] = useState("");
  const [preventa, setPreventa] = useState("");
  const breadcrumbItems = [
    { title: "Inicio", url: "/inicio" },
    { title: "Eventos", url: "/Listado-eventos" },
  ];

  useEffect(() => {
    if (user) {
      const headers = new Headers();
      headers.append("ConsumidorId", user.consumidorId);
      fetch(`${process.env?.REACT_APP_BACK_URL}evento/enEstado/EnCurso`, {
        method: "GET",
        headers: headers,
      })
        .then((response) => response.json())
        .then((data) => {
          setEventos(data.data);
          setFilteredEventos(data.data);
          generateRows(data.data);
          fetch(
            `${process.env?.REACT_APP_BACK_URL}evento/enEstado/Confirmado`,
            {
              method: "GET",
              headers: headers,
            }
          )
            .then((response) => response.json())
            .then((confirmadoData) => {
              const allEventos = [...data.data, ...confirmadoData.data];
              setEventos(allEventos);
              generateRows(allEventos);
            })
            .catch((error) =>
              console.log("Error fetching Confirmado eventos.", error)
            );
        })
        .catch((error) => console.log("No existen carritos.", error));
    }
    setLoanding(true);
  }, [user]);

  const handleVolver = (e) => {
    navigate(`/inicio`);
  };

  const generateRows = (eventosList) => {
    const totalEventos = Math.ceil(eventosList.length / 4) * 4;
    const eventosConNulos = [
      ...eventosList,
      ...Array(totalEventos - eventosList.length).fill(null),
    ];

    const generatedRows = [];
    for (let i = 0; i < eventosConNulos.length; i += 4) {
      const row = eventosConNulos.slice(i, i + 4);
      generatedRows.push(row);
    }
    setRows(generatedRows);
  };

  useEffect(() => {
    const applyFilters = () => {
      let filtered = eventos;

      if (distancia) {
        console.log("Distancia:", distancia);
        filtered = filtered.filter(
          (evento) => evento.distancia || 1 <= distancia
        );
      }
      if (nombre) {
        console.log("Nombre:", nombre);
        filtered = filtered.filter((evento) =>
          evento.nombre.toLowerCase().includes(nombre.toLowerCase())
        );
      }
      if (preventa) {
        console.log("Preventa:", preventa);
        filtered = filtered.filter(
          (evento) =>
            (evento.tienePreventa && preventa.conPreventa) ||
            (!evento.tienePreventa && preventa.sinPreventa)
        );
      }

      setFilteredEventos(filtered);
      generateRows(filtered);
    };

    applyFilters();
  }, [distancia, nombre, preventa, eventos]);

  const styles = {
    container: {
      display: "flex",
      flexDirection: "row",
      backgroundColor: Colors.GrisAzuladoOscuro,
      height: "calc(100vh - 50px)",
      width: "100%",
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
      color: "#fff",
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
      padding: "10px 0",
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
      top: "240px",
      right: "2%",
      border: `1px solid ${Colors.Naranja}`,
      borderRadius: "10px",
      height: "fit-content",
      boxSizing: "border-box",
    },
    buscador: {
      width: "15%",
      position: "absolute",
      top: "100px",
      right: "2%",
      border: `1px solid ${Colors.Naranja}`,
      borderRadius: "10px",
      height: "fit-content",
      boxSizing: "border-box",
    },
    button: {
      position: "absolute",
      top: "12px",
      left: "21%",
      color: Colors.Blanco,
      fontWeight: "bold",
      border: `1px solid ${Colors.Blanco}`,
      borderRadius: "10px",
      height: "fit-content",
      boxSizing: "border-box",
      backgroundColor: Colors.Naranja,
      padding: "10px 20px",
      cursor: "pointer",
    },
  };

  return (
    <div>
      <div style={styles.container}>
        <div style={styles.sidebar}>
          <Sidebar tipoUsuario={user?.tipoUsuario} />
        </div>
        <div style={styles.filtro}>
          <FiltersEventosConsumidor
            setDistancia={setDistancia}
            setPreventa={setPreventa}
          />
        </div>

        <div style={styles.buscador}>
          <Buscador setNombre={setNombre} />
        </div>
        <div style={styles.mainContent}>
          <div style={styles.header}>
            <h1 style={styles.title}>Eventos</h1>
          </div>
          <hr style={styles.separator} />
          <div>
            <Breadcrumb items={breadcrumbItems} />
          </div>
          <div style={styles.eventsContainer}>
            <div style={styles.eventsWrapper}>
              {!loanding ? (
                <LoandingComponent />
              ) : Array.isArray(filteredEventos) &&
                filteredEventos.length > 0 ? (
                rows.length > 0 &&
                rows.map((row, rowIndex) => (
                  <div key={rowIndex} style={{ width: "95%" }}>
                    {row.map((evento, index) => (
                      <div
                        key={index}
                        style={{ marginBottom: "10px", width: "100%" }}
                      >
                        {evento !== null ? (
                          <EventoUser evento={evento} />
                        ) : null}
                      </div>
                    ))}
                  </div>
                ))
              ) : (
                <h2 style={styles.noEventsMessage}>
                  No hay eventos activos en este momento.
                </h2>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ListadoEventosUsers;

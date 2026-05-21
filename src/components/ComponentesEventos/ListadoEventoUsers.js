import React, { useEffect, useState, useContext } from "react";
import PageLayout from "../ComponentesGenerales/PageLayout";
import EventoUser from "./EventoUser";
import LoandingComponent from "../ComponentesGenerales/LoandingComponent";
import { UserContext } from "../ComponentesGenerales/UserContext";
import Footer from "../ComponentesGenerales/Footer";
import FiltersEventosConsumidor from "../Filtros y Buscadores/filtersEventosConsumidor";
import Buscador from "../Filtros y Buscadores/BuscadorEventosConsumidor";
import Breadcrumb from "../ComponentesGenerales/Breadcrumb";

const ListadoEventosUsers = () => {
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
      setLoanding(false);
      const headers = new Headers();
      headers.append("ConsumidorId", user.consumidorId);
      fetch(`${process.env?.REACT_APP_BACK_URL}evento/enEstado/EnCurso`, {
        method: "GET",
        headers: headers,
      })
        .then((response) => response.json())
        .then((data) => {
          const eventosData = Array.isArray(data.data) ? data.data : [];
          setEventos(eventosData);
          setFilteredEventos(eventosData);
          generateRows(eventosData);
          return fetch(
            `${process.env?.REACT_APP_BACK_URL}evento/enEstado/Confirmado`,
            {
              method: "GET",
              headers: headers,
            }
          );
        })
        .then((response) => response.json())
        .then((confirmadoData) => {
          const confirmadoEventos = Array.isArray(confirmadoData.data) ? confirmadoData.data : [];
          setEventos((prev) => {
            const allEventos = [...prev, ...confirmadoEventos];
            generateRows(allEventos);
            return allEventos;
          });
          setLoanding(true);
        })
        .catch((error) => {
          console.log("Error fetching eventos.", error);
          setLoanding(true);
        });
    }
  }, [user]);

  const generateRows = (eventosList) => {
    const list = Array.isArray(eventosList) ? eventosList : [];
    const totalEventos = Math.ceil(list.length / 4) * 4;
    const eventosConNulos = [
      ...list,
      ...Array(totalEventos - list.length).fill(null),
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
      let filtered = Array.isArray(eventos) ? eventos : [];

      if (distancia) {
        filtered = filtered.filter(
          (evento) => (evento.distancia || 1) <= distancia
        );
      }
      if (nombre) {
        filtered = filtered.filter((evento) =>
          evento.nombre.toLowerCase().includes(nombre.toLowerCase())
        );
      }
      if (preventa) {
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
    mainContent: {
      width: "80%",
      height: "100%",
      padding: 0,
      display: "flex",
      flexDirection: "column",
      boxSizing: "border-box",
    },
    headerWrapper: {
      flexShrink: 0,
      width: "100%",
      backgroundColor: "var(--qf-bg-main)",
      zIndex: 10,
    },
    scrollableContent: {
      flex: 1,
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
    },
    contentRow: {
      display: "flex",
      gap: "20px",
      alignItems: "flex-start",
      height: "100%",
      overflow: "hidden",
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
      color: "var(--qf-naranja)",
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
      color: "var(--qf-naranja)",
      border: "none",
      height: "2px",
      backgroundColor: "var(--qf-naranja)",
    },
    eventsContainer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      height: "100%",
      width: "100%",
      overflowY: "auto",
      overflowX: "hidden",
    },
    eventsWrapper: {
      minHeight: "100%",
      width: "100%",
      display: "flex",
      flexDirection: "column",
      gap: "10px",
      boxSizing: "border-box",
      overflowY: "auto",
      overflowX: "hidden",
      scrollbarWidth: "none",
      msOverflowStyle: "none",
    },
    noEventsMessage: {
      fontSize: "24px",
      color: "var(--qf-naranja)",
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
      alignItems: "flex-start",
      gap: "12px",
    },
    buscadorBox: {
      width: "98%",
      border: `1px solid var(--qf-naranja)`,
      borderRadius: "10px",
      padding: "8px 16px",
      boxSizing: "border-box",
    },
    filtroBox: {
      width: "98%",
      border: `1px solid var(--qf-naranja)`,
      borderRadius: "10px",
      padding: "10px",
      boxSizing: "border-box",
      marginTop: "10px",
    },
  };

  return (
    <PageLayout sidebarProps={{ tipoUsuario: user?.tipoUsuario }}>
      <div style={styles.mainContent}>
        <div style={styles.headerWrapper}>
          <div style={styles.header}>
            <h1 style={styles.title}>Eventos</h1>
          </div>
          <hr style={styles.separator} />
        </div>
        <div style={styles.scrollableContent}>
          <div style={styles.contentRow}>
        <div style={styles.leftCol}>
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
                  <div key={rowIndex} style={{ width: "100%" }}>
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

        <div style={styles.rightColInner}>
          <div style={styles.buscadorBox}>
            <Buscador setNombre={setNombre} />
          </div>
          <div style={styles.filtroBox}>
            <FiltersEventosConsumidor
              setDistancia={setDistancia}
              setPreventa={setPreventa}
            />
          </div>
        </div>
      </div>
        </div>
      </div>

      <Footer />
    </PageLayout>
  );
};

export default ListadoEventosUsers;

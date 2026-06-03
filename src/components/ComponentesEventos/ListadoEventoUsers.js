import React, { useEffect, useState, useContext } from "react";
import PageLayout from "../ComponentesGenerales/PageLayout";
import EventoUser from "./EventoUser";
import LoandingComponent from "../ComponentesGenerales/LoandingComponent";
import { UserContext } from "../ComponentesGenerales/UserContext";
import Footer from "../ComponentesGenerales/Footer";
import FiltersEventosConsumidor from "../Filtros y Buscadores/filtersEventosConsumidor";
import Buscador from "../Filtros y Buscadores/BuscadorEventosConsumidor";
import Breadcrumb from "../ComponentesGenerales/Breadcrumb";
import useBreakpoint from "../../useBreakpoint";

const ListadoEventosUsers = () => {
  const { isMobile, isTablet } = useBreakpoint();
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

  return (
    <PageLayout sidebarProps={{ tipoUsuario: user?.tipoUsuario }}>
      <div style={{
        width: isMobile ? "100%" : "80%",
        height: "100%",
        padding: 0,
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
        flex: 1,
      }}>
        {/* Header */}
        <div className="qf-page-header">
          <h1 className="qf-page-title">Eventos</h1>
          <hr className="qf-separator" />
        </div>

        {/* Contenido scrollable con dos columnas */}
        <div style={{
          flex: 1,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}>
          <div style={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            gap: "20px",
            alignItems: isMobile ? "stretch" : "flex-start",
            height: isMobile ? "auto" : "100%",
            overflow: isMobile ? "visible" : "hidden",
          }}>
            {/* Columna izquierda: listado de eventos */}
            <div style={{
              width: isMobile ? "100%" : isTablet ? "65%" : "70%",
              boxSizing: "border-box",
            }}>
              <div style={{ paddingLeft: "16px" }}>
                <Breadcrumb items={breadcrumbItems} />
              </div>

              <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                height: "100%",
                width: "100%",
                overflowY: "auto",
                overflowX: "hidden",
              }}>
                <div style={{
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
                }}>
                  {!loanding ? (
                    <LoandingComponent />
                  ) : Array.isArray(filteredEventos) && filteredEventos.length > 0 ? (
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
                    <h2 style={{
                      fontSize: "24px",
                      color: "var(--qf-naranja)",
                      textAlign: "center",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "80%",
                      width: "80%",
                    }}>
                      No hay eventos activos en este momento.
                    </h2>
                  )}
                </div>
              </div>
            </div>

            {/* Columna derecha: buscador + filtros */}
            <div style={{
              width: isMobile ? "100%" : isTablet ? "35%" : "30%",
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              alignItems: "center",
              order: isMobile ? -1 : 0,
            }}>
              <div className="qf-search-box">
                <Buscador setNombre={setNombre} />
              </div>
              <div className="qf-filter-box">
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

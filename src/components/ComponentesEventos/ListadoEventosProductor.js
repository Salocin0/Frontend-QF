import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageLayout from "../ComponentesGenerales/PageLayout";
import EventoProductor from "./EventoProductor";
import { UserContext } from "../ComponentesGenerales/UserContext";
import { useContext } from "react";
import Footer from "../ComponentesGenerales/Footer";
import { useNavigate } from "react-router-dom";
import Breadcrumb from "../ComponentesGenerales/Breadcrumb";
import Buscador from "../Filtros y Buscadores/Buscador";
import Filtros from "../Filtros y Buscadores/Filtros";
import { CircularProgress } from "@mui/material";

const ListadoEventosProductor = () => {
  const [eventos, setEventos] = useState([]);
  const [recargar, setRecargar] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterState, setFilterState] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const recargarComponente = () => {
    console.log("Recargando componente");
    setTimeout(() => {
      setRecargar(recargar + 1);
    }, 100);
  };

  const parseDate = (dateStr) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? null : date;
  };

  useEffect(() => {
    if (user) {
      console.log("llega a pedir");
      const headers = new Headers();
      headers.append("ConsumidorId", user.consumidorId);

      setIsLoading(true);
      fetch(`${process.env?.REACT_APP_BACK_URL}evento/all`, {
        method: "GET",
        headers: headers,
      })
        .then((response) => response.json())
        .then((data) => {
          const eventosProcesados = data.data.map((evento) => ({
            ...evento,
            fechaInicio: parseDate(evento.fechaHoraInicio),
            horaInicio: parseDate(evento.fechaHoraInicio),
            fechaFin: parseDate(evento.fechaHoraFin),
          }));

          setEventos(eventosProcesados);
        })
        .catch((error) => console.log("No existen eventos.", error))
        .finally(() => setIsLoading(false));
    }
  }, [user, recargar]);

  const agregarNuevo = () => {
    navigate(`/registrar-evento2`);
  };

  const normalizarEstadoFiltro = (estado) => {
    if (!estado) return estado;
    return estado.startsWith("EnPreparacion") ? "EnPreparacion" : estado;
  };

  // helper group for estados
  const estadoGroup = {
    nombre: 'estado',
    opciones: Array.from(
      new Set(eventos.map((e) => normalizarEstadoFiltro(e.estado)))
    ).map((estado) => ({
      valor: estado,
      etiqueta: estado ? estado.replace(/([A-Z])/g, ' $1').trim() : estado,
    })),
  };

  // compute filtered list
  const filteredEventos = eventos.filter((evento) => {
    const matchesSearch = searchTerm
      ? evento.nombre?.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    const matchesState = filterState
      ? normalizarEstadoFiltro(evento.estado) === filterState
      : true;
    return matchesSearch && matchesState;
  });

  const styles = {
    colContent: {
      marginLeft: "20%",
      width: "calc(100% - 20%)",
      height: "100%",
      overflowY: "auto",
      msOverflowStyle: "none",
      scrollbarWidth: "none",
      WebkitScrollbar: { display: "none" },
    },
    container: {
      paddingBottom: "60px",
      paddingLeft: "20px",
      paddingRight: "20px",
      width: "100%",
      flexDirection: "column",
    },
    sectionTitle: {
      display: "flex",
      justifyContent: "center",
      marginBottom: "1rem",
      paddingTop: "2rem",
      width: "100%",
      color: "var(--qf-naranja)",
    },
    breadcrumbWrapper: {
      width: "Calc(100%)",
      paddingTop: "0px",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    },
    filtersContainer: {
      width: "320px",
      minWidth: "320px",
      alignSelf: "flex-start",
      height: "auto",
      borderRadius: "8px",
      padding: "20px",
      paddingTop: "10px",
      marginLeft: "20px",
      marginRight: "20px",
      marginTop: "0",
      backgroundColor: "var(--qf-bg-secondary)",
      border: `1px solid var(--qf-naranja)`,
    },
    searchFilterContainer: {
      display: "flex",
      flexDirection: "column",
      gap: "20px",
      flex: "none",
      maxWidth: "100%",
      marginTop: "0",
      width: "100%",
    },
    agregarEventoButton: {
      backgroundColor: "var(--qf-green)",
      color: "white",
      padding: "15px 20px",
      borderRadius: "10px",
      border: "none",
      cursor: "pointer",
      width: "100%",
      fontSize: "16px",
      fontWeight: "bold",
      marginTop: "20px",
    },
    contenedorGrid: {
      textAlign: "center",
      padding: "40px 20px",
      margin: "40px",
    },
    descripcion: {
      marginBottom: "20px",
      fontSize: "18px",
      color: "var(--qf-text-primary)",
    },
    linkAgregarEvento: {
      textDecoration: "none",
      backgroundColor: "var(--qf-naranja)",
      padding: "10px 20px",
      color: "var(--qf-text-primary)",
      borderRadius: "5px",
      fontWeight: "bold",
      fontSize: "18px",
      transition: "background-color 0.3s",
      display: "inline-block",
    },
  };

  const breadcrumbItems = [
    { title: "Inicio", url: "/inicio" },
    { title: "Mis Eventos", url: "/listado-eventos-productor" },
  ];

  return (
    <PageLayout sidebarProps={{ tipoUsuario: user?.tipoUsuario }}>
      <div style={styles.colContent}>
          <div style={styles.sectionTitle}>
            <h1>Eventos</h1>
          </div>
          <hr style={{ color: "var(--qf-naranja)" }} />
          {/* main content with sidebar filters */}
          <div style={{ display: 'flex', width: 'calc(100% - 40px)', alignItems: 'flex-start', marginRight: '20px' }}>
            <div style={{ flex: '0 0 calc(70% - 0px)', width: 'calc(70% - 0px)' }}>
              <div style={styles.breadcrumbWrapper}>
                <Breadcrumb
                  items={breadcrumbItems}
                  style={{
                    width: "Calc(100% - 40px)",
                    marginLeft: "Calc(20px)",
                  }}
                />
              </div>
              <div style={styles.container}>
                {isLoading || !user ? (
                  <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "3rem", height: "300px" }}>
                    <CircularProgress style={{ color: "var(--qf-naranja)" }} />
                  </div>
                ) : filteredEventos.length > 0 ? (
                  filteredEventos.map((evento, index) => (
                    <EventoProductor
                      key={index}
                      evento={evento}
                      recargarComponente={recargarComponente}
                    />
                  ))
                ) : (
                  <div style={styles.contenedorGrid}>
                    <div style={{ fontSize: "1.5rem", color: "var(--qf-naranja)" }}>
                      <h2>Eventos</h2>
                    </div>
                    <div style={styles.descripcion}>
                      <p>
                        Con Quickfood, crea tu evento para hacerlo mejor. Descubre
                        nuestras increíbles características y ofrece una experiencia
                        única a tus consumidores.
                      </p>
                    </div>
                    <Link to={`/registrar-evento`} style={styles.linkAgregarEvento}>
                      Crear Evento
                    </Link>
                  </div>
                )}
              </div>
            </div>
            {/* sidebar */}
            <div style={{ ...styles.filtersContainer, flex: '0 0 calc(30% - 0px)', width: 'calc(30% - 0px)', paddingTop: "10px" }}>
              <div style={{ ...styles.searchFilterContainer, marginTop: '10px' }}>
                <Buscador
                  placeholder="Buscar eventos..."
                  onBuscar={setSearchTerm}
                  style={{ display: 'flex', width: '100%' }}
                />
                <Filtros
                  gruposFiltros={[estadoGroup]}
                  onFiltrar={(f) => setFilterState(f.estado || '')}
                  titulo="ESTADOS"
                />
                <button onClick={agregarNuevo} style={styles.agregarEventoButton}>
                  Agregar Evento
                </button>
              </div>
            </div>
        </div>
      </div>
      <Footer />
    </PageLayout>
  );
};

export default ListadoEventosProductor;

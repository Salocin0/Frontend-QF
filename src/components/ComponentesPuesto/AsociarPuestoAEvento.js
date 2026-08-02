import React, { useContext, useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { FaChevronDown } from "react-icons/fa";
import EventoEncargado from "../ComponentesEventos/EventoEncargado";
import PageLayout from "../ComponentesGenerales/PageLayout";
import { UserContext } from "../ComponentesGenerales/UserContext";
import Breadcrumb from "../ComponentesGenerales/Breadcrumb";
import LoandingComponent from "../ComponentesGenerales/LoandingComponent";
import Footer from "../ComponentesGenerales/Footer";
import Buscador from "../Filtros y Buscadores/Buscador";
import Filtros from "../Filtros y Buscadores/Filtros";

const AsociarPuestoAEvento = () => {
  const { puestoId } = useParams();
  const { user } = useContext(UserContext);
  const [eventos, setEventos] = useState([]);
  const [recargar, setRecargar] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterState, setFilterState] = useState("");

  const contentRef = useRef(null);
  const [contentWidth, setContentWidth] = useState(999);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const isNarrowLayout = contentWidth <= 780;

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      setContentWidth(entry.contentRect.width);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const recargarComponente = () => {
    setRecargar(+1);
  };

  useEffect(() => {
    if (user) {
      const headers = new Headers();
      headers.append("ConsumidorId", user.consumidorId);

      setIsLoading(true);
      const estadosEnPreparacion = ["EnPreparacion1", "EnPreparacion2", "EnPreparacion3", "Confirmado"];
      Promise.all(
        estadosEnPreparacion.map((estado) =>
          fetch(`${process.env?.REACT_APP_BACK_URL}evento/enEstado/${estado}`, {
            method: "GET",
            headers: headers,
          })
            .then((response) => response.json())
            .then((data) => (Array.isArray(data.data) ? data.data : []))
            .catch(() => [])
        )
      )
        .then((resultados) => setEventos(resultados.flat()))
        .catch((error) => console.log("No existen eventos.", error))
        .finally(() => setIsLoading(false));
    }
  }, [user, recargar]);

  const normalizarEstadoFiltro = (estado) => {
    if (!estado) return estado;
    return estado.startsWith("EnPreparacion") ? "EnPreparacion" : estado;
  };

  const estadoGroup = {
    nombre: "estado",
    opciones: Array.from(
      new Set(eventos.map((e) => normalizarEstadoFiltro(e.estado)))
    ).map((estado) => ({
      valor: estado,
      etiqueta: estado ? estado.replace(/([A-Z])/g, " $1").trim() : estado,
    })),
  };

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
    pagina: {
      display: "flex",
      flexDirection: "column",
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
      margin: "10px 0",
      width: "100%",
    },
    breadcrumbWrapper: {
      width: "100%",
      marginBottom: "10px",
    },
    eventsContainer: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    eventsList: {
      display: "flex",
      flexDirection: "column",
      gap: "10px",
      paddingBottom: "1.5rem",
      width: "100%",
    },
    noEventsMessage: {
      fontSize: "1.5rem",
      color: "var(--qf-naranja)",
      textAlign: "center",
    },
  };

  const breadcrumbItems = [
    { title: "Inicio", url: "/inicio" },
    { title: "Mis Puestos", url: "/listado-puestos-encargado" },
    { title: "Asociarme a un Evento", url: `/asociarPuestoAEvento/${puestoId}` },
  ];

  return (
    <PageLayout sidebarProps={{ tipoUsuario: user?.tipoUsuario }}>
      <div style={styles.pagina}>
        {/* Título centrado */}
        <h1 style={styles.tituloSeccion}>Asociate a un Evento</h1>

        <hr style={styles.hrFull} />

        <div
          ref={contentRef}
          className={`qf-page-content ${isNarrowLayout ? "qf-page-content--narrow" : ""}`}
        >
          <div className="qf-page-content__main">
            {/* Breadcrumb a ancho completo */}
            <div style={styles.breadcrumbWrapper}>
              <Breadcrumb
                items={breadcrumbItems}
                style={{ width: "100%", margin: "8px 0" }}
              />
            </div>

            {/* En modo angosto: buscador + filtros colapsables antes del listado */}
            {isNarrowLayout && (
              <div className="qf-narrow-filters" style={{ marginBottom: "8px" }}>
                <div className="qf-search-box" style={{ marginBottom: "8px" }}>
                  <Buscador
                    placeholder="Buscar eventos..."
                    onBuscar={setSearchTerm}
                    botonBuscar={false}
                  />
                </div>
                <div className="qf-filter-box" style={{ margin: 0 }}>
                  <div
                    className="qf-collapsible-header"
                    onClick={() => setFiltersOpen((prev) => !prev)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && setFiltersOpen((prev) => !prev)}
                  >
                    <span className="qf-collapsible-title">ESTADOS</span>
                    <FaChevronDown className={`qf-collapsible-icon ${filtersOpen ? "qf-collapsible-icon--open" : ""}`} />
                  </div>
                  {filtersOpen && (
                    <div className="qf-collapsible-body">
                      <Filtros
                        gruposFiltros={[estadoGroup]}
                        onFiltrar={(f) => setFilterState(f.estado || "")}
                        titulo="ESTADOS"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Lista de eventos */}
            <div style={styles.eventsContainer}>
              <div style={styles.eventsList}>
                {isLoading ? (
                  <LoandingComponent />
                ) : filteredEventos.length > 0 ? (
                    filteredEventos.map((evento, index) => (
                      <EventoEncargado
                        key={index}
                        evento={evento}
                        puestoId={puestoId}
                        recargar={recargarComponente}
                      />
                    ))
                ) : (
                  <h2 style={styles.noEventsMessage}>
                    No hay eventos activos en este momento.
                  </h2>
                )}
              </div>
            </div>
          </div>

          {/* Aside: buscador + filtros (solo en layout ancho) */}
          {!isNarrowLayout && (
            <aside className="qf-page-content__aside">
              <div className="qf-search-box">
                <Buscador
                  placeholder="Buscar eventos..."
                  onBuscar={setSearchTerm}
                  botonBuscar={false}
                />
              </div>
              <div className="qf-filter-box">
                <Filtros
                  gruposFiltros={[estadoGroup]}
                  onFiltrar={(f) => setFilterState(f.estado || "")}
                  titulo="ESTADOS"
                />
              </div>
            </aside>
          )}
        </div>
      </div>
      <Footer />
    </PageLayout>
  );
};

export default AsociarPuestoAEvento;

import React, { useContext, useEffect, useState, useRef } from "react";
import { CircularProgress } from "@mui/material";
import { FaChevronDown } from "react-icons/fa";
import PageLayout from "../ComponentesGenerales/PageLayout";
import "./../sass/main.scss";
import EventoRepartidor from "./EventoRepartidor";
import { UserContext } from "../ComponentesGenerales/UserContext";
import Breadcrumb from "../ComponentesGenerales/Breadcrumb";
import Footer from "../ComponentesGenerales/Footer";
import Buscador from "../Filtros y Buscadores/Buscador";
import Filtros from "../Filtros y Buscadores/Filtros";

const AsociarRepartidorAEvento = () => {
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

  const breadcrumbItems = [
    { title: "Inicio", url: "/inicio" },
    { title: "Asociarte a evento", url: "/asociarRepartidorAEvento" },
  ];

  return (
    <PageLayout sidebarProps={{ tipoUsuario: user?.tipoUsuario }}>
      <div style={{ width: "100%" }}>
        {/* Header centrado */}
        <div className="qf-page-header--full" style={{ paddingTop: "1rem" }}>
          <h1 style={{ color: "var(--qf-naranja)", textAlign: "center" }}>
            Asociate a un Evento
          </h1>
        </div>
        <hr className="qf-separator qf-separator--spaced" />

        <div
          ref={contentRef}
          className={`qf-page-content ${isNarrowLayout ? "qf-page-content--narrow" : ""}`}
        >
          <div className="qf-page-content__main">
            {/* Breadcrumb con borde dorado */}
            <Breadcrumb
              items={breadcrumbItems}
              style={{
                border: "1px solid var(--qf-naranja)",
                width: "100%",
                margin: 0,
              }}
            />

            {/* En modo angosto: buscador + filtros colapsables antes del listado */}
            {isNarrowLayout && (
              <div className="qf-narrow-filters" style={{ margin: "8px 0" }}>
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

            {/* Listado de eventos */}
            <div style={{ padding: "1rem 0 2rem 0" }}>
              {isLoading ? (
                <div style={{ display: "flex", justifyContent: "center", marginTop: "3rem" }}>
                  <CircularProgress style={{ color: "var(--qf-naranja)" }} />
                </div>
              ) : filteredEventos.length > 0 ? (
                <div>
                  {filteredEventos.map((evento, index) => (
                    <div key={index}>
                      <EventoRepartidor
                        evento={evento}
                        recargar={recargarComponente}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <h2
                  style={{
                    color: "var(--qf-naranja)",
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  No hay eventos activos en este momento.
                </h2>
              )}
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

export default AsociarRepartidorAEvento;

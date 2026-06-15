import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { FaChevronDown } from "react-icons/fa";
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

  const estadoGroup = {
    nombre: 'estado',
    opciones: Array.from(
      new Set(eventos.map((e) => normalizarEstadoFiltro(e.estado)))
    ).map((estado) => ({
      valor: estado,
      etiqueta: estado ? estado.replace(/([A-Z])/g, ' $1').trim() : estado,
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
    { title: "Mis Eventos", url: "/listado-eventos-productor" },
  ];

  return (
    <PageLayout sidebarProps={{ tipoUsuario: user?.tipoUsuario }}>
      <div style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        flex: 1,
        minHeight: 0,
        boxSizing: "border-box",
      }}>
        {/* Header full-width */}
        <div className="qf-page-header qf-page-header--full" style={{ textAlign: "center" }}>
          <h1 className="qf-page-title" style={{ textAlign: "center", fontSize: "1.75rem" }}>
            Eventos
          </h1>
          <hr className="qf-separator qf-separator--spaced" />
        </div>

        {/* Contenido en dos columnas */}
        <div
          ref={contentRef}
          className={`qf-page-content ${isNarrowLayout ? "qf-page-content--narrow" : ""}`}
          style={{ flex: 1, minHeight: 0 }}
        >
          {/* Columna principal: breadcrumb + listado */}
          <div className="qf-page-content__main">
            <Breadcrumb items={breadcrumbItems} style={{
              margin: 0,
              backgroundColor: 'var(--qf-bg-secondary)',
              width: '100%',
              padding: '8px 16px',
              borderRadius: '10px',
              border: '1px solid var(--qf-naranja)',
              boxSizing: 'border-box',
            }} />

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
                      onFiltrar={(f) => setFilterState(f.estado || '')}
                      titulo="ESTADOS"
                    />
                  </div>
                )}
              </div>
              <button
                onClick={agregarNuevo}
                className="qf-btn qf-btn--primary"
                style={{ width: "100%", marginTop: "8px" }}
              >
                Agregar Evento
              </button>
            </div>
          )}

          <div className="qf-scrollable" style={{ paddingTop: "8px", paddingBottom: "60px" }}>
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
              <div style={{ textAlign: "center", padding: "40px 20px", margin: "40px" }}>
                <div style={{ fontSize: "1.5rem", color: "var(--qf-naranja)" }}>
                  <h2>Eventos</h2>
                </div>
                <div style={{ marginBottom: "20px", fontSize: "18px", color: "var(--qf-text-primary)" }}>
                  <p>
                    Con Quickfood, crea tu evento para hacerlo mejor. Descubre
                    nuestras increíbles características y ofrece una experiencia
                    única a tus consumidores.
                  </p>
                </div>
                <Link
                  to={`/registrar-evento`}
                  style={{
                    textDecoration: "none",
                    backgroundColor: "var(--qf-naranja)",
                    padding: "10px 20px",
                    color: "var(--qf-text-primary)",
                    borderRadius: "5px",
                    fontWeight: "bold",
                    fontSize: "18px",
                    transition: "background-color 0.3s",
                    display: "inline-block",
                  }}
                >
                  Crear Evento
                </Link>
              </div>
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
                onFiltrar={(f) => setFilterState(f.estado || '')}
                titulo="ESTADOS"
              />
            </div>
            <button
              onClick={agregarNuevo}
              className="qf-btn qf-btn--primary"
              style={{ width: "100%" }}
            >
              Agregar Evento
            </button>
          </aside>
        )}
        </div>

      </div>

      <Footer />
    </PageLayout>
  );
};

export default ListadoEventosProductor;

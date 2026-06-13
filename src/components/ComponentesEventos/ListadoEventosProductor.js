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
import useBreakpoint from "../../useBreakpoint";

const ListadoEventosProductor = () => {
  const { isMobile } = useBreakpoint();
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
      <div className="qf-page-content" style={{ padding: isMobile ? "0 12px" : "0", height: "100%" }}>
        {/* Columna principal */}
        <div className="qf-page-content__main">
          <div className="qf-page-header">
            <h1 className="qf-page-title">Eventos</h1>
            <hr className="qf-separator" />
          </div>

          <div style={{ paddingLeft: "16px" }}>
            <Breadcrumb items={breadcrumbItems} />
          </div>

          <div className="qf-scrollable" style={{ padding: "0 16px", paddingBottom: "60px" }}>
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

        {/* Aside: buscador + filtros */}
        <aside className="qf-page-content__aside" style={{ padding: "16px" }}>
          <div className="qf-search-box">
            <Buscador
              placeholder="Buscar eventos..."
              onBuscar={setSearchTerm}
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
      </div>
      <Footer />
    </PageLayout>
  );
};

export default ListadoEventosProductor;

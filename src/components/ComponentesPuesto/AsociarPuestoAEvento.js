import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FaArrowLeft, FaCalendarAlt } from "react-icons/fa";
import EventoEncargado from "../ComponentesEventos/EventoEncargado";
import PageLayout from "../ComponentesGenerales/PageLayout";
import { UserContext } from "../ComponentesGenerales/UserContext";
import Breadcrumb from "../ComponentesGenerales/Breadcrumb";
import Footer from "../ComponentesGenerales/Footer";
import "../ComponentesGenerales/ListFilters.css";
import "./AsociacionesPuesto.css";
import LoadingSpinner from "../ComponentesGenerales/LoadingSpinner";

const ASSOCIATION_EVENT_STATES = ["EnPreparacion", "EnPreparacion1", "EnPreparacion2", "EnPreparacion3", "Confirmado"];
const normalizeStatus = (value) => value?.startsWith("EnPreparacion") ? "EnPreparacion" : value;
const statusLabel = (value) => value === "EnPreparacion" ? "En preparación" : value || "Sin estado";
const AsociarPuestoAEvento = () => {
  const { puestoId } = useParams();
  const { user } = useContext(UserContext);
  const [eventos, setEventos] = useState([]);
  const [recargar, setRecargar] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const consumerId = user?.consumidorId;
  useEffect(() => {
    if (!consumerId) return;
    const controller = new AbortController();
    setLoading(true); setError(false);
    (async () => {
      try {
        const results = await Promise.all(ASSOCIATION_EVENT_STATES.map(async (state) => {
          const response = await fetch(`${process.env.REACT_APP_BACK_URL}evento/enEstado/${state}`, { method: "GET", headers: { ConsumidorId: consumerId }, signal: controller.signal });
          if (response.status === 404) return [];
          if (!response.ok) throw new Error("No se pudieron cargar los eventos");
          const data = await response.json();
          return Array.isArray(data.data) ? data.data : [];
        }));
        if (!controller.signal.aborted) setEventos([...new Map(results.flat().map((event) => [event.id, event])).values()]);
      } catch (err) { if (!controller.signal.aborted) setError(true); }
      finally { if (!controller.signal.aborted) setLoading(false); }
    })();
    return () => controller.abort();
  }, [consumerId, recargar]);
  const filtered = eventos.filter((event) => (!status || normalizeStatus(event.estado) === status) && String(event.nombre || "").toLocaleLowerCase("es").includes(search.trim().toLocaleLowerCase("es")));
  return <PageLayout sidebarProps={{ tipoUsuario: user?.tipoUsuario }}>
    <main className="qf-stand-associations-page">
      <Breadcrumb items={[{ title: "Inicio", url: "/inicio" }, { title: "Mis puestos", url: "/listado-puestos-encargado" }, { title: "Asociar a un evento", url: `/asociarPuestoAEvento/${puestoId}` }]} />
      <header className="qf-associations-heading"><div><h1>Asociá tu puesto a un evento</h1><p>Explorá los eventos disponibles y solicitá participar con tu puesto de comida.</p></div><Link className="qf-associations-button" to="/listado-puestos-encargado"><FaArrowLeft aria-hidden="true" /> Mis puestos</Link></header>
      <section className="qf-list-filters qf-associations-filters" aria-label="Filtros de eventos"><label htmlFor="association-search">Buscar evento<input id="association-search" type="search" placeholder="Nombre del evento" value={search} onChange={(event) => setSearch(event.target.value)} /></label><label htmlFor="association-status">Estado<select id="association-status" value={status} onChange={(event) => setStatus(event.target.value)}><option value="">Todos los estados</option>{[...new Set(eventos.map((event) => normalizeStatus(event.estado)).filter(Boolean))].map((state) => <option key={state} value={state}>{statusLabel(state)}</option>)}</select></label></section>
      {loading || !consumerId ? <div className="qf-associations-feedback" role="status"><LoadingSpinner label="Cargando eventos disponibles…" /></div> : error ? <div className="qf-associations-feedback" role="alert"><h2>No pudimos cargar los eventos</h2><p>Intentá nuevamente en unos instantes.</p><button className="qf-associations-button" onClick={() => setRecargar((value) => value + 1)}>Reintentar</button></div> : <><p className="qf-associations-count" aria-live="polite">{filtered.length} {filtered.length === 1 ? "evento disponible" : "eventos disponibles"}</p>{filtered.length ? <div className="qf-associations-events">{filtered.map((event) => <EventoEncargado key={event.id} evento={event} puestoId={puestoId} recargar={() => setRecargar((value) => value + 1)} />)}</div> : <div className="qf-associations-feedback"><FaCalendarAlt aria-hidden="true" /><h2>{search || status ? "No encontramos eventos con esos filtros" : "Todavía no hay eventos disponibles"}</h2><p>{search || status ? "Probá con otro nombre o estado." : "Los eventos disponibles para asociar tu puesto aparecerán acá."}</p>{(search || status) && <button className="qf-associations-button" onClick={() => { setSearch(""); setStatus(""); }}>Limpiar filtros</button>}</div>}</>}
    </main><Footer />
  </PageLayout>;
};
export default AsociarPuestoAEvento;

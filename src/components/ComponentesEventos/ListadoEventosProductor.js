import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaPlus, FaCalendarAlt } from "react-icons/fa";
import PageLayout from "../ComponentesGenerales/PageLayout";
import EventoProductor from "./EventoProductor";
import { UserContext } from "../ComponentesGenerales/UserContext";
import Footer from "../ComponentesGenerales/Footer";
import Breadcrumb from "../ComponentesGenerales/Breadcrumb";
import "../ComponentesGenerales/ListFilters.css";
import "./EventosProductor.css";
import LoadingSpinner from "../ComponentesGenerales/LoadingSpinner";

const normalizeState = (state) => state?.startsWith("EnPreparacion") ? "EnPreparacion" : state;
const stateLabel = (state) => state === "EnPreparacion" ? "En preparación" : String(state || "Sin estado").replace(/([a-z])([A-Z])/g, "$1 $2");
const parseDate = (value) => { if (!value) return null; const date = new Date(value); return Number.isNaN(date.getTime()) ? null : date; };
export const filterProducerEvents = (events, search, state) => events.filter((event) => (!state || normalizeState(event.estado) === state) && String(event.nombre || "").toLocaleLowerCase("es").includes(search.trim().toLocaleLowerCase("es")));

const ListadoEventosProductor = () => {
  const { user } = useContext(UserContext);
  const [events, setEvents] = useState([]);
  const [attempt, setAttempt] = useState(0);
  const [search, setSearch] = useState("");
  const [state, setState] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const consumerId = user?.consumidorId;
  useEffect(() => {
    if (!consumerId) return;
    const controller = new AbortController();
    setLoading(true); setError(false);
    (async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACK_URL}evento/all`, { method: "GET", headers: { ConsumidorId: consumerId }, signal: controller.signal });
        if (!response.ok) throw new Error("No se pudieron cargar los eventos");
        const result = await response.json();
        const data = Array.isArray(result.data) ? result.data : [];
        if (!controller.signal.aborted) setEvents(data.map((event) => ({ ...event, fechaInicio: parseDate(event.fechaHoraInicio), horaInicio: parseDate(event.fechaHoraInicio), fechaFin: parseDate(event.fechaHoraFin) })));
      } catch (err) { if (!controller.signal.aborted) setError(true); }
      finally { if (!controller.signal.aborted) setLoading(false); }
    })();
    return () => controller.abort();
  }, [consumerId, attempt]);
  const filtered = filterProducerEvents(events, search, state);
  return <PageLayout sidebarProps={{ tipoUsuario: user?.tipoUsuario }}>
    <main className="qf-producer-events-page">
      <Breadcrumb items={[{ title: "Inicio", url: "/inicio" }, { title: "Mis eventos", url: "/listado-eventos-productor" }]} />
      <header className="qf-producer-events-heading"><div><h1>Mis eventos</h1><p>Administrá tus eventos, revisá las solicitudes y consultá su estado.</p></div><Link className="qf-producer-event-button qf-producer-event-button--primary" to="/registrar-evento2"><FaPlus aria-hidden="true" /> Agregar evento</Link></header>
      <section className="qf-list-filters qf-producer-event-filters" aria-label="Filtros de mis eventos"><label htmlFor="producer-event-search">Buscar evento<input id="producer-event-search" type="search" placeholder="Nombre del evento" value={search} onChange={(event) => setSearch(event.target.value)} /></label><label htmlFor="producer-event-state">Estado<select id="producer-event-state" value={state} onChange={(event) => setState(event.target.value)}><option value="">Todos los estados</option>{[...new Set(events.map((event) => normalizeState(event.estado)).filter(Boolean))].map((value) => <option key={value} value={value}>{stateLabel(value)}</option>)}</select></label></section>
      {loading || !consumerId ? <div className="qf-producer-events-feedback" role="status"><LoadingSpinner label="Cargando tus eventos…" /></div> : error ? <div className="qf-producer-events-feedback" role="alert"><h2>No pudimos cargar tus eventos</h2><p>Intentá nuevamente en unos instantes.</p><button className="qf-producer-event-button" type="button" onClick={() => setAttempt((value) => value + 1)}>Reintentar</button></div> : <><p className="qf-producer-events-count" aria-live="polite">{filtered.length} {filtered.length === 1 ? "evento" : "eventos"}{search || state ? ` de ${events.length}` : ""}</p>{filtered.length ? <div className="qf-producer-events-list">{filtered.map((event) => <EventoProductor key={event.id} evento={event} recargarComponente={() => setAttempt((value) => value + 1)} />)}</div> : <div className="qf-producer-events-feedback"><FaCalendarAlt aria-hidden="true" /><h2>{search || state ? "No encontramos eventos con esos filtros" : "Tu próximo evento empieza acá"}</h2><p>{search || state ? "Probá otro nombre o seleccioná un estado diferente." : "Creá tu primer evento para organizar los puestos y recibir solicitudes."}</p>{search || state ? <button className="qf-producer-event-button" type="button" onClick={() => { setSearch(""); setState(""); }}>Limpiar filtros</button> : <Link className="qf-producer-event-button qf-producer-event-button--primary" to="/registrar-evento2">Crear evento</Link>}</div>}</>}
    </main><Footer />
  </PageLayout>;
};
export default ListadoEventosProductor;

import React, { useContext, useEffect, useState } from "react";
import { FaCalendarAlt } from "react-icons/fa";
import PageLayout from "../ComponentesGenerales/PageLayout";
import EventoRepartidor from "./EventoRepartidor";
import { UserContext } from "../ComponentesGenerales/UserContext";
import Breadcrumb from "../ComponentesGenerales/Breadcrumb";
import Footer from "../ComponentesGenerales/Footer";
import "../ComponentesGenerales/ListFilters.css";
import "../ComponentesEventos/EventosProductor.css";
import "./EventosRepartidor.css";

const normalizeState = (state) => state?.startsWith("EnPreparacion") ? "EnPreparacion" : state;
const labelState = (state) => state === "EnPreparacion" ? "En preparación" : state;
const AsociarRepartidorAEvento = () => {
  const { user } = useContext(UserContext);
  const [eventos, setEventos] = useState([]);
  const [attempt, setAttempt] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState("");
  const [state, setState] = useState("");
  const consumerId = user?.consumidorId;
  const reload = () => setAttempt((value) => value + 1);
  useEffect(() => {
    if (consumerId == null) return;
    const controller = new AbortController();
    setLoading(true); setError(false);
    (async () => {
      try {
        const results = await Promise.all(["EnPreparacion", "EnPreparacion1", "EnPreparacion2", "EnPreparacion3", "Confirmado"].map(async (status) => {
          const response = await fetch(`${process.env.REACT_APP_BACK_URL}evento/enEstado/${status}`, { method: "GET", headers: { ConsumidorId: consumerId }, signal: controller.signal });
          if (!response.ok) throw new Error("No se pudieron cargar los eventos");
          const result = await response.json();
          return Array.isArray(result.data) ? result.data : [];
        }));
        if (!controller.signal.aborted) setEventos(Array.from(new Map(results.flat().map((event) => [event.id, event])).values()));
      } catch (err) { if (!controller.signal.aborted) setError(true); }
      finally { if (!controller.signal.aborted) setLoading(false); }
    })();
    return () => controller.abort();
  }, [consumerId, attempt]);
  const filtered = eventos.filter((event) => (!state || normalizeState(event.estado) === state) && String(event.nombre || "").toLocaleLowerCase("es").includes(search.trim().toLocaleLowerCase("es")));
  const states = Array.from(new Set(eventos.map((event) => normalizeState(event.estado)).filter(Boolean)));
  return <PageLayout sidebarProps={{ tipoUsuario: user?.tipoUsuario }}><main className="qf-producer-events-page qf-courier-events-page">
    <Breadcrumb items={[{ title: "Inicio", url: "/inicio" }, { title: "Asociarme a un evento", url: "/asociarRepartidorAEvento" }]} />
    <header className="qf-producer-events-heading"><div><h1>Asociarme a un evento</h1><p>Encontrá un evento y enviá tu solicitud para participar como repartidor.</p></div></header>
    <section className="qf-list-filters qf-producer-event-filters" aria-label="Filtros de eventos"><label htmlFor="courier-event-search">Buscar evento<input id="courier-event-search" type="search" placeholder="Nombre del evento…" value={search} onChange={(event) => setSearch(event.target.value)} /></label><label htmlFor="courier-event-state">Estado<select id="courier-event-state" value={state} onChange={(event) => setState(event.target.value)}><option value="">Todos los estados</option>{states.map((status) => <option key={status} value={status}>{labelState(status)}</option>)}</select></label></section>
    {loading ? <p className="qf-producer-events-feedback" role="status">Cargando eventos…</p> : error ? <div className="qf-producer-events-feedback" role="alert"><h2>No pudimos cargar los eventos</h2><p>Intentá nuevamente en unos instantes.</p><button type="button" className="qf-producer-event-button" onClick={reload}>Reintentar</button></div> : <><p className="qf-producer-events-count" aria-live="polite">{filtered.length} {filtered.length === 1 ? "evento disponible" : "eventos disponibles"}</p>{filtered.length ? <div className="qf-producer-events-list">{filtered.map((event) => <EventoRepartidor key={event.id} evento={event} recargar={reload} />)}</div> : <div className="qf-producer-events-feedback"><FaCalendarAlt aria-hidden="true" /><h2>{search || state ? "No encontramos eventos con esos filtros" : "Todavía no hay eventos disponibles"}</h2><p>{search || state ? "Probá otro nombre o seleccioná otro estado." : "Los eventos disponibles para asociarte aparecerán acá."}</p>{(search || state) && <button type="button" className="qf-producer-event-button" onClick={() => { setSearch(""); setState(""); }}>Limpiar filtros</button>}</div>}</>}
  </main><Footer /></PageLayout>;
};
export default AsociarRepartidorAEvento;

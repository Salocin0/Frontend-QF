import React, { useEffect, useState, useContext, useRef } from "react";
import { Dialog } from "@mui/material";
import { Link } from "react-router-dom";
import { FaCalendarAlt, FaMapMarkerAlt, FaPlus, FaTimes, FaMotorcycle, FaBoxOpen } from "react-icons/fa";
import { toast } from "react-toastify";
import PageLayout from "../ComponentesGenerales/PageLayout";
import { UserContext } from "../ComponentesGenerales/UserContext";
import HistorialEntregasEvento from "./HistorialEntregasEvento";
import imgDefault from "../img/qf-new-logo-transparent.png";
import Footer from "../ComponentesGenerales/Footer";
import Breadcrumb from "../ComponentesGenerales/Breadcrumb";
import { formatUbicacion } from "../ComponentesGenerales/Utils/formatUbicacion";
import "../ComponentesGenerales/ListFilters.css";
import "../ComponentesEventos/EventosProductor.css";
import "./EventosRepartidor.css";
import LoadingSpinner from "../ComponentesGenerales/LoadingSpinner";

const stateLabel = (state) => ({ PendienteDeAceptacion: "Pendiente", ConObservacion: "Con observación" }[state] || state || "Sin asociación informada");
const dateLabel = (value) => value && !Number.isNaN(new Date(value).getTime()) ? new Date(value).toLocaleDateString("es-AR") : "Sin fecha informada";
const AsociacionesR = () => {
  const { user } = useContext(UserContext);
  const consumerId = user?.consumidorId;
  const [eventos, setEventos] = useState([]);
  const [asociaciones, setAsociaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [search, setSearch] = useState("");
  const [state, setState] = useState("");
  const [selected, setSelected] = useState(null);
  const [historyEvent, setHistoryEvent] = useState(null);
  const [saving, setSaving] = useState(false);
  const savingRef = useRef(false);
  const reload = () => setAttempt((value) => value + 1);
  const close = () => { if (!savingRef.current) setSelected(null); };
  useEffect(() => {
    if (consumerId == null) return;
    const controller = new AbortController();
    setLoading(true); setError(false);
    (async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACK_URL}asociacion/buscarR/${consumerId}`, { method: "GET", headers: { ConsumidorId: consumerId }, signal: controller.signal });
        if (!response.ok) throw new Error("No se pudieron cargar las asociaciones");
        const result = await response.json();
        if (!controller.signal.aborted) { setEventos(Array.isArray(result.data?.eventos) ? result.data.eventos : []); setAsociaciones(Array.isArray(result.data?.asociaciones) ? result.data.asociaciones : []); }
      } catch (err) { if (!controller.signal.aborted) setError(true); }
      finally { if (!controller.signal.aborted) setLoading(false); }
    })();
    return () => controller.abort();
  }, [consumerId, attempt]);
  const cancel = async () => {
    if (savingRef.current || selected?.asociacion?.estado !== "PendienteDeAceptacion") return;
    savingRef.current = true; setSaving(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_BACK_URL}asociacion/cambiarEstado/${selected.asociacion.id}/cancelar`, { method: "POST" });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || data.msg || "No pudimos cancelar la asociación. Intentá nuevamente.");
      }
      toast.success("Asociación cancelada correctamente"); setSelected(null); reload();
    } catch (err) { toast.error(err.message || "No pudimos cancelar la asociación. Intentá nuevamente."); }
    finally { savingRef.current = false; setSaving(false); }
  };
  const rows = eventos.map((evento) => ({ evento, asociacion: asociaciones.find((association) => String(association.eventoId) === String(evento.id)) }));
  const filtered = rows.filter(({ evento, asociacion }) => (!state || asociacion?.estado === state) && String(evento.nombre || "").toLocaleLowerCase("es").includes(search.trim().toLocaleLowerCase("es")));
  const states = Array.from(new Set(asociaciones.map((association) => association.estado).filter(Boolean)));
  return <PageLayout sidebarProps={{ tipoUsuario: user?.tipoUsuario }}>
    <main className="qf-producer-events-page qf-courier-events-page">
      <Breadcrumb items={[{ title: "Inicio", url: "/inicio" }, { title: "Mis asociaciones", url: "/misAsociacionesR" }]} />
      <header className="qf-producer-events-heading"><div><h1>Mis asociaciones</h1><p>Seguí el estado de tus solicitudes para participar como repartidor.</p></div><Link className="qf-producer-event-button qf-producer-event-button--primary" to="/asociarRepartidorAEvento"><FaPlus aria-hidden="true" /> Asociarme a un evento</Link></header>
      <section className="qf-list-filters qf-producer-event-filters" aria-label="Filtros de asociaciones"><label htmlFor="courier-association-search">Buscar evento<input id="courier-association-search" type="search" placeholder="Nombre del evento…" value={search} onChange={(event) => setSearch(event.target.value)} /></label><label htmlFor="courier-association-state">Estado de la solicitud<select id="courier-association-state" value={state} onChange={(event) => setState(event.target.value)}><option value="">Todos los estados</option>{states.map((status) => <option key={status} value={status}>{stateLabel(status)}</option>)}</select></label></section>
      {loading ? <p className="qf-producer-events-feedback" role="status"><LoadingSpinner label=<LoadingSpinner label="Cargando asociaciones…" /> /></p> : error ? <div className="qf-producer-events-feedback" role="alert"><h2>No pudimos cargar tus asociaciones</h2><p>Intentá nuevamente en unos instantes.</p><button type="button" className="qf-producer-event-button" onClick={reload}>Reintentar</button></div> : <><p className="qf-producer-events-count" aria-live="polite">{filtered.length} {filtered.length === 1 ? "asociación" : "asociaciones"}</p>{filtered.length ? <div className="qf-producer-events-list">{filtered.map(({ evento, asociacion }) => {
        const image = evento.img && !String(evento.img).includes("vendimia.mendoza.gov.ar") ? evento.img : imgDefault;
        return <article key={evento.id} className="qf-producer-event-card qf-courier-event-card" aria-label={evento.nombre}>
          <div className={`qf-producer-event-image${image === imgDefault ? " qf-courier-event-image--logo" : ""}`}><img src={image} alt={evento.nombre} onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = imgDefault; event.currentTarget.parentElement.classList.add("qf-courier-event-image--logo"); }} /></div>
          <div className="qf-producer-event-body"><header className="qf-producer-event-title"><h2>{evento.nombre}</h2><span className={`qf-producer-event-state qf-courier-association-state qf-courier-association-state--${asociacion?.estado}`}>{stateLabel(asociacion?.estado)}</span></header>{evento.descripcion && <p className="qf-courier-event-description">{evento.descripcion}</p>}
            <dl className="qf-courier-event-data"><div><dt><FaMapMarkerAlt aria-hidden="true" /> Ubicación</dt><dd>{formatUbicacion(evento) || "Sin ubicación informada"}</dd></div><div><dt><FaCalendarAlt aria-hidden="true" /> Inicio</dt><dd>{dateLabel(evento.fechaHoraInicio)}</dd></div><div><dt><FaCalendarAlt aria-hidden="true" /> Fin</dt><dd>{dateLabel(evento.fechaHoraFin)}</dd></div></dl>
            <footer className="qf-courier-event-actions"><button type="button" className="qf-producer-event-button" onClick={() => setHistoryEvent(evento)}><FaBoxOpen aria-hidden="true" /> Mis entregas</button>{asociacion?.estado === "PendienteDeAceptacion" && <><button type="button" className="qf-producer-event-button" onClick={() => setSelected({ evento, asociacion })}><FaTimes aria-hidden="true" /> Cancelar asociación</button></>}</footer>
          </div>
        </article>;
      })}</div> : <div className="qf-producer-events-feedback"><FaMotorcycle aria-hidden="true" /><h2>{search || state ? "No encontramos asociaciones con esos filtros" : "Todavía no tenés asociaciones"}</h2><p>{search || state ? "Probá otro nombre o seleccioná otro estado." : "Buscá un evento y enviá tu solicitud para participar como repartidor."}</p>{search || state ? <button type="button" className="qf-producer-event-button" onClick={() => { setSearch(""); setState(""); }}>Limpiar filtros</button> : <Link className="qf-producer-event-button" to="/asociarRepartidorAEvento">Explorar eventos</Link>}</div>}</>}
    </main><Footer />
    {historyEvent && <HistorialEntregasEvento evento={historyEvent} consumidorId={consumerId} onClose={() => setHistoryEvent(null)} />}
    <Dialog open={Boolean(selected)} onClose={close} fullWidth maxWidth="sm" className="qf-courier-association-dialog" aria-labelledby="courier-cancel-title" slotProps={{ paper: { className: "qf-courier-association-paper" } }}>
      <header><div><span>Solicitud pendiente</span><h2 id="courier-cancel-title">Cancelar asociación</h2></div><button type="button" className="qf-courier-dialog-close" aria-label="Cerrar" disabled={saving} onClick={close}><FaTimes aria-hidden="true" /></button></header>
      <div className="qf-courier-dialog-body"><p>¿Querés cancelar tu solicitud de participación en este evento?</p><dl className="qf-courier-event-data"><div><dt>Evento</dt><dd>{selected?.evento.nombre}</dd></div><div><dt>Ubicación</dt><dd>{selected ? formatUbicacion(selected.evento) : ""}</dd></div></dl><footer className="qf-courier-event-actions"><button type="button" className="qf-producer-event-button" onClick={close} disabled={saving}>Volver</button><button type="button" className="qf-producer-event-button qf-producer-event-button--primary" onClick={cancel} disabled={saving}>{saving ? "Cancelando…" : "Confirmar cancelación"}</button></footer></div>
    </Dialog>
  </PageLayout>;
};
export default AsociacionesR;

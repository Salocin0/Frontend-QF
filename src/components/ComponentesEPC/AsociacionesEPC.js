import React, { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FaStore, FaMapMarkerAlt, FaTimes, FaLink } from "react-icons/fa";
import { toast } from "react-toastify";
import PageLayout from "../ComponentesGenerales/PageLayout";
import { UserContext } from "../ComponentesGenerales/UserContext";
import imgDefault from "../img/qf-new-logo-transparent.png";
import Footer from "../ComponentesGenerales/Footer";
import Breadcrumb from "../ComponentesGenerales/Breadcrumb";
import ConfirmDialog from "../ComponentesGenerales/ConfirmDialog";
import { formatUbicacion } from "../ComponentesGenerales/Utils/formatUbicacion";
import "../ComponentesGenerales/ListFilters.css";
import "./AsociacionesEPC.css";
import LoadingSpinner from "../ComponentesGenerales/LoadingSpinner";

const formatState = (state) => state === "PendienteDeAceptacion" ? "Pendiente de aceptación" : String(state || "Sin estado").replace(/([a-z])([A-Z])/g, "$1 $2");
const associationFor = (associations, event) => associations.find((association) => String(association.eventoId) === String(event.id));

const AsociacionesEPC = () => {
  const { user } = useContext(UserContext);
  const [eventos, setEventos] = useState([]);
  const [asociaciones, setAsociaciones] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [toCancelId, setToCancelId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [cancelling, setCancelling] = useState(false);
  const busy = useRef(false);
  const consumerId = user?.consumidorId;
  useEffect(() => {
    if (!consumerId) return;
    const controller = new AbortController();
    setLoading(true); setError(false);
    (async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACK_URL}asociacion/buscar/${consumerId}`, { method: "GET", headers: { ConsumidorId: consumerId }, signal: controller.signal });
        if (!response.ok) throw new Error("No se pudieron cargar las asociaciones");
        const result = await response.json();
        if (!controller.signal.aborted) {
          setEventos(Array.isArray(result.data?.eventos) ? result.data.eventos : []);
          setAsociaciones(Array.isArray(result.data?.asociaciones) ? result.data.asociaciones : []);
        }
      } catch (err) { if (!controller.signal.aborted) setError(true); }
      finally { if (!controller.signal.aborted) setLoading(false); }
    })();
    return () => controller.abort();
  }, [consumerId, attempt]);
  const doCancel = async () => {
    if (busy.current || toCancelId == null || !asociaciones.some((association) => association.id === toCancelId && association.estado === "PendienteDeAceptacion")) return;
    busy.current = true; setCancelling(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_BACK_URL}asociacion/cambiarEstado/${toCancelId}/cancelar`, { method: "POST" });
      if (!response.ok) throw new Error("No pudimos cancelar la asociación. Intentá nuevamente.");
      toast.success("Asociación cancelada correctamente");
      setToCancelId(null);
      setAttempt((value) => value + 1);
    } catch (err) { toast.error(err.message); setToCancelId(null); }
    finally { busy.current = false; setCancelling(false); }
  };
  const filtered = eventos.filter((event) => (!status || associationFor(asociaciones, event)?.estado === status) && String(event.nombre || "").toLocaleLowerCase("es").includes(search.trim().toLocaleLowerCase("es")));
  return <PageLayout sidebarProps={{ tipoUsuario: user?.tipoUsuario }}>
    <main className="qf-my-associations-page">
      <Breadcrumb items={[{ title: "Inicio", url: "/inicio" }, { title: "Mis asociaciones", url: "/misAsociacionesEPC" }]} />
      <header className="qf-my-associations-heading"><div><h1>Mis asociaciones</h1><p>Consultá los eventos a los que te asociaste y el estado de cada solicitud.</p></div><Link className="qf-my-associations-button" to="/listado-puestos-encargado"><FaStore aria-hidden="true" /> Mis puestos</Link></header>
      <section className="qf-list-filters qf-my-associations-filters" aria-label="Filtros de asociaciones"><label htmlFor="my-association-search">Buscar evento<input id="my-association-search" type="search" placeholder="Nombre del evento" value={search} onChange={(event) => setSearch(event.target.value)} /></label><label htmlFor="my-association-state">Estado de la asociación<select id="my-association-state" value={status} onChange={(event) => setStatus(event.target.value)}><option value="">Todos los estados</option>{[...new Set(asociaciones.map((association) => association.estado).filter(Boolean))].map((state) => <option key={state} value={state}>{formatState(state)}</option>)}</select></label></section>
      {loading || !consumerId ? <div className="qf-my-associations-feedback" role="status"><LoadingSpinner label="Cargando asociaciones…" /></div> : error ? <div className="qf-my-associations-feedback" role="alert"><h2>No pudimos cargar tus asociaciones</h2><button className="qf-my-associations-button" onClick={() => setAttempt((value) => value + 1)}>Reintentar</button></div> : <><p className="qf-my-associations-count" aria-live="polite">{filtered.length} {filtered.length === 1 ? "evento asociado" : "eventos asociados"}</p>{filtered.length ? <div className="qf-my-associations-list">{filtered.map((event) => <EventoCard key={event.id} evento={event} asociacion={associationFor(asociaciones, event)} disabled={cancelling} onCancelar={setToCancelId} />)}</div> : <div className="qf-my-associations-feedback"><FaLink aria-hidden="true" /><h2>{search || status ? "No encontramos asociaciones con esos filtros" : "Todavía no tenés asociaciones"}</h2><p>{search || status ? "Probá otro nombre o estado para encontrar tu solicitud." : "Elegí uno de tus puestos para asociarlo a un evento disponible."}</p>{search || status ? <button className="qf-my-associations-button" onClick={() => { setSearch(""); setStatus(""); }}>Limpiar filtros</button> : <Link className="qf-my-associations-button" to="/listado-puestos-encargado">Ver mis puestos</Link>}</div>}</>}
    </main>
    <ConfirmDialog open={toCancelId != null} title="Confirmar cancelación" message={cancelling ? "Cancelando la asociación…" : "¿Estás seguro de que querés cancelar esta asociación?"} onConfirm={doCancel} onCancel={() => { if (!busy.current) setToCancelId(null); }} />
    <Footer />
  </PageLayout>;
};

const EventoCard = ({ evento, asociacion, onCancelar, disabled }) => {
  const state = asociacion?.estado;
  const tone = state === "PendienteDeAceptacion" ? "pending" : ["Cancelada", "Cancelado", "Rechazada", "Rechazado"].includes(state) ? "inactive" : "neutral";
  return <article className="qf-my-association-card">
    <div className="qf-my-association-image"><img src={evento.img && !String(evento.img).includes("vendimia.mendoza.gov.ar") ? evento.img : imgDefault} alt={evento.nombre} onError={(event) => { if (event.currentTarget.getAttribute("src") !== imgDefault) event.currentTarget.src = imgDefault; }} /></div>
    <div className="qf-my-association-body"><div className="qf-my-association-title"><h2>{evento.nombre}</h2><span className={`qf-my-association-state qf-my-association-state--${tone}`}>{formatState(state)}</span></div><p className="qf-my-association-description">{evento.descripcion}</p><p className="qf-my-association-location"><FaMapMarkerAlt aria-hidden="true" />{formatUbicacion(evento)}</p>{state === "PendienteDeAceptacion" && <footer><span>Tu solicitud está pendiente de aceptación.</span><button type="button" className="qf-my-associations-button qf-my-association-cancel" disabled={disabled} onClick={() => onCancelar(asociacion.id)}><FaTimes aria-hidden="true" /> Cancelar asociación</button></footer>}</div>
  </article>;
};
export default AsociacionesEPC;

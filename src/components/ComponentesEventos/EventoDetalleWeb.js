import React, { useEffect, useState, useCallback, useContext } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import PageLayout from "../ComponentesGenerales/PageLayout";
import Footer from "../ComponentesGenerales/Footer";
import ConfirmDialog from "../ComponentesGenerales/ConfirmDialog";
import Breadcrumb from "../ComponentesGenerales/Breadcrumb";
import { UserContext } from "../ComponentesGenerales/UserContext";
import { Dialog } from "@mui/material";
import { FaArrowLeft, FaCalendarAlt, FaMapMarkerAlt, FaClock, FaTimes, FaMap, FaPen } from "react-icons/fa";
import "./EventoDetalleWeb.css";
import useBreakpoint from "../../useBreakpoint";
import imgDefault from "../img/qf-new-logo-transparent.png";
import { formatUbicacion } from "../ComponentesGenerales/Utils/formatUbicacion";
import { seguirPreparando } from "./seguirPreparando";

// El valor de "action" viaja tal cual a POST evento/cambiarEstado/:id/:accion
// y el backend lo usa para invocar el método homónimo del estado actual
// (ver BackendNode-QF/src/estados/estadosConcretosEventos/*.state.js), que
// siempre tiene el sufijo "Evento" (confirmarEvento, cancelarEvento, etc.).
const SEGUIR_PREPARANDO = "seguirPreparando";

const STATE_ACTIONS = {
  EnPreparacion: [
    { label: "Confirmar Evento", action: "confirmarEvento", className: "qf-btn qf-btn--primary" },
    { label: "Cancelar Evento", action: "cancelarEvento", className: "qf-btn qf-btn--danger" },
  ],
  // A draft cannot be confirmed yet: it resumes the creation wizard at its pending step.
  EnPreparacion1: [
    { label: "Seguir preparando", action: SEGUIR_PREPARANDO, className: "qf-btn qf-btn--primary" },
    { label: "Cancelar Evento", action: "cancelarEvento", className: "qf-btn qf-btn--danger" },
  ],
  // A draft cannot be confirmed yet: it resumes the creation wizard at its pending step.
  EnPreparacion2: [
    { label: "Seguir preparando", action: SEGUIR_PREPARANDO, className: "qf-btn qf-btn--primary" },
    { label: "Cancelar Evento", action: "cancelarEvento", className: "qf-btn qf-btn--danger" },
  ],
  EnPreparacion3: [
    { label: "Confirmar Evento", action: "confirmarEvento", className: "qf-btn qf-btn--primary" },
    { label: "Cancelar Evento", action: "cancelarEvento", className: "qf-btn qf-btn--danger" },
  ],
  Confirmado: [
    { label: "Pausar Evento", action: "pausarEvento", className: "qf-btn qf-btn--primary" },
    { label: "Iniciar Evento", action: "iniciarEvento", className: "qf-btn qf-btn--success" },
    { label: "Cancelar Evento", action: "cancelarEvento", className: "qf-btn qf-btn--danger" },
  ],
  EnCurso: [
    { label: "Finalizar Evento", action: "finalizarEvento", className: "qf-btn qf-btn--danger" },
  ],
  Pausado: [
    { label: "Cancelar Evento", action: "cancelarEvento", className: "qf-btn qf-btn--danger" },
    { label: "Preparar Evento", action: "reprogramarEvento", className: "qf-btn qf-btn--primary" },
    { label: "Continuar Evento", action: "continuarEvento", className: "qf-btn qf-btn--success" },
  ],
};

const formatDate = (dateOrStr) => {
  if (!dateOrStr) return "";
  const d = typeof dateOrStr === "string" ? new Date(dateOrStr) : dateOrStr;
  return isNaN(d.getTime()) ? "" : d.toLocaleDateString("es-AR");
};

const formatTime = (dateOrStr) => {
  if (!dateOrStr) return "";
  const d = typeof dateOrStr === "string" ? new Date(dateOrStr) : dateOrStr;
  return isNaN(d.getTime()) ? "" : d.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });
};

const formatDateShort = (dateOrStr) => {
  if (!dateOrStr) return "";
  const d = typeof dateOrStr === "string" ? new Date(dateOrStr) : dateOrStr;
  return isNaN(d.getTime()) ? "" : d.toLocaleDateString("es-AR", { day: "numeric", month: "numeric" });
};

const EventoDetalleWeb = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isMobile } = useBreakpoint();
  const { user } = useContext(UserContext);

  const [evento, setEvento] = useState(null);
  const [puntosEncuentro, setPuntosEncuentro] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    title: "",
    message: "",
    action: "",
  });

  const [mapPunto, setMapPunto] = useState(null);

  const backUrl = process.env.REACT_APP_BACK_URL;

  const fetchData = useCallback(async () => {
    if (!user) return;
    const headers = new Headers();
    headers.append("ConsumidorId", String(user.consumidorId));

    setLoading(true);
    setError(null);
    try {
      const [eventoRes, puntosRes] = await Promise.all([
        fetch(`${backUrl}evento/${id}`, { method: "GET", headers }),
        fetch(`${backUrl}puntosEncuentro/${id}`, { method: "GET", headers }),
      ]);

      if (!eventoRes.ok) throw new Error("Error fetching event");
      const eventoData = await eventoRes.json();
      const puntosData = puntosRes.ok ? await puntosRes.json() : { data: [] };

      setEvento(eventoData.data || eventoData);
      setPuntosEncuentro(Array.isArray(puntosData.data) ? puntosData.data : []);
    } catch (err) {
      console.error("Error al cargar los datos del evento:", err);
      setError("Error al cargar los datos del evento");
      toast.error("Error al cargar los datos del evento");
    } finally {
      setLoading(false);
    }
  }, [id, user, backUrl]);

  useEffect(() => {
    if (user) fetchData();
  }, [fetchData, user]);

  const handleStateAction = (action, label) => {
    if (action === SEGUIR_PREPARANDO) {
      seguirPreparando(evento, navigate);
      return;
    }
    setConfirmDialog({
      open: true,
      title: label,
      message: `¿Está seguro de que desea ${label.toLowerCase()}?`,
      action,
    });
  };

  const handleConfirm = async () => {
    const { action } = confirmDialog;
    setConfirmDialog({ open: false, title: "", message: "", action: "" });

    const headers = new Headers();
    headers.append("ConsumidorId", String(user.consumidorId));

    try {
      const res = await fetch(`${backUrl}evento/cambiarEstado/${id}/${action}`, {
        method: "POST",
        headers,
      });
      if (!res.ok) throw new Error("Error changing state");
      await fetchData();
    } catch (err) {
      console.error("Error al cambiar estado del evento:", err);
      toast.error("Error al cambiar el estado del evento");
    }
  };

  const handleCancel = () => {
    setConfirmDialog({ open: false, title: "", message: "", action: "" });
  };
  const imageSrc = evento?.img && !String(evento.img).includes("vendimia.mendoza.gov.ar")
    ? evento.img
    : imgDefault;

  const formatearEstado = (estado) => {
    if (!estado) return estado;
    if (estado.startsWith("EnPreparacion")) return "En Preparación";
    if (estado === "EnCurso") return "En Curso";
    return estado.replace(/([A-Z])/g, ' $1').trim();
  };

  const actions = evento?.estado ? (STATE_ACTIONS[evento.estado] || []) : [];

  // Derives fechas from diaEventos like EventoUser does
  const eventoFechaInicio = evento?.diaEventos?.length
    ? new Date(Math.min(...evento.diaEventos.map((d) => new Date(d.fechaHoraInicioDiaEvento))))
    : evento?.fechaHoraInicio ? new Date(evento.fechaHoraInicio) : null;
  const eventoFechaFin = evento?.diaEventos?.length
    ? new Date(Math.max(...evento.diaEventos.map((d) => new Date(d.fechaHoraFinDiaEvento))))
    : evento?.fechaHoraFin ? new Date(evento.fechaHoraFin) : null;

  const breadcrumbItems = [
    { title: "Inicio", url: "/inicio" },
    { title: "Mis Eventos", url: "/listado-eventos-productor" },
    { title: evento?.nombre || "Evento", url: `/evento-detalle/${id}` },
  ];

  if (loading) return <PageLayout sidebarProps={{ tipoUsuario: user?.tipoUsuario }}><main className="qf-event-detail-page"><p className="qf-event-detail-feedback" role="status">Cargando...</p></main><Footer /></PageLayout>;
  if (error || !evento) return <PageLayout sidebarProps={{ tipoUsuario: user?.tipoUsuario }}><main className="qf-event-detail-page"><div className="qf-event-detail-feedback" role="alert"><p>{error || "Error al cargar los datos del evento"}</p><button className="qf-event-detail-button" type="button" onClick={fetchData}>Reintentar</button></div></main><Footer /></PageLayout>;

  return (
    <PageLayout sidebarProps={{ tipoUsuario: user?.tipoUsuario }}>
      <main className="qf-event-detail-page">
        <Breadcrumb items={breadcrumbItems} />
        <header className="qf-event-detail-page-heading"><div><h1>Detalle del evento</h1><p>Información general, días y puntos de encuentro.</p></div><div className="qf-event-detail-header-actions">{String(user?.tipoUsuario).toLowerCase() === "productor" && <Link className="qf-event-detail-button qf-event-detail-edit" to={`/evento/${id}`}><FaPen aria-hidden="true" /> Editar evento</Link>}<button className="qf-event-detail-button" type="button" onClick={() => window.history.back()}><FaArrowLeft aria-hidden="true" /> Volver</button></div></header>
        {actions.length > 0 && <section className="qf-event-detail-actions" aria-label="Acciones del evento"><div><h2>Administrar evento</h2><p>Acciones disponibles según su estado actual.</p></div><div className="qf-event-detail-action-buttons">{actions.map((act) => <button type="button" key={act.action} className={`${act.className} qf-event-detail-button`} onClick={() => handleStateAction(act.action, act.label)}>{act.label}</button>)}</div></section>}
        <section className="qf-event-detail-hero" aria-labelledby="event-name">
          <div className="qf-event-detail-image"><img src={imageSrc} alt={evento.nombre} onError={(event) => { if (event.currentTarget.getAttribute("src") !== imgDefault) event.currentTarget.src = imgDefault; }} /></div>
          <div className="qf-event-detail-overview"><div className="qf-event-detail-title-row"><h2 id="event-name">{evento.nombre}</h2><span className="qf-event-detail-state">{formatearEstado(evento.estado)}</span></div><p className="qf-event-detail-description">{evento.descripcion}</p>
            <dl className="qf-event-detail-facts"><div><dt>Tipo de evento</dt><dd>{evento.tipoEvento || "Sin especificar"}</dd></div><div className="qf-event-detail-fact-location"><dt><FaMapMarkerAlt aria-hidden="true" /> Ubicación</dt><dd>{formatUbicacion(evento) || "Sin especificar"}</dd></div><div><dt><FaCalendarAlt aria-hidden="true" /> Inicio</dt><dd>{formatDate(eventoFechaInicio) || "Sin fecha"} {formatTime(eventoFechaInicio)}</dd></div><div><dt><FaClock aria-hidden="true" /> Finalización</dt><dd>{formatDate(eventoFechaFin) || "Sin fecha"} {formatTime(eventoFechaFin)}</dd></div></dl>
          </div>
        </section>

        <div className="qf-event-detail-sections">
          <section className="qf-event-detail-section"><header><h2><FaCalendarAlt aria-hidden="true" /> Días del evento</h2><span>{evento.diaEventos?.length || 0}</span></header>
            {evento.diaEventos?.length > 0 ? <ul className="qf-event-detail-days">{evento.diaEventos.map((dia, index) => <li key={dia.id || index}><div className="qf-event-detail-day-number">{String(index + 1).padStart(2, "0")}</div><div><h3>{dia.nombre || `Día ${index + 1}`}</h3><dl><div><dt>Inicio</dt><dd>{(isMobile ? formatDateShort(dia.fechaHoraInicioDiaEvento) : formatDate(dia.fechaHoraInicioDiaEvento)) || "Sin fecha"} {formatTime(dia.fechaHoraInicioDiaEvento)}</dd></div><div><dt>Fin</dt><dd>{(isMobile ? formatDateShort(dia.fechaHoraFinDiaEvento) : formatDate(dia.fechaHoraFinDiaEvento)) || "Sin fecha"} {formatTime(dia.fechaHoraFinDiaEvento)}</dd></div></dl></div></li>)}</ul> : <p className="qf-event-detail-empty">No hay días registrados para este evento.</p>}
          </section>
          <section className="qf-event-detail-section"><header><h2><FaMapMarkerAlt aria-hidden="true" /> Puntos de encuentro</h2><span>{puntosEncuentro.length}</span></header>
            {puntosEncuentro.length > 0 ? <ul className="qf-event-detail-meeting-points">{puntosEncuentro.map((punto, index) => <li key={punto.id || index}><span className="qf-event-detail-point-icon"><FaMapMarkerAlt aria-hidden="true" /></span><strong>{punto.nombre}</strong><button className="qf-event-detail-button" type="button" onClick={() => setMapPunto(punto)}><FaMap aria-hidden="true" /> Ver Mapa</button></li>)}</ul> : <p className="qf-event-detail-empty">No hay puntos de encuentro registrados.</p>}
          </section>
        </div>
      </main><Footer />
      <ConfirmDialog open={confirmDialog.open} title={confirmDialog.title} message={confirmDialog.message} onConfirm={handleConfirm} onCancel={handleCancel} />
      <Dialog open={Boolean(mapPunto)} onClose={() => setMapPunto(null)} fullWidth maxWidth="sm" className="qf-event-map-dialog" aria-labelledby="event-map-title" slotProps={{ paper: { className: "qf-event-map-paper" } }}>
        {mapPunto && <><header><div><span>Punto de encuentro</span><h2 id="event-map-title">{mapPunto.nombre}</h2></div><button className="qf-event-map-close" type="button" aria-label="Cerrar mapa" onClick={() => setMapPunto(null)}><FaTimes aria-hidden="true" /></button></header><iframe title={`Mapa - ${mapPunto.nombre}`} width="100%" height="400" loading="lazy" referrerPolicy="no-referrer-when-downgrade" src={`https://www.google.com/maps?q=${mapPunto.latitud},${mapPunto.longitud}&z=15&output=embed`} /></>}
      </Dialog>
    </PageLayout>
  );
};
export default EventoDetalleWeb;

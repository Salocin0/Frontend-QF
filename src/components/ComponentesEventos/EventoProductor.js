import { default as React, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import imgDefault from "../img/qf-new-logo-transparent.png";
import { FaInfoCircle, FaPen, FaClipboardList, FaCheck, FaPlay, FaPause, FaStop, FaTimes, FaMapMarkerAlt, FaCalendarAlt } from "react-icons/fa";
import "./EventosProductor.css";
import ConfirmDialog from "../ComponentesGenerales/ConfirmDialog";
import { formatUbicacion } from "../ComponentesGenerales/Utils/formatUbicacion";

const EventoProductor = ({ evento, recargarComponente }) => {
  const navigate = useNavigate();
  const [isEnPreparacion, setIsEnPreparacion] = useState(false);
  // Drafts (EnPreparacion1/EnPreparacion2) still miss steps of the creation wizard and cannot be confirmed.
  const [isBorrador, setIsBorrador] = useState(false);
  const [isConfirmado, setIsConfirmado] = useState(false);
  const [isEnCurso, setIsEnCurso] = useState(false);
  const [isPausado, setIsPausado] = useState(false);
  const [, setIsCancelado] = useState(false);
  const [, setIsFinalizado] = useState(false);
  const [, setIsProcesoDeCreacion1] = useState(false);
  const [, setIsProcesoDeCreacion2] = useState(false);
  const [, setIsProcesoDeCreacion3] = useState(false);
  const [recargar, setRecargar] = useState(0);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  const handleRecargar = () => {
    setRecargar(recargar + 1);
    handleActualizarEstado();
    recargarComponente();
  };

  const handleActualizarEstado = () => {
    setIsEnPreparacion(false);
    setIsBorrador(false);
    setIsConfirmado(false);
    setIsEnCurso(false);
    setIsPausado(false);
    setIsCancelado(false);
    setIsFinalizado(false);
    switch (evento?.estado) {
      case "EnPreparacion":
        setIsEnPreparacion(true);
        break;
      case "Confirmado":
        setIsConfirmado(true);
        break;
      case "EnCurso":
        setIsEnCurso(true);
        break;
      case "Pausado":
        setIsPausado(true);
        break;
      case "Cancelado":
        setIsCancelado(true);
        break;
      case "EnPreparacion1":
        setIsProcesoDeCreacion1(true);
        setIsBorrador(true);
        break;
      case "EnPreparacion2":
        setIsProcesoDeCreacion2(true);
        setIsBorrador(true);
        break;
      case "EnPreparacion3":
        setIsProcesoDeCreacion3(true);
        setIsEnPreparacion(true);
        break;
      case "Finalizado":
        setIsFinalizado(true);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    handleActualizarEstado();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [evento, recargar]);

  const confirmarEvento = () => {
    setPendingAction({
      type: 'confirmar',
      message: '¿Estás seguro de que deseas confirmar este evento?',
      title: 'Confirmar Evento'
    });
    setConfirmOpen(true);
  };

  const executeConfirmarEvento = () => {
    fetch(
      `${process.env?.REACT_APP_BACK_URL}evento/cambiarEstado/${evento.id}/confirmarEvento`,
      {
        method: "POST",
      }
    )
      .then(async (response) => {
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data?.message || "Error al confirmar evento");
        toast.success("Evento confirmado con éxito");
        handleRecargar();
      })
      .catch((error) => {
        toast.error(error.message || "Error al confirmar evento");
      });
  };

  const futureDateWarning = (isoDate, verb) => {
    const time = isoDate ? new Date(isoDate).getTime() : NaN;
    if (Number.isNaN(time) || time <= Date.now()) return "";
    return ` Atención: la fecha ${verb} del evento es el ${new Date(time).toLocaleDateString("es-AR")} y todavía no llegó.`;
  };

  const iniciarEvento = () => {
    setPendingAction({
      type: 'iniciar',
      message:
        '¿Estás seguro de que deseas iniciar este evento?' +
        futureDateWarning(evento?.fechaHoraInicio, "de inicio"),
      title: 'Iniciar Evento'
    });
    setConfirmOpen(true);
  };

  const executeIniciarEvento = () => {
    fetch(
      `${process.env?.REACT_APP_BACK_URL}evento/cambiarEstado/${evento.id}/iniciarEvento`,
      {
        method: "POST",
      }
    )
      .then((response) => response.json())
      .then(() => {
        toast.success("Evento iniciado con éxito");
        handleRecargar();
      })
      .catch((error) => toast.error("Error al iniciar evento"));
  };

  const finalizarEvento = () => {
    setPendingAction({
      type: 'finalizar',
      message:
        '¿Estás seguro de que deseas finalizar este evento? Esta acción no se puede deshacer.' +
        futureDateWarning(evento?.fechaHoraFin, "de fin"),
      title: 'Finalizar Evento'
    });
    setConfirmOpen(true);
  };

  const executeFinalizarEvento = () => {
    fetch(
      `${process.env?.REACT_APP_BACK_URL}evento/cambiarEstado/${evento.id}/finalizarEvento`,
      {
        method: "POST",
      }
    )
      .then((response) => response.json())
      .then(() => {
        toast.success("Evento finalizado con éxito");
        handleRecargar();
      })
      .catch((error) => toast.error("Error al finalizar evento"));
  };

  const cancelarEvento = () => {
    setPendingAction({
      type: 'cancelar',
      message: '¿Estás seguro de que deseas cancelar este evento? Esta acción no se puede deshacer.',
      title: 'Cancelar Evento'
    });
    setConfirmOpen(true);
  };

  const executeCancelarEvento = () => {
    fetch(
      `${process.env?.REACT_APP_BACK_URL}evento/cambiarEstado/${evento.id}/cancelarEvento`,
      {
        method: "POST",
      }
    )
      .then((response) => response.json())
      .then(() => {
        toast.success("Evento Cancelado con éxito");
        handleRecargar();
      })
      .catch((error) => toast.error("Error al cancelar evento"));
  };

  const pausarEvento = () => {
    setPendingAction({
      type: 'pausar',
      message: '¿Estás seguro de que deseas pausar este evento?',
      title: 'Pausar Evento'
    });
    setConfirmOpen(true);
  };

  const continuarEvento = () => {
    setPendingAction({
      type: 'continuar',
      message: '¿Estás seguro de que deseas continuar este evento?',
      title: 'Continuar Evento'
    });
    setConfirmOpen(true);
  };

  const executeContinuarEvento = () => {
    fetch(
      `${process.env?.REACT_APP_BACK_URL}evento/cambiarEstado/${evento.id}/continuarEvento`,
      {
        method: "POST",
      }
    )
      .then((response) => response.json())
      .then(() => {
        toast.success("Evento continuado con éxito");
        handleRecargar();
      })
      .catch(() => toast.error("Error al continuar evento"));
  };

  const executePausarEvento = () => {
    fetch(
      `${process.env?.REACT_APP_BACK_URL}evento/cambiarEstado/${evento.id}/pausarEvento`,
      {
        method: "POST",
      }
    )
      .then((response) => response.json())
      .then(() => {
        toast.success("Evento Pausado con éxito");
        handleRecargar();
      })
      .catch((error) => toast.error("Error al pausar evento"));
  };

  const verSolicitudes = () => {
    navigate(`/ver-solicitudes-evento/${evento.id}`);
  };

  const handleConfirm = () => {
    if (!pendingAction) return;
    
    switch (pendingAction.type) {
      case 'confirmar':
        executeConfirmarEvento();
        break;
      case 'iniciar':
        executeIniciarEvento();
        break;
      case 'pausar':
        executePausarEvento();
        break;
      case 'finalizar':
        executeFinalizarEvento();
        break;
      case 'continuar':
        executeContinuarEvento();
        break;
      case 'cancelar':
        executeCancelarEvento();
        break;
      default:
        break;
    }
    
    setConfirmOpen(false);
    setPendingAction(null);
  };

  const handleCancel = () => {
    setConfirmOpen(false);
    setPendingAction(null);
  };

  const statusLabel = evento.estado?.startsWith("EnPreparacion") ? "En preparación" : String(evento.estado || "Sin estado").replace(/([a-z])([A-Z])/g, "$1 $2");
  const dateLabel = (value) => {
    if (!value) return null;
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date.toLocaleString("es-AR", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
  };
  const start = dateLabel(evento.fechaHoraInicio);
  const end = dateLabel(evento.fechaHoraFin);
  return (
    <article className="qf-producer-event-card">
      <div className="qf-producer-event-image"><img src={evento.img && !String(evento.img).includes("vendimia.mendoza.gov.ar") ? evento.img : imgDefault} alt={evento.nombre} onError={(event) => { if (event.currentTarget.getAttribute("src") !== imgDefault) event.currentTarget.src = imgDefault; }} /></div>
      <div className="qf-producer-event-body">
        <div className="qf-producer-event-title"><h2>{evento.nombre}</h2><span className={`qf-producer-event-state qf-producer-event-state--${evento.estado}`}>{statusLabel}</span></div>
        <p className="qf-producer-event-description">{evento.descripcion}</p>
        <p className="qf-producer-event-location"><FaMapMarkerAlt aria-hidden="true" />{formatUbicacion(evento)}</p>
        {(start || end) && <dl className="qf-producer-event-dates">{start && <div><dt><FaCalendarAlt aria-hidden="true" /> Inicio</dt><dd>{start}</dd></div>}{end && <div><dt><FaCalendarAlt aria-hidden="true" /> Finalización</dt><dd>{end}</dd></div>}</dl>}
        <div className="qf-producer-event-actions">
          <button className="qf-producer-event-button" type="button" onClick={() => navigate(`/evento-detalle/${evento.id}`)}><FaInfoCircle aria-hidden="true" /> Ver Info</button>
          <button className="qf-producer-event-button" type="button" onClick={() => navigate(`/evento/${evento.id}`)}><FaPen aria-hidden="true" /> Editar evento</button>
          {!isEnCurso && <button className="qf-producer-event-button" type="button" onClick={verSolicitudes}><FaClipboardList aria-hidden="true" /> Ver Solicitudes</button>}
          {isEnPreparacion && <button className="qf-producer-event-button qf-producer-event-button--primary" type="button" onClick={confirmarEvento}><FaCheck aria-hidden="true" /> Confirmar Evento</button>}
          {isBorrador && <p className="qf-producer-event-hint" role="note">Faltan completar datos del evento. Editalo para poder confirmarlo.</p>}
          {isPausado && <button className="qf-producer-event-button qf-producer-event-button--primary" type="button" onClick={continuarEvento}><FaPlay aria-hidden="true" /> Continuar Evento</button>}
          {isPausado && <button className="qf-producer-event-button qf-producer-event-button--danger" type="button" onClick={cancelarEvento}><FaTimes aria-hidden="true" /> Cancelar Evento</button>}
          {isConfirmado && <button className="qf-producer-event-button qf-producer-event-button--primary" type="button" onClick={iniciarEvento}><FaPlay aria-hidden="true" /> Iniciar Evento</button>}
          {isConfirmado && <button className="qf-producer-event-button" type="button" onClick={pausarEvento}><FaPause aria-hidden="true" /> Pausar Evento</button>}
          {isEnCurso && <button className="qf-producer-event-button qf-producer-event-button--danger" type="button" onClick={finalizarEvento}><FaStop aria-hidden="true" /> Finalizar Evento</button>}
        </div>
      </div>
      <ConfirmDialog open={confirmOpen} title={pendingAction?.title || 'Confirmar Acción'} message={pendingAction?.message || '¿Estás seguro de que deseas realizar esta acción?'} onConfirm={handleConfirm} onCancel={handleCancel} />
    </article>
  );
};
export default EventoProductor;

import { default as React, useContext, useEffect, useState } from "react";
import { Dialog } from "@mui/material";
import { FaCalendarAlt, FaMapMarkerAlt, FaMotorcycle, FaTimes } from "react-icons/fa";
import "../ComponentesEventos/EventosProductor.css";
import "./EventosRepartidor.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { UserContext } from "../ComponentesGenerales/UserContext";
import imgDefault from "../img/qf-new-logo-transparent.png";
import { formatUbicacion } from "../ComponentesGenerales/Utils/formatUbicacion";

// Sub-states such as "EnPreparacion1" are shown as "En Preparación".
const etiquetaEstado = (estado) =>
  typeof estado === "string" && estado.startsWith("EnPreparacion") ? "En Preparación" : estado;

const ESTADOS_ASOCIABLES = ["EnPreparacion", "EnPreparacion1", "EnPreparacion2", "EnPreparacion3", "Confirmado"];

const readRestrictions = async (response) => {
    if (response.status === 404) return false;
    if (response.status !== 200) throw new Error("No se pudieron consultar las restricciones");
    const result = await response.json();
    if (!Array.isArray(result.data)) throw new Error("Respuesta de restricciones inválida");
    return result.data.length > 0;
  };

const EventoRepartidor = ({ evento, recargar }) => {
  const navigate = useNavigate();
  const [isEnPreparacion,] = useState(
    ESTADOS_ASOCIABLES.includes(evento.estado)
  );
  const [tieneAsociacionPendiente, setTieneAsociacionPendiente] =
    useState(false);
  const [modalConfirmVisible, setModalConfirmVisible] = useState(false);
  const { user } = useContext(UserContext);
  const [restrictionStatus, setRestrictionStatus] = useState("loading");
  useEffect(() => {
    const controller = new AbortController();
    setRestrictionStatus("loading");
    fetch(`${process.env.REACT_APP_BACK_URL}restriccion/evento/${evento.id}`, { headers: { ConsumidorId: user?.consumidorId }, signal: controller.signal })
      .then(readRestrictions)
      .then((hasRestrictions) => { if (!controller.signal.aborted) setRestrictionStatus(hasRestrictions ? "with" : "without"); })
      .catch(() => { if (!controller.signal.aborted) setRestrictionStatus("error"); });
    return () => controller.abort();
  }, [evento.id, user?.consumidorId]);
  const restrictionLabel = { loading: "Consultando restricciones…", with: "Con restricciones", without: "Sin restricciones", error: "Restricciones sin confirmar" }[restrictionStatus];
  const asociarmeAEvento = () => {
    const headers = new Headers();
    headers.append("ConsumidorId", user?.consumidorId);
    headers.append("Content-Type", "application/json");

    fetch(
      `${process.env?.REACT_APP_BACK_URL}asociacion/evento/${evento.id}/asociarSimple/0/${user.consumidorId}`,
      {
        method: "POST",
        headers: headers,
      }
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.code === 200) {
          // Reload only the list (a full page reload would swallow the toast).
          toast.success("Asociación guardada");
          setTieneAsociacionPendiente(true);
          if (typeof recargar === "function") recargar();
        }
      })
      .catch((error) => {
        console.error(error);
        toast.error("Error al asociar");
      });
  };

  const handleTieneRestriciones = async () => {
    try {
      const headers = new Headers();
      headers.append("ConsumidorId", user?.consumidorId);
      headers.append("Content-Type", "application/json");

      const response = await fetch(
        `${process.env?.REACT_APP_BACK_URL}restriccion/evento/${evento.id}`,
        {
          method: "GET",
          headers: headers,
        }
      );
      const hasRestrictions = await readRestrictions(response);
      setRestrictionStatus(hasRestrictions ? "with" : "without");
      if (hasRestrictions) handleCrearForm();
      else asociarmeAEvento();
    } catch (error) {
      console.error(error);
      toast.error("Error al crear el formulario");
    }
  };

  const handleCrearForm = () => {
    const url = `/restriccionesEvento/${evento.id}`;
    navigate(url);
  };

  useEffect(() => {
    const handleTieneAsociacionPendiente = async () => {
      try {
        const headers = new Headers();
        headers.append("ConsumidorId", user?.consumidorId);
        headers.append("Content-Type", "application/json");
        const response = await fetch(
          `${process.env?.REACT_APP_BACK_URL}asociacion/evento/${evento.id}/asociarRepartidor/${user.consumidorId}`,
          {
            method: "GET",
            headers: headers,
          }
        );
        if (response.status === 400) {
          setTieneAsociacionPendiente(true);
        } else if (response.status === 200) {
          setTieneAsociacionPendiente(false);
        }
      } catch (error) {
        console.error(error);
      }
    };

    if (isEnPreparacion) {
      handleTieneAsociacionPendiente();
    }
  }, [evento, user, isEnPreparacion]);

  const date = (value) => value && !Number.isNaN(new Date(value).getTime()) ? new Date(value).toLocaleDateString("es-AR") : "Sin fecha informada";
  const image = evento?.img && !String(evento.img).includes("vendimia.mendoza.gov.ar") ? evento.img : imgDefault;
  return <>
    <article className="qf-producer-event-card qf-courier-event-card" aria-label={evento.nombre}>
      <div className={`qf-producer-event-image${image === imgDefault ? " qf-courier-event-image--logo" : ""}`}><img src={image} alt={evento.nombre} onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = imgDefault; event.currentTarget.parentElement.classList.add("qf-courier-event-image--logo"); }} /></div>
      <div className="qf-producer-event-body"><header className="qf-producer-event-title"><h2>{evento.nombre}</h2><div className="qf-courier-event-badges"><span className="qf-producer-event-state">{etiquetaEstado(evento.estado)}</span><span className={`qf-courier-restrictions-badge qf-courier-restrictions-badge--${restrictionStatus}`}>{restrictionLabel}</span></div></header>
        {evento.descripcion && <p className="qf-courier-event-description">{evento.descripcion}</p>}
        <dl className="qf-courier-event-data"><div><dt><FaMapMarkerAlt aria-hidden="true" /> Ubicación</dt><dd>{formatUbicacion(evento) || "Sin ubicación informada"}</dd></div><div><dt><FaCalendarAlt aria-hidden="true" /> Inicio</dt><dd>{date(evento.fechaHoraInicio)}</dd></div><div><dt><FaCalendarAlt aria-hidden="true" /> Fin</dt><dd>{date(evento.fechaHoraFin)}</dd></div></dl>
        <footer className="qf-courier-event-actions">{!tieneAsociacionPendiente && isEnPreparacion && <button type="button" className="qf-producer-event-button qf-producer-event-button--primary" onClick={() => setModalConfirmVisible(true)}><FaMotorcycle aria-hidden="true" /> Asociarme a evento</button>}{tieneAsociacionPendiente && <p role="status" className="qf-courier-event-pending">Ya tenés una asociación pendiente para este evento.</p>}</footer>
      </div>
    </article>
    <Dialog open={modalConfirmVisible} onClose={() => setModalConfirmVisible(false)} fullWidth maxWidth="sm" className="qf-courier-association-dialog" aria-labelledby={`courier-association-${evento.id}`} slotProps={{ paper: { className: "qf-courier-association-paper" } }}>
      <header><div><span>Solicitud de participación</span><h2 id={`courier-association-${evento.id}`}>Confirmar asociación</h2></div><button type="button" className="qf-courier-dialog-close" aria-label="Cerrar" onClick={() => setModalConfirmVisible(false)}><FaTimes aria-hidden="true" /></button></header>
      <div className="qf-courier-dialog-body"><p>{restrictionStatus === "with" ? "¿Estás seguro de que querés unirte a este evento? Tiene restricciones: en el siguiente paso deberás completar los requisitos y adjuntar los documentos solicitados. El productor podrá descargarlos para revisar tu solicitud." : "¿Estás seguro de que querés unirte a este evento? Se enviará tu solicitud de participación al organizador."}</p><dl className="qf-courier-event-data"><div><dt>Evento</dt><dd>{evento.nombre}</dd></div><div><dt>Ubicación</dt><dd>{formatUbicacion(evento)}</dd></div></dl><footer className="qf-courier-event-actions"><button type="button" className="qf-producer-event-button" onClick={() => setModalConfirmVisible(false)}>Cancelar</button><button type="button" className="qf-producer-event-button qf-producer-event-button--primary" onClick={() => { setModalConfirmVisible(false); handleTieneRestriciones(); }}>Confirmar</button></footer></div>
    </Dialog>
  </>;
};
export default EventoRepartidor;

import React from "react";
import { Link } from "react-router-dom";
import logoevento from "./../img/qf-new-logo-transparent.png";
import { formatUbicacion } from "../ComponentesGenerales/Utils/formatUbicacion";

const EventoUser = ({ evento }) => {
  const calcularTiempoRestante = (fecha) => {
    const ahora = new Date();
    const diferencia = fecha - ahora;
    const horasTotales = Math.floor(diferencia / (1000 * 60 * 60));
    const dias = Math.floor(horasTotales / 24);
    const horas = horasTotales % 24;

    if (dias > 0) {
      return `${dias} día${dias > 1 ? "s" : ""} y ${horas} hora${
        horas !== 1 ? "s" : ""
      }`;
    }

    return `${horas} hora${horas !== 1 ? "s" : ""}`;
  };

  const calcularTextoTiempo = (fechaInicio, fechaFin) => {
    const ahora = new Date();

    if (fechaInicio > ahora) {
      return `Empieza en ${calcularTiempoRestante(fechaInicio)}`;
    }

    if (fechaFin > ahora) {
      return "En progreso";
    }

    return null; // Evento finalizado, se filtrará del listado
  };

  const fechaInicio = evento?.diaEventos?.length
    ? new Date(
        Math.min(
          ...evento.diaEventos.map((d) => new Date(d.fechaHoraInicioDiaEvento))
        )
      )
    : null;
  const fechaFin = evento?.diaEventos?.length
    ? new Date(
        Math.max(
          ...evento.diaEventos.map((d) => new Date(d.fechaHoraFinDiaEvento))
        )
      )
    : null;

  const ahora = new Date();
  const eventoFinalizado = fechaFin && fechaFin <= ahora;
  const eventoEnProgreso = fechaInicio && fechaFin && fechaInicio <= ahora && fechaFin > ahora;

  const formatEstado = (str) => {
    if (!str) return "";
    return str.replace(/\d+$/, "").replace(/([A-Z])/g, " $1").trim();
  };

  const textoTiempo =
    fechaInicio && fechaFin
      ? calcularTextoTiempo(fechaInicio, fechaFin)
      : "Fecha no disponible";

  const textoBadge = eventoFinalizado
    ? "Finalizado"
    : eventoEnProgreso
    ? "En progreso"
    : evento.estado === "Confirmado"
    ? "Empieza pronto"
    : formatEstado(evento.estado);

  const image = evento?.img && !String(evento.img).includes("vendimia.mendoza.gov.ar") ? evento.img : logoevento;
  return (
    <article className="qf-event-card">
      <Link to={`/tipo-compra/${evento.id}`} className="qf-event-card-link">
        <div className="qf-event-card-image">
          <img src={image} alt="" loading="lazy" onError={(e) => { e.target.onerror = null; if (e.target.src !== logoevento) e.target.src = logoevento; }} />
          {textoBadge && <span className={`qf-event-badge${eventoEnProgreso ? " qf-event-badge--live" : ""}`}>{textoBadge}</span>}
        </div>
        <div className="qf-event-card-content">
          <div className="qf-event-card-heading"><h2>{evento.nombre}</h2>{evento.tienePreventa && <span className="qf-event-presale-badge">Preventa</span>}</div>
          <p className="qf-event-description">{evento.descripcion}</p>
          <div className="qf-event-meta">
            <p className="qf-event-location">{formatUbicacion(evento)}</p>
            {fechaInicio && <p className="qf-event-date">{fechaInicio.toLocaleDateString("es-AR", { day: "numeric", month: "short", year: "numeric" })}</p>}
            {evento.distanciaCalculada != null && <p className="qf-event-distance">A {evento.distanciaCalculada < 1 ? `${Math.round(evento.distanciaCalculada * 1000)} m` : `${evento.distanciaCalculada.toFixed(1)} km`}</p>}
          </div>
          <div className="qf-event-card-footer"><span>{textoTiempo}</span><span className="qf-event-cta">Ver evento <span aria-hidden="true">→</span></span></div>
        </div>
      </Link>
    </article>
  );
};
export default EventoUser;

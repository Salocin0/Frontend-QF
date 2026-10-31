import { useState } from "react";
import { FaBell, FaCheck } from "react-icons/fa";
import { toast } from "react-toastify";
import "../ComponentesGenerales/Notifications.css";

const CardNotificaciones = ({ notificacion, recargarComponente }) => {
  const [saving, setSaving] = useState(false);
  const unread = notificacion.estado === "pendiente";
  const date = new Date(notificacion.fecha);

  const marcarComoLeida = async () => {
    if (saving) return;
    setSaving(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACK_URL}notificaciones/${notificacion.id}`,
        { method: "PUT", headers: { "Content-Type": "application/json" } }
      );
      if (!response.ok) throw new Error("No se pudo actualizar la notificación");
      recargarComponente();
    } catch {
      toast.error("No pudimos marcarla como leída. Intentá nuevamente.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <article className={`qf-notification${unread ? " qf-notification--unread" : ""}`}>
      <span className="qf-notification__icon" aria-hidden="true">
        {unread ? <FaBell /> : <FaCheck />}
      </span>
      <div className="qf-notification__content">
        <div className="qf-notification__heading">
          <h2>{notificacion.titulo}</h2>
          <span className="qf-notification__status">{unread ? "Nueva" : "Leída"}</span>
        </div>
        <p>{notificacion.descripcion}</p>
        <div className="qf-notification__footer">
          {!Number.isNaN(date.getTime()) && (
            <time dateTime={date.toISOString()}>
              {date.toLocaleString("es-AR", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
            </time>
          )}
          {unread && (
            <button type="button" onClick={marcarComoLeida} disabled={saving}>
              <FaCheck aria-hidden="true" /> {saving ? "Guardando…" : "Marcar como leída"}
            </button>
          )}
        </div>
      </div>
    </article>
  );
};

export default CardNotificaciones;

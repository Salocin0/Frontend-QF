import React, { useEffect, useState, useCallback, useContext } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import PageLayout from "../ComponentesGenerales/PageLayout";
import Footer from "../ComponentesGenerales/Footer";
import ConfirmDialog from "../ComponentesGenerales/ConfirmDialog";
import { UserContext } from "../ComponentesGenerales/UserContext";
import useBreakpoint from "../../useBreakpoint";

const STATE_ACTIONS = {
  EnPreparacion: [
    { label: "Confirmar Evento", action: "confirmar", className: "qf-btn qf-btn--primary" },
    { label: "Cancelar Evento", action: "cancelar", className: "qf-btn qf-btn--danger" },
  ],
  EnPreparacion1: [
    { label: "Confirmar Evento", action: "confirmar", className: "qf-btn qf-btn--primary" },
    { label: "Cancelar Evento", action: "cancelar", className: "qf-btn qf-btn--danger" },
  ],
  EnPreparacion2: [
    { label: "Confirmar Evento", action: "confirmar", className: "qf-btn qf-btn--primary" },
    { label: "Cancelar Evento", action: "cancelar", className: "qf-btn qf-btn--danger" },
  ],
  EnPreparacion3: [
    { label: "Confirmar Evento", action: "confirmar", className: "qf-btn qf-btn--primary" },
    { label: "Cancelar Evento", action: "cancelar", className: "qf-btn qf-btn--danger" },
  ],
  Confirmado: [
    { label: "Pausar Evento", action: "pausar", className: "qf-btn qf-btn--primary" },
    { label: "Iniciar Evento", action: "iniciar", className: "qf-btn qf-btn--success" },
    { label: "Cancelar Evento", action: "cancelar", className: "qf-btn qf-btn--danger" },
  ],
  EnCurso: [
    { label: "Finalizar Evento", action: "finalizar", className: "qf-btn qf-btn--danger" },
  ],
  Pausado: [
    { label: "Cancelar Evento", action: "cancelar", className: "qf-btn qf-btn--danger" },
    { label: "Preparar Evento", action: "reprogramar", className: "qf-btn qf-btn--primary" },
    { label: "Continuar Evento", action: "continuar", className: "qf-btn qf-btn--success" },
  ],
};

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? "" : d.toLocaleDateString("es-AR");
};

const formatTime = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? "" : d.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });
};

const EventoDetalleWeb = () => {
  const { id } = useParams();
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
      setPuntosEncuentro(puntosData.data || []);
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

  const imageSrc = evento?.img
    ? `data:image/jpeg;base64,${evento.img}`
    : `${process.env.PUBLIC_URL}/logoevento.webp`;

  const actions = evento?.estado ? (STATE_ACTIONS[evento.estado] || []) : [];

  const containerStyles = {
    width: isMobile ? "100%" : "80%",
    maxWidth: isMobile ? "100%" : "900px",
    margin: "0 auto",
    padding: "20px",
  };

  if (loading) {
    return (
      <PageLayout sidebarProps={{}}>
        <div style={containerStyles}>
          <p style={{ color: "var(--qf-text-muted)", textAlign: "center" }}>
            Cargando...
          </p>
        </div>
        <Footer />
      </PageLayout>
    );
  }

  if (error || !evento) {
    return (
      <PageLayout sidebarProps={{}}>
        <div style={containerStyles}>
          <p style={{ color: "var(--qf-text-muted)", textAlign: "center" }}>
            {error || "Error al cargar los datos del evento"}
          </p>
        </div>
        <Footer />
      </PageLayout>
    );
  }

  return (
    <PageLayout sidebarProps={{}}>
      <div style={containerStyles}>
        {/* Event card */}
        <div
          className="qf-card"
          style={{
            background: "var(--qf-bg-main)",
            borderRadius: "10px",
            padding: "24px",
            marginBottom: "20px",
          }}
        >
          {/* Image */}
          <div style={{ textAlign: "center", marginBottom: "16px" }}>
            <img
              src={imageSrc}
              alt={evento.nombre}
              style={{
                maxWidth: "100%",
                maxHeight: "300px",
                borderRadius: "10px",
                objectFit: "cover",
              }}
            />
          </div>

          {/* Name */}
          <h2 style={{ color: "var(--qf-text-primary)", marginBottom: "8px" }}>
            {evento.nombre}
          </h2>

          {/* Description */}
          <p style={{ color: "var(--qf-text-muted)", marginBottom: "16px" }}>
            {evento.descripcion}
          </p>

          {/* Info grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
              gap: "12px",
              marginBottom: "16px",
            }}
          >
            <div>
              <strong style={{ color: "var(--qf-text-primary)" }}>Tipo:</strong>{" "}
              <span style={{ color: "var(--qf-text-muted)" }}>{evento.tipoEvento}</span>
            </div>
            <div>
              <strong style={{ color: "var(--qf-text-primary)" }}>Estado:</strong>{" "}
              <span
                style={{
                  background: "var(--qf-naranja)",
                  color: "#000",
                  padding: "2px 8px",
                  borderRadius: "10px",
                  fontSize: "0.85rem",
                  fontWeight: "bold",
                }}
              >
                {evento.estado}
              </span>
            </div>
            <div>
              <strong style={{ color: "var(--qf-text-primary)" }}>Ubicación:</strong>{" "}
              <span style={{ color: "var(--qf-text-muted)" }}>
                {evento.ubicacion}, {evento.localidad}, {evento.provincia}
              </span>
            </div>
            <div>
              <strong style={{ color: "var(--qf-text-primary)" }}>Fecha:</strong>{" "}
              <span style={{ color: "var(--qf-text-muted)" }}>
                {formatDate(evento.fechaHoraInicio)} {formatTime(evento.fechaHoraInicio)} -{" "}
                {formatDate(evento.fechaHoraFin)} {formatTime(evento.fechaHoraFin)}
              </span>
            </div>
          </div>

          {/* State action buttons */}
          {actions.length > 0 && (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "10px",
                marginTop: "16px",
              }}
            >
              {actions.map((act) => (
                <button
                  key={act.action}
                  className={act.className}
                  onClick={() => handleStateAction(act.action, act.label)}
                >
                  {act.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Event days */}
        <div
          className="qf-card"
          style={{
            background: "var(--qf-bg-main)",
            borderRadius: "10px",
            padding: "24px",
            marginBottom: "20px",
          }}
        >
          <h3 style={{ color: "var(--qf-text-primary)", marginBottom: "12px" }}>
            Días del evento
          </h3>
          {evento.diaEventos && evento.diaEventos.length > 0 ? (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={{ color: "var(--qf-text-primary)", textAlign: "left", padding: "8px", borderBottom: "1px solid var(--qf-bg-secondary)" }}>
                    Nombre
                  </th>
                  <th style={{ color: "var(--qf-text-primary)", textAlign: "left", padding: "8px", borderBottom: "1px solid var(--qf-bg-secondary)" }}>
                    Fecha
                  </th>
                </tr>
              </thead>
              <tbody>
                {evento.diaEventos.map((dia, idx) => (
                  <tr key={dia.id || idx}>
                    <td style={{ color: "var(--qf-text-muted)", padding: "8px", borderBottom: "1px solid var(--qf-bg-secondary)" }}>
                      {dia.nombre}
                    </td>
                    <td style={{ color: "var(--qf-text-muted)", padding: "8px", borderBottom: "1px solid var(--qf-bg-secondary)" }}>
                      {formatDate(dia.fecha)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p style={{ color: "var(--qf-text-muted)" }}>
              No hay días registrados para este evento.
            </p>
          )}
        </div>

        {/* Meeting points */}
        <div
          className="qf-card"
          style={{
            background: "var(--qf-bg-main)",
            borderRadius: "10px",
            padding: "24px",
            marginBottom: "20px",
          }}
        >
          <h3 style={{ color: "var(--qf-text-primary)", marginBottom: "12px" }}>
            Puntos de encuentro
          </h3>
          {puntosEncuentro && puntosEncuentro.length > 0 ? (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={{ color: "var(--qf-text-primary)", textAlign: "left", padding: "8px", borderBottom: "1px solid var(--qf-bg-secondary)" }}>
                    Nombre
                  </th>
                  <th style={{ color: "var(--qf-text-primary)", textAlign: "left", padding: "8px", borderBottom: "1px solid var(--qf-bg-secondary)" }}>
                    Mapa
                  </th>
                </tr>
              </thead>
              <tbody>
                {puntosEncuentro.map((punto, idx) => (
                  <tr key={punto.id || idx}>
                    <td style={{ color: "var(--qf-text-muted)", padding: "8px", borderBottom: "1px solid var(--qf-bg-secondary)" }}>
                      {punto.nombre}
                    </td>
                    <td style={{ padding: "8px", borderBottom: "1px solid var(--qf-bg-secondary)" }}>
                      <a
                        href={`https://maps.google.com/?q=${punto.latitud},${punto.longitud}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: "var(--qf-naranja)", textDecoration: "none" }}
                      >
                        Ver en Google Maps
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p style={{ color: "var(--qf-text-muted)" }}>
              No hay puntos de encuentro registrados.
            </p>
          )}
        </div>
      </div>

      <Footer />

      <ConfirmDialog
        open={confirmDialog.open}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </PageLayout>
  );
};

export default EventoDetalleWeb;

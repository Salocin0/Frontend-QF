import React, { useEffect, useState, useCallback, useContext } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import PageLayout from "../ComponentesGenerales/PageLayout";
import Footer from "../ComponentesGenerales/Footer";
import ConfirmDialog from "../ComponentesGenerales/ConfirmDialog";
import Breadcrumb from "../ComponentesGenerales/Breadcrumb";
import { UserContext } from "../ComponentesGenerales/UserContext";
import useBreakpoint from "../../useBreakpoint";
import imgDefault from "../img/logoevento.webp";

// El valor de "action" viaja tal cual a POST evento/cambiarEstado/:id/:accion
// y el backend lo usa para invocar el método homónimo del estado actual
// (ver BackendNode-QF/src/estados/estadosConcretosEventos/*.state.js), que
// siempre tiene el sufijo "Evento" (confirmarEvento, cancelarEvento, etc.).
const STATE_ACTIONS = {
  EnPreparacion: [
    { label: "Confirmar Evento", action: "confirmarEvento", className: "qf-btn qf-btn--primary" },
    { label: "Cancelar Evento", action: "cancelarEvento", className: "qf-btn qf-btn--danger" },
  ],
  EnPreparacion1: [
    { label: "Confirmar Evento", action: "confirmarEvento", className: "qf-btn qf-btn--primary" },
    { label: "Cancelar Evento", action: "cancelarEvento", className: "qf-btn qf-btn--danger" },
  ],
  EnPreparacion2: [
    { label: "Confirmar Evento", action: "confirmarEvento", className: "qf-btn qf-btn--primary" },
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

  const doradoBorder = "1px solid var(--qf-naranja)";

  const containerStyles = {
    width: "100%",
    padding: "20px",
    boxSizing: "border-box",
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
      <div style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        flex: 1,
        minHeight: 0,
        boxSizing: "border-box",
      }}>
        {/* Header full-width */}
        <div className="qf-page-header qf-page-header--full" style={{ textAlign: "center" }}>
          <h1 className="qf-page-title" style={{ textAlign: "center", fontSize: "1.75rem" }}>
            Evento
          </h1>
          <hr className="qf-separator qf-separator--spaced" />
        </div>

        <div style={containerStyles}>
          {/* Breadcrumb */}
          <Breadcrumb items={breadcrumbItems} style={{
            margin: 0,
            backgroundColor: 'var(--qf-bg-secondary)',
            width: '100%',
            padding: '8px 16px',
            borderRadius: '10px',
            border: doradoBorder,
            boxSizing: 'border-box',
          }} />

          {/* Event card */}
          <div
            className="qf-card"
            style={{
              background: "var(--qf-bg-main)",
              border: doradoBorder,
              borderRadius: "10px",
              padding: "24px",
              marginTop: "16px",
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
                  {formatearEstado(evento.estado)}
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
                  {eventoFechaInicio ? `${formatDate(eventoFechaInicio)} ${formatTime(eventoFechaInicio)}` : ""}
                  {eventoFechaInicio && eventoFechaFin ? " - " : ""}
                  {eventoFechaFin ? `${formatDate(eventoFechaFin)} ${formatTime(eventoFechaFin)}` : ""}
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
              border: doradoBorder,
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
                      Inicio
                    </th>
                    <th style={{ color: "var(--qf-text-primary)", textAlign: "left", padding: "8px", borderBottom: "1px solid var(--qf-bg-secondary)" }}>
                      Fin
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {evento.diaEventos.map((dia, idx) => (
                    <tr key={dia.id || idx}>
                      <td style={{ color: "var(--qf-text-muted)", padding: "8px", borderBottom: "1px solid var(--qf-bg-secondary)", fontSize: isMobile ? "0.8rem" : "inherit" }}>
                        {dia.nombre || `Día ${idx + 1}`}
                      </td>
                      <td style={{ color: "var(--qf-text-muted)", padding: "8px", borderBottom: "1px solid var(--qf-bg-secondary)", fontSize: isMobile ? "0.8rem" : "inherit" }}>
                        {isMobile ? formatDateShort(dia.fechaHoraInicioDiaEvento) : formatDate(dia.fechaHoraInicioDiaEvento)} {formatTime(dia.fechaHoraInicioDiaEvento)}
                      </td>
                      <td style={{ color: "var(--qf-text-muted)", padding: "8px", borderBottom: "1px solid var(--qf-bg-secondary)", fontSize: isMobile ? "0.8rem" : "inherit" }}>
                        {isMobile ? formatDateShort(dia.fechaHoraFinDiaEvento) : formatDate(dia.fechaHoraFinDiaEvento)} {formatTime(dia.fechaHoraFinDiaEvento)}
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
              border: doradoBorder,
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
                      <button
                        onClick={() => setMapPunto(punto)}
                        style={{
                          background: "var(--qf-naranja)",
                          color: "#000",
                          border: "none",
                          padding: "6px 14px",
                          borderRadius: "6px",
                          fontWeight: "bold",
                          cursor: "pointer",
                          fontSize: "0.85rem",
                        }}
                      >
                        Ver Mapa
                      </button>
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

          <button
            onClick={() => window.history.back()}
            className="qf-btn qf-btn--primary"
            style={{ width: "100%", marginTop: "8px" }}
          >
            Volver
          </button>
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

      {/* Map dialog */}
      {mapPunto && (
        <div
          onClick={() => setMapPunto(null)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2000,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "var(--qf-bg-main)",
              borderRadius: "10px",
              border: "1px solid var(--qf-naranja)",
              padding: "20px",
              width: isMobile ? "95%" : "600px",
              maxWidth: "95vw",
              maxHeight: "90vh",
              boxSizing: "border-box",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <h3 style={{ margin: 0, color: "var(--qf-naranja)" }}>{mapPunto.nombre}</h3>
              <button
                onClick={() => setMapPunto(null)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "var(--qf-text-primary)",
                  fontSize: "1.5rem",
                  cursor: "pointer",
                  padding: "0 4px",
                }}
              >
                &times;
              </button>
            </div>
            <iframe
              title={`Mapa - ${mapPunto.nombre}`}
              width="100%"
              height="400"
              style={{ border: 0, borderRadius: "8px" }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://www.google.com/maps?q=${mapPunto.latitud},${mapPunto.longitud}&z=15&output=embed`}
            />
          </div>
        </div>
      )}
    </PageLayout>
  );
};

export default EventoDetalleWeb;

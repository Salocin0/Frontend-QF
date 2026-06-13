import React from "react";
import { useNavigate } from "react-router-dom";
import logoevento from "./../img/logoevento.webp";
import { toast } from "react-toastify";
import useBreakpoint from "../../useBreakpoint";

const EventoUser = ({ evento }) => {
  const navigate = useNavigate();
  const { isMobile } = useBreakpoint();

  const calcularTiempoRestante = (fecha) => {
    const ahora = new Date();
    const diferencia = fecha - ahora;
    const horasTotales = Math.floor(diferencia / (1000 * 60 * 60));
    const dias = Math.floor(horasTotales / 24);
    const horas = horasTotales % 24;
    console.log(evento);

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
    return str.replace(/([A-Z])/g, " $1").trim();
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

  const styles = {
    container: {
      width: "100%",
      margin: "0",
      padding: "0",
    },
    card: {
      border: `1px solid var(--qf-naranja)`,
      borderRadius: "8px",
      width: "98%",
      minHeight: "110px",
      backgroundColor: "var(--qf-bg-secondary)",
      margin: "0 auto 14px auto",
      color: "var(--qf-text-primary)",
      padding: "8px 16px",
      transition: "transform 0.2s ease-in-out",
      cursor: "pointer",
    },
    cardBody: {
      flex: 1,
      display: "flex",
      flexDirection: isMobile ? "column" : "row",
      gap: isMobile ? "8px" : "12px",
      alignItems: isMobile ? "stretch" : "center",
      cursor: "pointer",
      padding: "10px 18px",
    },
    imageContainer: {
      width: isMobile ? "100%" : "140px",
      minWidth: isMobile ? "auto" : "140px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "0",
      backgroundColor: "transparent",
    },
    img: {
      width: "100%",
      maxWidth: isMobile ? "200px" : "110px",
      height: isMobile ? "120px" : "auto",
      objectFit: "cover",
      borderRadius: "8px",
      marginLeft: "0",
      boxShadow: "none",
      display: "block",
    },
    content: {
      flexGrow: 1,
      position: "relative",
      justifyContent: "start",
      alignItems: "start",
      display: "flex",
      flexDirection: "column",
      marginLeft: "0",
    },
    title: {
      fontSize: "24px",
      fontWeight: "bold",
      color: "var(--qf-naranja)",
      marginBottom: "10px",
    },
    descripcion: {
      fontSize: "18px",
      color: "var(--qf-text-muted)",
      marginBottom: "10px",
    },
    text: {
      fontSize: "16px",
      color: "var(--qf-text-muted)",
      marginBottom: "5px",
    },
    distance: {
      fontSize: "16px",
      fontWeight: "bold",
      color: "var(--qf-green)",
      marginBottom: "5px",
    },
    estado: {
      fontSize: "16px",
      backgroundColor: "var(--qf-green)",
      color: "var(--qf-text-white)",
      borderRadius: "5px",
      padding: "5px 5px",
      fontWeight: "bold",
      display: "flex",
      justifyContent: "center",
      width: "200px",
    },
    fecha: {
      fontSize: "16px",
      color: "var(--qf-text-muted)",
    },
    estadoContainer: {
      display: "flex",
      position: isMobile ? "relative" : "absolute",
      top: isMobile ? "0" : "10px",
      right: isMobile ? "0" : "10px",
      width: isMobile ? "100%" : "180px",
      marginBottom: isMobile ? "8px" : "0",
      justifyContent: isMobile ? "center" : "flex-start",
    },
    preventa: {
      fontSize: "16px",
      color: "var(--qf-text-primary)",
      fontWeight: "bold",
      padding: "5px 10px",
      borderRadius: "5px",
      backgroundColor: "var(--qf-naranja)",
      display: "flex",
      justifyContent: "center",
    },
  };

  const handleCardClick = () => {
    if (eventoFinalizado) {
      toast.error("El evento ha finalizado.");
    } else {
      navigate(`/tipo-compra/${evento.id}`);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card} onClick={handleCardClick}>
        <div style={styles.cardLink}>
          <div style={styles.cardBody}>
            <div style={styles.imageContainer}>
              <img
                src={
                  evento?.img && !String(evento.img).includes("vendimia.mendoza.gov.ar")
                    ? evento.img
                    : logoevento
                }
                alt="Logo del Evento"
                style={styles.img}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = logoevento;
                }}
              />
            </div>

            <div style={styles.content}>
              {textoBadge && (
                <div style={styles.estadoContainer}>
                  <p style={{
                    ...styles.estado,
                    backgroundColor: eventoFinalizado
                      ? "var(--qf-rojo)"
                      : eventoEnProgreso
                      ? "var(--qf-green)"
                      : "var(--qf-green)",
                  }}>
                    {textoBadge}
                  </p>
                </div>
              )}
              <p style={styles.title}>{evento.nombre}</p>
              <p style={styles.descripcion}>{evento.descripcion}</p>
              <p style={styles.text}>
                {evento.ubicacion}, {evento.localidad}, {evento.provincia}
              </p>
              {evento.distanciaCalculada !== undefined && evento.distanciaCalculada !== null ? (
                <p style={styles.distance}>
                  A {evento.distanciaCalculada < 1
                    ? `${Math.round(evento.distanciaCalculada * 1000)}m`
                    : `${evento.distanciaCalculada.toFixed(1)}km`} de distancia
                </p>
              ) : (
                <p style={styles.distance}>Distancia no disponible</p>
              )}

              <p style={styles.fecha}>{textoTiempo}</p>

              {evento?.tienePreventa && (
                <p style={styles.preventa}>Tiene preventa</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventoUser;

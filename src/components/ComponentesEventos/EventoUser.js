import React from "react";
import { useNavigate } from "react-router-dom";
import logoevento from "./../img/logoevento.webp";
import { toast } from "react-toastify";

const EventoUser = ({ evento }) => {
  const navigate = useNavigate();
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
    if (fechaInicio > new Date()) {
      return `Empieza en ${calcularTiempoRestante(fechaInicio)}`;
    }

    if (fechaFin > new Date()) {
      return `Termina en ${calcularTiempoRestante(fechaFin)}`;
    }

    return "Evento finalizado";
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

  const textoTiempo =
    fechaInicio && fechaFin
      ? calcularTextoTiempo(fechaInicio, fechaFin)
      : "Fecha no disponible";

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
      flexDirection: "row",
      gap: "12px",
      alignItems: "center",
      cursor: "pointer",
      padding: "10px 18px",
    },
    imageContainer: {
      width: "140px",
      minWidth: "140px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "0",
      backgroundColor: "transparent",
    },
    img: {
      width: "100%",
      maxWidth: "110px",
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
      position: "absolute",
      top: "10px",
      right: "10px",
      width: "180px",
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

  const formatEstado = (str) => {
    if (!str) return "";
    return str.replace(/([A-Z])/g, " $1").trim();
  };

  const handleCardClick = () => {
    if (evento.estado === "Finalizado") {
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
                  e.target.onerror = null; // Previene bucles infinitos si el placeholder también falla
                  e.target.src = logoevento;
                }}
              />
            </div>

            <div style={styles.content}>
              {evento.estado !== "EnCurso" && (
                <div style={styles.estadoContainer}>
                  <p style={styles.estado}>
                    {evento.estado === "EnCurso"
                      ? ""
                      : evento.estado === "Confirmado"
                      ? "Empieza pronto"
                      : formatEstado(evento.estado)}
                  </p>
                </div>
              )}
              <p style={styles.title}>{evento.nombre}</p>
              <p style={styles.descripcion}>{evento.descripcion}</p>
              <p style={styles.text}>
                {evento.ubicacion}, {evento.localidad}, {evento.provincia}
              </p>
              <p style={styles.distance}>A 1km de distancia</p>

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

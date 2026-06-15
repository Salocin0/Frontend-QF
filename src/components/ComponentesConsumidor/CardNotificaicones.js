import { useCallback } from "react";

const CardNotificaciones = ({ notificacion, recargarComponente }) => {

  const marcarComoLeida = useCallback(async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACK_URL}notificaciones/${notificacion.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        console.log("Notificación marcada como leída.");
        recargarComponente();
      } else {
        console.error("Error al marcar la notificación como leída.");
      }
    } catch (error) {
      console.error("Error al realizar la solicitud:", error);
    }
  }, [notificacion.id, recargarComponente]);

  const styles = {
    card: {
      backgroundColor: "var(--qf-bg-secondary)",
      padding: "20px",
      margin: "10px 0",
      borderRadius: "8px",
      boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
      color: "var(--qf-text-primary)",
      width: "100%",
      position: "relative",
      border:
        notificacion.estado === "pendiente"
          ? `2px solid var(--qf-naranja)`
          : "none",
    },
    titulo: {
      fontSize: "18px",
      fontWeight: "bold",
    },
    descripcion: {
      fontSize: "16px",
    },
    fecha: {
      fontSize: "14px",
      color: "var(--qf-text-primary)",
      marginTop: "5px",
    },
    estado: {
      position: "absolute",
      top: "10px",
      right: "10px",
      fontSize: "14px",
      fontWeight: "bold",
      backgroundColor:
        notificacion.estado === "pendiente" ? "var(--qf-naranja)" : "var(--qf-green)",
      padding: "5px 10px",
      borderRadius: "10px",
      color: "var(--qf-text-primary)",
    },
    circuloDorado: {
      position: "absolute",
      width: "15px",
      height: "15px",
      borderRadius: "50%",
      backgroundColor: "var(--qf-naranja)",
      right: "20px",
      top: "50%",
      transform: "translateY(-50%)",
    },
    boton: {
      marginTop: "10px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "10px",
      backgroundColor: "var(--qf-bg-main)",
      color: "var(--qf-text-primary)",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      fontSize: "16px",
    },
    icono: {},
  };

  return (
    <div
      style={{ ...styles.card, cursor: notificacion.estado === "pendiente" ? "pointer" : "default" }}
      onClick={() => {
        if (notificacion.estado === "pendiente") {
          marcarComoLeida();
        }
      }}
    >
      {/* Título de la notificación */}
      <div style={styles.titulo}>{notificacion.titulo}</div>

      {/* Descripción de la notificación */}
      <div style={styles.descripcion}>{notificacion.descripcion}</div>

      {/* Fecha de la notificación */}
      <div style={styles.fecha}>
        {new Date(notificacion.fecha).toLocaleString()}
      </div>

      {/* Círculo dorado si está en estado pendiente */}
      {notificacion.estado === "pendiente" && (
        <div style={styles.circuloDorado}></div>
      )}

    </div>
  );
};

export default CardNotificaciones;

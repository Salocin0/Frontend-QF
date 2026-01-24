import useDynamicColors from "../../UseDinamicColors";
import { useEffect, useCallback } from "react";

const CardNotificaciones = ({ notificacion, recargarComponente }) => {
  const Colors = useDynamicColors();

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
        recargarComponente(); // Recarga el componente después de actualizar
      } else {
        console.error("Error al marcar la notificación como leída.");
      }
    } catch (error) {
      console.error("Error al realizar la solicitud:", error);
    }
  }, [notificacion.id, recargarComponente]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      marcarComoLeida();
    }, 3000);
    return () => clearTimeout(timeout);
  }, [marcarComoLeida]);

  const styles = {
    card: {
      backgroundColor: Colors.GrisAzuladoClaro,
      padding: "20px",
      margin: "10px 0px",
      borderRadius: "8px",
      boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
      color: Colors.Blanco,
      width: "Calc(100% - 40px)",
      position: "relative",
      border:
        notificacion.estado === "pendiente"
          ? `2px solid ${Colors.Naranja}`
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
      color: Colors.Blanco,
      marginTop: "5px",
    },
    estado: {
      position: "absolute",
      top: "10px",
      right: "10px",
      fontSize: "14px",
      fontWeight: "bold",
      backgroundColor:
        notificacion.estado === "pendiente" ? Colors.Naranja : Colors.Verde,
      padding: "5px 10px",
      borderRadius: "10px",
      color: Colors.Blanco,
    },
    circuloDorado: {
      position: "absolute",
      width: "15px",
      height: "15px",
      borderRadius: "50%",
      backgroundColor: Colors.Naranja,
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
      backgroundColor: Colors.GrisAzuladoOscuro,
      color: Colors.Blanco,
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      fontSize: "16px",
    },
    icono: {},
  };

  return (
    <div style={styles.card}>
      {/* Estado en la esquina superior derecha */}

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

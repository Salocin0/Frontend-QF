import { format } from "date-fns";
import { default as React, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useDynamicColors from "../../UseDinamicColors";
import imgDefault from "../img/logoevento.webp";

const EventoProductor = ({ evento, recargarComponente }) => {
  const navigate = useNavigate();
  const Colors = useDynamicColors();
  const [isEnPreparacion, setIsEnPreparacion] = useState(false);
  const [isConfirmado, setIsConfirmado] = useState(false);
  const [isEnCurso, setIsEnCurso] = useState(false);
  const [isPausado, setIsPausado] = useState(false);
  const [isCancelado, setIsCancelado] = useState(false);
  const [isFinalizado, setIsFinalizado] = useState(false);
  const [isProcesoDeCreacion1, setIsProcesoDeCreacion1] = useState(false);
  const [isProcesoDeCreacion2, setIsProcesoDeCreacion2] = useState(false);
  const [isProcesoDeCreacion3, setIsProcesoDeCreacion3] = useState(false);
  const [recargar, setRecargar] = useState(0);
  console.log(evento);

  const handleRecargar = () => {
    setRecargar(recargar + 1);
    handleActualizarEstado();
    recargarComponente();
  };

  const handleActualizarEstado = () => {
    setIsEnPreparacion(false);
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
        break;
      case "EnPreparacion2":
        setIsProcesoDeCreacion2(true);
        break;
      case "EnPreparacion3":
        setIsProcesoDeCreacion3(true);
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
  }, [evento, recargar]);

  const confirmarEvento = () => {
    fetch(
      `${process.env?.REACT_APP_BACK_URL}evento/cambiarEstado/${evento.id}/confirmarEvento`,
      {
        method: "POST",
      }
    )
      .then((response) => response.json())
      .then(() => {
        toast.success("Evento confirmado con éxito");
        handleRecargar();
      })
      .catch((error) => {
        toast.error("Error al confirmar evento");
      });
  };

  const iniciarEvento = () => {
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
      .catch((error) => toast.error("Error al confirmar evento"));
  };

  const finalizarEvento = () => {
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
      .catch((error) => toast.error("Error al confirmar evento"));
  };

  const cancelarEvento = () => {
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
      .catch((error) => toast.error("Error al confirmar evento"));
  };

  const continuarPreparacion1 = () => {
    const eventoId = evento.id;
    navigate(`/registrar-evento3`, { state: { eventoId } });
  };

  const continuarPreparacion2 = () => {
    const eventoId = evento.id;

    // Hacer la solicitud al backend para obtener la cantidad de días del evento
    fetch(`${process.env?.REACT_APP_BACK_URL}evento/dias/${eventoId}`, {
      method: "GET",
    })
      .then((response) => response.json()) // Parsear la respuesta como JSON
      .then((data) => {
        const cantidadDiasEvento = data.data;

        navigate(`/registrar-evento4/${cantidadDiasEvento}`, {
          state: { eventoId },
        });
      })
      .catch((error) => {
        // Manejo de errores
        console.error(
          "Error al obtener la cantidad de días del evento:",
          error
        );
        toast.error("Error al confirmar evento");
      });
  };

  const continuarPreparacion3 = () => {};

  const pausarEvento = () => {
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
      .catch((error) => toast.error("Error al confirmar evento"));
  };

  const reprogramarEvento = () => {
    fetch(
      `${process.env?.REACT_APP_BACK_URL}evento/cambiarEstado/${evento.id}/reprogramarEvento`,
      {
        method: "POST",
      }
    )
      .then((response) => response.json())
      .then(() => {
        toast.success("Evento Reprogramado con éxito");
        handleRecargar();
      })
      .catch((error) => toast.error("Error al confirmar evento"));
  };

  const verSolicitudes = () => {
    navigate(`/ver-solicitudes-evento/${evento.id}`);
  };

  const styles = {
    container: {
      width: "100%",
      backgroundColor: Colors.GrisAzuladoClaro,
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      position: "relative",
      borderRadius: "10px",
      padding: "20px",
      gap: "20px",
      marginBottom: "20px",
    },
    card: {
      display: "flex",
    },
    imageContainer: {
      disolay: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
    },
    img: {
      width: "100%",
      maxWidth: "150px",
      height: "auto",
      objectFit: "cover",
      borderRadius: "10px",
    },
    detailsContainer: {
      flex: "2",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      color: Colors.Naranja,
      width: "100%",
      marginRight: "150px",
    },
    cardTitle: {
      fontSize: "24px",
      fontWeight: "bold",
      textAlign: "center",
    },
    cardDescripcion: {
      fontSize: "16px",
      marginBottom: "10px",
      color: Colors.Blanco,
      textAlign: "center",
    },
    cardText: {
      fontSize: "14px",
      color: Colors.Blanco,
      textAlign: "center",
    },
    cardDistance: {
      fontSize: "14px",
      fontStyle: "italic",
      color: Colors.Blanco,
      textAlign: "center",
    },
    cardEstadoProductor: {
      position: "absolute",
      top: "10px",
      right: "20px",
      color: Colors.Blanco,
      backgroundColor: Colors.Verde,
      padding: "5px 10px",
      borderRadius: "5px",
      fontSize: "14px",
      fontWeight: "bold",
    },
    buttonContainer: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexWrap: "wrap",
      gap: "10px",
    },
    successButton: {
      backgroundColor: Colors.Verde,
      color: "white",
      border: "none",
      padding: "10px 20px",
      borderRadius: "5px",
      cursor: "pointer",
    },
    dangerButton: {
      backgroundColor: Colors.Rojo,
      color: "white",
      border: "none",
      padding: "10px 20px",
      borderRadius: "5px",
      cursor: "pointer",
    },
    primaryButton: {
      backgroundColor: Colors.Azul,
      color: "white",
      border: "none",
      padding: "10px 20px",
      borderRadius: "5px",
      cursor: "pointer",
    },
    secondaryButton: {
      backgroundColor: Colors.GrisClaroPeroNoTanClaro,
      color: "white",
      border: "none",
      padding: "10px 20px",
      borderRadius: "5px",
      cursor: "pointer",
    },
  };

  return (
    <div style={styles.container}>
      <div style={{ ...styles.card }}>
        <div style={styles.imageContainer}>
          <img
            src={evento.img || imgDefault}
            alt="Logo del Evento"
            style={styles.img}
          />
        </div>

        <div style={styles.detailsContainer}>
          <h5 style={styles.cardTitle}>{evento.nombre}</h5>
          <p style={styles.cardDescripcion}>{evento.descripcion}</p>
          <p style={styles.cardText}>
            {evento.ubicacion} - {evento.localidad}, {evento.provincia}
          </p>
          <p style={styles.cardDistance}>A 1km de distancia</p>
        </div>

        <p
          style={{
            ...styles.cardEstadoProductor,
          }}
        >
          {evento.estado === "EnPreparacion" || evento.estado === "EnPreparacion1" || evento.estado === "EnPreparacion2" || evento.estado === "EnPreparacion3"
            ? "En Preparación"
            : evento.estado === "EnCurso"
            ? "En Curso"
            : evento.estado}
        </p>
      </div>

      <div style={styles.buttonContainer}>
        {isEnPreparacion && (
          <button style={styles.successButton} onClick={confirmarEvento}>
            Confirmar Evento
          </button>
        )}
        {isPausado && (
          <button style={styles.dangerButton} onClick={cancelarEvento}>
            Cancelar Evento
          </button>
        )}
        {!isEnCurso && (
          <button style={styles.primaryButton} onClick={verSolicitudes}>
            Ver Solicitudes
          </button>
        )}
        {isConfirmado && (
          <button style={styles.successButton} onClick={iniciarEvento}>
            Iniciar Evento
          </button>
        )}
        {isConfirmado && (
          <button style={styles.secondaryButton} onClick={pausarEvento}>
            Pausar Evento
          </button>
        )}
        {isEnCurso && (
          <button style={styles.dangerButton} onClick={finalizarEvento}>
            Finalizar Evento
          </button>
        )}
      </div>
    </div>
  );
};

export default EventoProductor;

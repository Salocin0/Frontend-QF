import { default as React, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import imgDefault from "../img/logoevento.webp";
import ConfirmDialog from "../ComponentesGenerales/ConfirmDialog";

const EventoProductor = ({ evento, recargarComponente }) => {
  const navigate = useNavigate();
  const [isEnPreparacion, setIsEnPreparacion] = useState(false);
  const [isConfirmado, setIsConfirmado] = useState(false);
  const [isEnCurso, setIsEnCurso] = useState(false);
  const [isPausado, setIsPausado] = useState(false);
  const [, setIsCancelado] = useState(false);
  const [, setIsFinalizado] = useState(false);
  const [, setIsProcesoDeCreacion1] = useState(false);
  const [, setIsProcesoDeCreacion2] = useState(false);
  const [, setIsProcesoDeCreacion3] = useState(false);
  const [recargar, setRecargar] = useState(0);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
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
        setIsEnPreparacion(true);
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [evento, recargar]);

  const confirmarEvento = () => {
    setPendingAction({
      type: 'confirmar',
      message: '¿Estás seguro de que deseas confirmar este evento?',
      title: 'Confirmar Evento'
    });
    setConfirmOpen(true);
  };

  const executeConfirmarEvento = () => {
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
    setPendingAction({
      type: 'iniciar',
      message: '¿Estás seguro de que deseas iniciar este evento?',
      title: 'Iniciar Evento'
    });
    setConfirmOpen(true);
  };

  const executeIniciarEvento = () => {
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
      .catch((error) => toast.error("Error al iniciar evento"));
  };

  const finalizarEvento = () => {
    setPendingAction({
      type: 'finalizar',
      message: '¿Estás seguro de que deseas finalizar este evento? Esta acción no se puede deshacer.',
      title: 'Finalizar Evento'
    });
    setConfirmOpen(true);
  };

  const executeFinalizarEvento = () => {
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
      .catch((error) => toast.error("Error al finalizar evento"));
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

  /*const continuarPreparacion1 = () => {
    const eventoId = evento.id;
    navigate(`/registrar-evento3`, { state: { eventoId } });
  };*/

  /*const continuarPreparacion2 = () => {
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
  };*/

  const pausarEvento = () => {
    setPendingAction({
      type: 'pausar',
      message: '¿Estás seguro de que deseas pausar este evento?',
      title: 'Pausar Evento'
    });
    setConfirmOpen(true);
  };

  const continuarEvento = () => {
    setPendingAction({
      type: 'continuar',
      message: '¿Estás seguro de que deseas continuar este evento?',
      title: 'Continuar Evento'
    });
    setConfirmOpen(true);
  };

  const executeContinuarEvento = () => {
    fetch(
      `${process.env?.REACT_APP_BACK_URL}evento/cambiarEstado/${evento.id}/continuarEvento`,
      {
        method: "POST",
      }
    )
      .then((response) => response.json())
      .then(() => {
        toast.success("Evento continuado con éxito");
        handleRecargar();
      })
      .catch(() => toast.error("Error al continuar evento"));
  };

  const executePausarEvento = () => {
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
      .catch((error) => toast.error("Error al pausar evento"));
  };

  const verSolicitudes = () => {
    navigate(`/ver-solicitudes-evento/${evento.id}`);
  };

  const handleConfirm = () => {
    if (!pendingAction) return;
    
    switch (pendingAction.type) {
      case 'confirmar':
        executeConfirmarEvento();
        break;
      case 'iniciar':
        executeIniciarEvento();
        break;
      case 'pausar':
        executePausarEvento();
        break;
      case 'finalizar':
        executeFinalizarEvento();
        break;
      case 'continuar':
        executeContinuarEvento();
        break;
      default:
        break;
    }
    
    setConfirmOpen(false);
    setPendingAction(null);
  };

  const handleCancel = () => {
    setConfirmOpen(false);
    setPendingAction(null);
  };

  const styles = {
    container: {
      width: "100%",
      backgroundColor: "var(--qf-bg-secondary)",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      position: "relative",
      borderRadius: "10px",
      padding: "20px",
      gap: "20px",
      marginBottom: "20px",
      border: `1px solid var(--qf-naranja)`,
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
      color: "var(--qf-naranja)",
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
      color: "var(--qf-text-primary)",
      textAlign: "center",
    },
    cardText: {
      fontSize: "14px",
      color: "var(--qf-text-primary)",
      textAlign: "center",
    },
    cardDistance: {
      fontSize: "14px",
      fontStyle: "italic",
      color: "var(--qf-text-primary)",
      textAlign: "center",
    },
    cardEstadoProductor: {
      position: "absolute",
      top: "10px",
      right: "20px",
      color: "var(--qf-text-primary)",
      backgroundColor: "var(--qf-green)",
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
      backgroundColor: "var(--qf-green)",
      color: "white",
      border: "none",
      padding: "10px 20px",
      borderRadius: "5px",
      cursor: "pointer",
    },
    dangerButton: {
      backgroundColor: "var(--qf-rojo)",
      color: "white",
      border: "none",
      padding: "10px 20px",
      borderRadius: "5px",
      cursor: "pointer",
    },
    primaryButton: {
      backgroundColor: "var(--qf-blue)",
      color: "white",
      border: "none",
      padding: "10px 20px",
      borderRadius: "5px",
      cursor: "pointer",
    },
    secondaryButton: {
      backgroundColor: "var(--qf-bg-neutral)",
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
            src={
              evento?.img && !String(evento.img).includes("vendimia.mendoza.gov.ar")
                ? evento.img
                : imgDefault
            }
            alt="Logo del Evento"
            style={styles.img}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = imgDefault;
            }}
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
          <button style={styles.successButton} onClick={continuarEvento}>
            Continuar Evento
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
      
      <ConfirmDialog
        open={confirmOpen}
        title={pendingAction?.title || 'Confirmar Acción'}
        message={pendingAction?.message || '¿Estás seguro de que deseas realizar esta acción?'}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default EventoProductor;

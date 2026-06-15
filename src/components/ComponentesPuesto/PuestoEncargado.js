import { default as React, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ConfirmDialog from "../ComponentesGenerales/ConfirmDialog";
import imgDefault from "../img/puestoLogoDefault.jpg";
import {
  FaIdBadge,
  FaPhone,
  FaCalendarPlus,
  FaPlus,
  FaClipboardList,
  FaInfoCircle,
  FaToggleOff,
  FaToggleOn,
} from "react-icons/fa";

const PuestoEncargado = ({ carrito, actualizarListado }) => {
  const navigate = useNavigate();
  const cardRef = useRef(null);
  const [cardWidth, setCardWidth] = useState(0);
  const isNarrow = cardWidth < 620;
  const isVeryNarrow = cardWidth < 350;

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      setCardWidth(entry.contentRect.width);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const [showConfirm, setShowConfirm] = useState(false);

  const [isCreado, setIsCreado] = useState(carrito.estado === "Creado");
  const [isDeshabilitado, setIsDeshabilitado] = useState(
    carrito.estado === "Deshabilitado"
  );

  const formatEstado = (str) => {
    if (!str) return "";
    return str.replace(/([A-Z])/g, " $1").trim();
  };
  const [actualizar, setActualizar] = useState(0);

  useEffect(() => {
    setIsCreado(carrito.estado === "Creado");
    setIsDeshabilitado(carrito.estado === "Deshabilitado");
  }, [carrito, actualizar]);

  const handleactualizar = () => {
    setActualizar(actualizar + 1);
    actualizarListado();
  };

  const suscribirPuesto = () => {
    navigate(`/asociarPuestoAEvento/${carrito.id}`);
  };

  const habilitarPuesto = async () => {
    try {
      const response = await fetch(
        `${process.env?.REACT_APP_BACK_URL}puesto/cambiarEstado/${carrito.id}/habilitar`,
        {
          method: "POST",
        }
      );
      if (!response.ok) {
        throw new Error("Error al habilitar puesto");
      }
      toast.success("Puesto habilitado con éxito");
      handleactualizar();
    } catch (error) {
      toast.error(error.message || "Error al habilitar puesto");
    }
  };

  const deshabilitarPuesto = async () => {
    try {
      const response = await fetch(
        `${process.env?.REACT_APP_BACK_URL}puesto/cambiarEstado/${carrito.id}/deshabilitar`,
        {
          method: "POST",
        }
      );
      if (!response.ok) {
        throw new Error("Error al deshabilitar puesto");
      }
      toast.success("Puesto deshabilitado con éxito");
      handleactualizar();
    } catch (error) {
      toast.error(error.message || "Error al deshabilitar puesto");
    }
  };

  const agregarProducto = () => {
    navigate(`/listado-productos/${carrito.id}`, { state: carrito });
  };

  const pedidosEnCurso = () => {
    navigate(`/pedidos-Encargado/${carrito.id}`, { state: carrito });
  };

  const infoPuesto = () => {
    navigate(`/info-puesto/${carrito.id}`, { state: carrito });
  }

  const styles = {
    container: {
      width: "Calc(100% - 20px)",
      margin: "5px 20px",
      padding: "0.75rem",
      paddingRight: "10px",
      border: `1px solid var(--qf-naranja)`,
      borderRadius: "8px",
      backgroundColor: "var(--qf-bg-secondary)",
      boxSizing: "border-box",

    },
    cardBody: {
      display: "flex",
      flexDirection: "row",
      alignItems: isNarrow ? "flex-start" : "center",
      position: "relative",
      width: "100%",
      gap: isNarrow ? "12px" : "0",
    },
    contenedor: {
      display: "flex",
      flexDirection: "column",
      width: "100%",
    },
    imgContainer: {
      display: "flex",
      width: isVeryNarrow ? "33%" : isNarrow ? "30%" : "20%",
      justifyContent: isNarrow ? "center" : "flex-start",
      flexShrink: 0,
    },
    img: {
      width: "100%",
      maxWidth: isNarrow ? "200px" : "none",
      height: isNarrow ? "100px" : "auto",
      objectFit: "cover",
      borderRadius: "10px",
    },
    detailsContainer: {
      display: "flex",
      width: isVeryNarrow ? "66%" : isNarrow ? "70%" : "60%",
      flexDirection: "column",
      justifyContent: "flex-start",
      alignItems: "flex-start",
      padding: isNarrow ? "0" : "0 1rem",
      gap: "6px",
      flex: 1,
    },
    title: {
      fontSize: "1.5rem",
      fontWeight: "bold",
      marginBottom: "0.5rem",
      color: "var(--qf-naranja)",
    },
    description: {
      margin: "0.25rem 0",
      color: "var(--qf-text-white)",
    },
    buttonsContainer: {
      marginTop: "1rem",
      display: "flex",
      flexDirection: isNarrow ? "column" : "row",
      justifyContent: "center",
      gap: "0.5rem",
      width: "100%",
      minWidth: "100%",
      alignItems: "stretch",
    },
    button: {
      padding: "0.4rem 0.8rem",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      fontWeight: "bold",
      flex: "1 1 0",
      fontSize: "0.9rem",
    },
    successButton: {
      backgroundColor: "var(--qf-green)",
      color: "var(--qf-text-primary)",
    },
    primaryButton: {
      backgroundColor: "var(--qf-blue)",
      color: "var(--qf-text-primary)",
    },
    secondaryButton: {
      backgroundColor: "var(--qf-text-secondary)",
      color: "var(--qf-text-primary)",
    },
    dangerButton: {
      backgroundColor: "var(--qf-rojo)",
      color: "var(--qf-text-primary)",
    },
    estado: {
      fontSize: "20px",
      color: "var(--qf-blanco-puro)",
      backgroundColor: "var(--qf-green)",
      padding: "5px 10px",
      borderRadius: "5px",
      position: isNarrow ? "relative" : "absolute",
      top: isNarrow ? "0" : "5px",
      right: isNarrow ? "0" : "5px",
      alignSelf: isNarrow ? "flex-start" : "auto",
    },
    estadoLabel: {
      fontSize: "14px",
      color: "var(--qf-blanco-puro)",
      backgroundColor: "var(--qf-green)",
      padding: "4px 12px",
      borderRadius: "5px",
      display: "inline-block",
      marginBottom: "8px",
      width: "fit-content",
    },
  };

  return (
    <div ref={cardRef} style={styles.container}>
      <div style={styles.contenedor}>
        {isVeryNarrow && (
          <span style={styles.estadoLabel}>{formatEstado(carrito.estado)}</span>
        )}
        <div style={styles.cardBody}>
          <div style={styles.imgContainer}>
            <img
              src={carrito.img || imgDefault}
              alt="Logo del Evento"
              style={styles.img}
            />
          </div>

          <div style={styles.detailsContainer}>
            <h5 style={styles.title}>{carrito.nombreCarro}</h5>
            <p style={styles.description}>
              <FaIdBadge style={{marginRight:"6px"}} /> {carrito.numeroCarro}
            </p>
            <p style={styles.description}>
              <FaPhone style={{marginRight:"6px"}} /> {carrito.telefonoCarro}
            </p>
          </div>
          {!isVeryNarrow && <span style={styles.estado}>{formatEstado(carrito.estado)}</span>}
        </div>
        <div style={styles.buttonsContainer}>
            {isCreado && (
            <button
              style={{ ...styles.button, ...styles.successButton }}
              onClick={suscribirPuesto}
            >
              <FaCalendarPlus style={{ marginRight: "6px" }} />
              Suscribir Puesto a Evento
            </button>
          )}
          {isDeshabilitado && (
            <button
              style={{ ...styles.button, ...styles.successButton }}
              onClick={habilitarPuesto}
            >
              <FaToggleOn style={{ marginRight: "6px" }} />
              Habilitar Puesto
            </button>
          )}
          <button
            style={{ ...styles.button, ...styles.successButton }}
            onClick={agregarProducto}
          >
            <FaPlus style={{ marginRight: "6px" }} />
            Agregar Productos
          </button>
          <button
            style={{ ...styles.button, ...styles.primaryButton }}
            onClick={pedidosEnCurso}
          >
            <FaClipboardList style={{ marginRight: "6px" }} />
            Pedidos en curso
          </button>
          <button
            style={{ ...styles.button, ...styles.primaryButton }}
            onClick={infoPuesto}
          >
            <FaInfoCircle style={{ marginRight: "6px" }} />
            Info Puesto
          </button>
          {isCreado && (
            <button
              style={{ ...styles.button, ...styles.dangerButton }}
              onClick={() => setShowConfirm(true)}
            >
              <FaToggleOff style={{ marginRight: "6px" }} />
              Deshabilitar Puesto
            </button>
          )}
          <ConfirmDialog
            open={showConfirm}
            title="Deshabilitar Puesto"
            message={`¿Estás seguro de que querés deshabilitar el puesto "${carrito.nombreCarro}"?`}
            onConfirm={() => {
              setShowConfirm(false);
              deshabilitarPuesto();
            }}
            onCancel={() => setShowConfirm(false)}
          />
        </div>
      </div>
    </div>
  );
};

export default PuestoEncargado;

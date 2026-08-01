import { default as React, useContext, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { UserContext } from "../ComponentesGenerales/UserContext";
import imgDefault from "../img/logoevento.webp";

const ESTADOS_ASOCIABLES = ["EnPreparacion", "EnPreparacion1", "EnPreparacion2", "EnPreparacion3", "Confirmado"];

const EventoRepartidor = ({ evento, recargar }) => {
  const navigate = useNavigate();
  const [isEnPreparacion,] = useState(
    ESTADOS_ASOCIABLES.includes(evento.estado)
  );
  const [tieneAsociacionPendiente, setTieneAsociacionPendiente] =
    useState(false);
  const [modalConfirmVisible, setModalConfirmVisible] = useState(false);
  const { user } = useContext(UserContext);
  const cardRef = useRef(null);
  const [isCardNarrow, setIsCardNarrow] = useState(false);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setIsCardNarrow(entry.contentRect.width <= 768);
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const styles = {
    hr:{
      border: "none",
      borderTop: "1px solid var(--qf-naranja)",
      margin: 0,
      width: "100%",
    },
    datos:{
      width: "90%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
    },
    datosNarrow: {
      width: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
    },
    card: {
      border: `1px solid var(--qf-naranja)`,
      borderRadius: "10px",
      margin: "0 0 15px 0",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      backgroundColor: "var(--qf-bg-secondary)",
      position: "relative",
    },
    cardBody: {
      padding: "15px",
    },
    row: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginRight: "15%",
    },
    rowNarrow: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    img: {
      maxWidth: "100%",
      height: "200px",
      borderRadius: "5px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
      objectFit: "cover",
      marginLeft: "3%",
    },
    imgNarrow: {
      width: "100%",
      height: "200px",
      borderRadius: "5px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
      objectFit: "cover",
      margin: 0,
    },
    cardTitle: {
      fontSize: "24px",
      fontWeight: "bold",
      color: "var(--qf-naranja)"
    },
    cardDescripcion: {
      fontSize: "1rem",
      color: "var(--qf-text-white)",
      marginBottom: "10px",
    },
    cardText: {
      fontSize: "0.9rem",
      color: "var(--qf-text-white)",
    },
    cardEstado: {
      fontSize: "1rem",
      fontWeight: "bold",
      color:  "var(--qf-text-white)",
      position: "absolute",
      top: "30px",
      right: "30px",
      backgroundColor: "var(--qf-green)",
      padding: "5px 10px",
      borderRadius: "10px",
    },
    cardEstadoNarrow: {
      fontSize: "1rem",
      fontWeight: "bold",
      color:  "var(--qf-text-white)",
      position: "static",
      marginTop: "0.5rem",
      backgroundColor: "var(--qf-green)",
      padding: "5px 10px",
      borderRadius: "10px",
      display: "inline-block",
    },
    cardTextFecha: {
      fontSize: "0.8rem",
      color: "var(--qf-text-white)",
    },
    mt2: {
      marginTop: "10px",
      padding: "0 15px 15px 15px",
    },
    btnSuccess: {
      backgroundColor: "var(--qf-green)",
      color: "var(--qf-text-primary)",
      border: "none",
      padding: "10px 20px",
      borderRadius: "5px",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    cardTextYellow: {
      fontSize: "0.9rem",
      color: "var(--qf-naranja)",
      fontWeight: "bold",
    },
    dialogContainer: {
      display: "flex",
      position: "fixed",
      top: "0",
      left: "0",
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      zIndex: "1000",
      justifyContent: "center",
      alignItems: "center",
    },
    dialogContent: {
      backgroundColor: "var(--qf-bg-secondary)",
      padding: "20px",
      borderRadius: "10px",
      width: "80%",
      maxWidth: "400px",
      textAlign: "center",
    },
    dialogTitle: {
      textAlign: "center",
      color: "var(--qf-naranja)",
      marginBottom: "1rem",
    },
    infoSection: {
      backgroundColor: "var(--qf-bg-main)",
      padding: "16px",
      borderRadius: "8px",
      marginBottom: "1.5rem",
      border: `1px solid var(--qf-naranja)33`,
    },
    infoRow: {
      display: "flex",
      alignItems: "center",
      marginBottom: "10px",
      gap: "10px",
    },
    infoLabel: {
      color: "var(--qf-naranja)",
      fontWeight: "bold",
      minWidth: "100px",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      fontSize: "14px",
    },
    infoValue: {
      color: "var(--qf-text-white)",
      fontSize: "15px",
    },
    dialogButtons: {
      display: "flex",
      justifyContent: "space-around",
      marginTop: "1rem",
    },
    dialogButton: {
      padding: "0.5rem 1rem",
      border: "none",
      borderRadius: "0.2rem",
      cursor: "pointer",
      fontWeight: "bold",
    },
    btnCancel: {
      backgroundColor: "var(--qf-rojo)",
      color: "var(--qf-blanco-puro)",
    },
    btnConfirm: {
      backgroundColor: "var(--qf-green)",
      color: "var(--qf-blanco-puro)",
    },
  };

  const asociarmeAEvento = () => {
    const headers = new Headers();
    headers.append("ConsumidorId", user?.consumidorId);
    headers.append("Content-Type", "application/json");

    fetch(
      `${process.env?.REACT_APP_BACK_URL}asociacion/evento/${evento.id}/asociarSimple/0/${user.consumidorId}`,
      {
        method: "POST",
        headers: headers,
      }
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.code === 200) {
          toast.success("Asociacion Guardada");
          window.location.reload();
        }
      })
      .catch((error) => {
        console.error(error);
        toast.error("Error al asociar");
      });
  };

  const handleTieneRestriciones = async () => {
    try {
      const headers = new Headers();
      headers.append("ConsumidorId", user?.consumidorId);
      headers.append("Content-Type", "application/json");

      const response = await fetch(
        `${process.env?.REACT_APP_BACK_URL}restriccion/evento/${evento.id}`,
        {
          method: "GET",
          headers: headers,
        }
      );
      if (response.status === 404) {
        asociarmeAEvento(evento.id);
      } else if (response.status === 200) {
        //const responseData = await response.json();
        handleCrearForm();
      } else {
        console.error(`Error: ${response.status}`);
        toast.error("Error al comunicarse con el servidor");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error al crear el formulario");
    }
  };

  const handleCrearForm = () => {
    const url = `/restriccionesEvento/${evento.id}`;
    navigate(url);
  };

  useEffect(() => {
    const handleTieneAsociacionPendiente = async () => {
      try {
        const headers = new Headers();
        headers.append("ConsumidorId", user?.consumidorId);
        headers.append("Content-Type", "application/json");
        const response = await fetch(
          `${process.env?.REACT_APP_BACK_URL}asociacion/evento/${evento.id}/asociarRepartidor/${user.consumidorId}`,
          {
            method: "GET",
            headers: headers,
          }
        );
        if (response.status === 400) {
          setTieneAsociacionPendiente(true);
        } else if (response.status === 200) {
          setTieneAsociacionPendiente(false);
        }
      } catch (error) {
        console.error(error);
      }
    };

    if (isEnPreparacion) {
      handleTieneAsociacionPendiente();
    }
  }, [evento, user, isEnPreparacion]);

  return (
    <div ref={cardRef} style={styles.card}>
      <div style={styles.cardBody}>
        <div style={isCardNarrow ? styles.rowNarrow : styles.row}>
          <img
            src={
              evento?.img && !String(evento.img).includes("vendimia.mendoza.gov.ar")
                ? evento.img
                : imgDefault
            }
            alt="Logo del Evento"
            style={isCardNarrow ? styles.imgNarrow : styles.img}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = imgDefault;
            }}
          />
          <div style={isCardNarrow ? styles.datosNarrow : styles.datos}>
            <h5 style={styles.cardTitle}>{evento.nombre}</h5>
            <p style={styles.cardDescripcion}>{evento.descripcion}</p>
            <p style={styles.cardText}>
              {evento.ubicacion} - {evento.localidad}, {evento.provincia}
            </p>
            <p style={isCardNarrow ? styles.cardEstadoNarrow : styles.cardEstado}>{evento.estado==="EnPreparacion"? "En Preparación" : evento.estado}</p>
          </div>
        </div>
      </div>
      <hr style={styles.hr}/>
      <div style={styles.mt2}>
        <div style={{width: "100%", display: "flex", justifyContent: "center"}}>
          {!tieneAsociacionPendiente && isEnPreparacion && (
            <button
              style={styles.btnSuccess}
              onClick={() => setModalConfirmVisible(true)}
            >
              Asociarme a Evento
            </button>
          )}
          {tieneAsociacionPendiente && (
            <p style={styles.cardTextYellow}>
              Tiene una asociación pendiente
            </p>
          )}
        </div>
      </div>

      {/* Modal de confirmación */}
      {modalConfirmVisible && (
        <div style={styles.dialogContainer}>
          <div style={styles.dialogContent}>
            <h3 style={styles.dialogTitle}>Confirmar asociación</h3>
            <div style={styles.infoSection}>
              <div style={styles.infoRow}>
                <span style={styles.infoLabel}>Evento:</span>
                <span style={styles.infoValue}>{evento.nombre}</span>
              </div>
              <div style={styles.infoRow}>
                <span style={styles.infoLabel}>Ubicación:</span>
                <span style={styles.infoValue}>
                  {evento.ubicacion} - {evento.localidad}, {evento.provincia}
                </span>
              </div>
            </div>
            <div style={styles.dialogButtons}>
              <button
                style={{ ...styles.dialogButton, ...styles.btnCancel }}
                onClick={() => setModalConfirmVisible(false)}
              >
                Cancelar
              </button>
              <button
                style={{ ...styles.dialogButton, ...styles.btnConfirm }}
                onClick={() => {
                  setModalConfirmVisible(false);
                  handleTieneRestriciones();
                }}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventoRepartidor;

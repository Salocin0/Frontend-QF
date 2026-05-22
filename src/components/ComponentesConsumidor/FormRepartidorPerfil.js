import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import Modal from "react-modal";
import { UserContext } from "../ComponentesGenerales/UserContext";
import useBreakpoint from "../../useBreakpoint";

const RepartidorComponent = ({
  mostrarContenidoRepartidor,
  confirmarDeshabilitarR,
  showModal,
  setShowModal,
  setMostrarContenidoRepartidor,
  setMostrarBotonHabilitarDeNuevoR
}) => {
  const { isMobile } = useBreakpoint();

  const [, setEditModeR] = useState(false);
    const { user } = useContext(UserContext);
  const styles = {
    buttonGroup: {
      display: "flex",
      justifyContent: "center",
      gap: "10px",
    },
    card: {
      boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
      borderRadius: "8px",
      width: "100%",
      marginTop: "20px",
      backgroundColor: "var(--qf-bg-secondary)",
      padding: "20px",
      border: `1px solid var(--qf-naranja)`,
    },
    cardBody: {
      padding: "20px",
    },
    row: {
      display: "flex",
      justifyContent: "space-between",
    },
    headerTitle: {
      fontWeight: "bold",
      color: "var(--qf-text-primary)",
    },
    headerText: {
      fontWeight: "bold",
      fontSize: "20px",
      textAlign: "center",
      color: "var(--qf-text-primary)",
    },
    dangerButton: { backgroundColor: "var(--qf-rojo)", color: "white" },
    successButton: { backgroundColor: "var(--qf-green)", color: "white" },
    primaryButton: { backgroundColor: "var(--qf-blue)", color: "white" },
    button: {
      padding: "0.5rem 1rem",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
    },
    modal: {
      overlay: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginLeft: isMobile ? "0" : "20%",
        marginBottom: "50px",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
      },
      content: {
        position: "relative",
        top: "auto",
        left: "auto",
        right: "auto",
        bottom: "auto",
        borderRadius: "8px",
        maxWidth: "400px",
        padding: "20px",
        textAlign: "center",
        backgroundColor: "var(--qf-bg-secondary)",
        color: "var(--qf-text-primary)",
      },
    },
  };
  const handleSaveChangesR = (e) => {
    e.preventDefault();
    setEditModeR(false);
  };

  const handleDeshabilitarR = () => {
    setShowModal(true);
  };

    const cargarDatos = React.useCallback(async (user) => {
      try {
        const response1 = await fetch(
          `${process.env?.REACT_APP_BACK_URL}consumidor/${user.consumidorId}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );
  
        if (response1.ok) {
          const data1 = await response1.json();
  
          if(data1.data.repartidore?.habilitado === true) {
            setMostrarContenidoRepartidor(true);
          }else if (data1.data.repartidore?.habilitado === false) {
            setMostrarContenidoRepartidor(false);
            setMostrarBotonHabilitarDeNuevoR(true);
          }
  
          if (data1.codigo === 200) {
            toast.success("Datos cargados correctamente");
          } else if (data1.codigo === 400) {
            toast.error("Error al cargar los datos");
          }
        } else {
          throw new Error("Error en la respuesta HTTP");
        }
      } catch (error) {
        console.error("Error al cargar los datos:", error);
      }
    }, [setMostrarContenidoRepartidor, setMostrarBotonHabilitarDeNuevoR]);

    useEffect(() => {
      if (user) {
        cargarDatos(user);
      }
    }, [user, cargarDatos]);

  if (!mostrarContenidoRepartidor) {
    return null;
  }

  return (
    <div style={styles.card}>
      <h1 style={styles.headerTitle}>Repartidor</h1>
      <form onSubmit={handleSaveChangesR}>
        <div style={{ marginBottom: "10px", textAlign: "center" }}>
          <p style={styles.headerText}>Usted actualmente es Repartidor</p>
        </div>

        <div style={{ display: "flex", flexDirection: "row" }}>
          <button
            type="button"
            style={{ ...styles.button, ...styles.dangerButton, width: "100%" }}
            onClick={handleDeshabilitarR}
          >
            Deshabilitar Usuario
          </button>
          <Modal
            isOpen={showModal}
            onRequestClose={() => setShowModal(false)}
            contentLabel="Confirmación de deshabilitación"
            style={styles.modal}
          >
            <h2 style={{ marginBottom: "20px", fontSize: "24px" }}>
              ¿Está seguro de deshabilitar el Rol de su cuenta?
            </h2>
            <div style={styles.buttonGroup}>
              <button
                onClick={() => setShowModal(false)}
                style={{ ...styles.button, ...styles.successButton }}
              >
                Cancelar
              </button>
              <button
                onClick={confirmarDeshabilitarR}
                style={{ ...styles.button, ...styles.dangerButton }}
              >
                Deshabilitar
              </button>
            </div>
          </Modal>
        </div>
      </form>
    </div>
  );
};

export default RepartidorComponent;

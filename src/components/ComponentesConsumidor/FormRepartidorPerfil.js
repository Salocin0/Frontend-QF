import React, { useState } from "react";
import Modal from "react-modal";
import useDynamicColors from "../../UseDinamicColors";

const RepartidorComponent = ({
  mostrarContenidoRepartidor,
  handleSaveChangesR,
  handleDeshabilitarR,
  confirmarDeshabilitarR,
  showModal,
  setShowModal,
}) => {
  const Colors = useDynamicColors();
  const styles = {
    card: {
      boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
      borderRadius: "8px",
      width: "100%",
      marginTop: "20px",
      backgroundColor: Colors.GrisAzuladoClaro,
      padding: "20px",
      border: `1px solid ${Colors.Blanco}`,
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
        color: Colors.Blanco,
      },
    headerText: {
      fontWeight: "bold",
      fontSize: "20px",
      textAlign: "center",
      color: Colors.Blanco,
    },
    dangerButton: { backgroundColor: Colors.Rojo, color: "white" },
    successButton: { backgroundColor: Colors.Verde, color: "white" },
    primaryButton: { backgroundColor: Colors.Azul, color: "white" },
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
      },
    },
  };

  if (!mostrarContenidoRepartidor) {
    return null;
  }

  return (
    <div style={styles.card}>
      <h1 style={styles.headerTitle}>Repartidor</h1>
      <form onSubmit={handleSaveChangesR}>
        <div style={{ marginBottom: "10px", textAlign: "center" }}>
          <p style={styles.headerText}>
            Usted actualmente es Repartidor
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "row" }}>
          <button
            type="button"
            style={{...styles.button, ...styles.dangerButton, width: "100%"}}
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
            <h2>¿Está seguro de deshabilitar su cuenta?</h2>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <button
                onClick={() => setShowModal(false)}
                style={{ marginRight: "10px" }}
              >
                Cancelar
              </button>
              <button
                onClick={confirmarDeshabilitarR}
                style={{ marginLeft: "10px" }}
              >
                Sí, deshabilitar
              </button>
            </div>
          </Modal>
        </div>
      </form>
    </div>
  );
};

export default RepartidorComponent;

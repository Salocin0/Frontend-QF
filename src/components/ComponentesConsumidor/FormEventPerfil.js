import React from "react";
import Modal from "react-modal";
import useDynamicColors from "../../UseDinamicColors";

const EventProducerForm = ({
  mostrarContenidoProductor,
  editModePE,
  handleEditModeTogglePE,
  handleSaveChangesPE,
  handleCancelChangesPE,
  cuitPE,
  handleCuitChangePE,
  razonSocialPE,
  handleRazonSocialChangePE,
  condicionIvaPE,
  handleCondicionPE,
  handleDeshabilitarPE,
  showModal,
  setShowModal,
  confirmarDeshabilitarPE,
}) => {
  const Colors = useDynamicColors();
  if (!mostrarContenidoProductor) return null;

  const styles = {
    card: {
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      borderRadius: "8px",
      width: "100%",
      backgroundColor: Colors.GrisAzuladoClaro,
      marginTop: "20px",
      border: `1px solid ${Colors.Blanco}`,
    },
    cardBody: {
      padding: "20px",
    },
    headerRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "20px",
    },
    headerText: {
      fontWeight: "bold",
      color: Colors.Blanco,
    },
    label: {
      marginBottom: "5px",
      fontWeight: "bold",
      margin: "0",
    },
    input: {
      width: "100%",
      padding: "8px",
      borderRadius: "5px",
      marginBottom: "16px",
      border: "none",
      backgroundColor: Colors.GrisAzuladoOscuro,
      color: Colors.Blanco,
    },
    buttonGroup: {
      display: "flex",
      justifyContent: "center",
      gap: "10px",
    },
    button: {
      padding: "0.5rem 1rem",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      marginRight: "0.5rem",
    },
    modalOverlay: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    modalContent: {
      position: "relative",
      padding: "20px",
      borderRadius: "8px",
      maxWidth: "400px",
      textAlign: "center",
    },
    dangerButton: { backgroundColor: Colors.Rojo, color: "white" },
    successButton: { backgroundColor: Colors.Verde, color: "white" },
    primaryButton: { backgroundColor: Colors.Azul, color: "white" },
  };

  return (
    <div style={styles.card}>
      <div style={styles.cardBody}>
        <div style={styles.headerRow}>
          <h1 style={styles.headerText}>Productor de Eventos</h1>
          {editModePE ? (
            <>
              <button
                type="button"
                style={{ ...styles.button, ...styles.successButton }}
                onClick={handleSaveChangesPE}
              >
                Guardar
              </button>
              <button
                type="button"
                style={{
                  ...styles.button,
                  ...styles.dangerButton,
                }}
                onClick={handleCancelChangesPE}
              >
                Cancelar
              </button>
            </>
          ) : (
            <button
              type="button"
              style={{ ...styles.button, ...styles.primaryButton }}
              onClick={handleEditModeTogglePE}
            >
              Editar
            </button>
          )}
        </div>

        <form onSubmit={handleSaveChangesPE}>
          <label style={styles.label} htmlFor="cuit">
            CUIT
          </label>
          <input
            type="number"
            id="cuit"
            style={styles.input}
            value={cuitPE}
            onChange={handleCuitChangePE}
            readOnly={!editModePE}
            disabled={!editModePE}
            required
          />
          <label style={styles.label} htmlFor="razonSocial">
            Razón Social
          </label>
          <input
            type="text"
            id="razonSocial"
            style={styles.input}
            value={razonSocialPE}
            onChange={handleRazonSocialChangePE}
            readOnly={!editModePE}
            disabled={!editModePE}
            required
          />
          <label style={styles.label} htmlFor="condicion">
            Condición IVA
          </label>
          <input
            type="text"
            id="condicion"
            style={styles.input}
            value={condicionIvaPE}
            onChange={handleCondicionPE}
            readOnly={!editModePE}
            disabled={!editModePE}
            required
          />
        </form>

        <div style={styles.buttonGroup}>
          <button
            type="button"
            style={{ ...styles.button, ...styles.dangerButton, width: "100%" }}
            onClick={handleDeshabilitarPE}
          >
            Deshabilitar Usuario
          </button>
        </div>

        <Modal
          isOpen={showModal}
          onRequestClose={() => setShowModal(false)}
          contentLabel="Confirmación de deshabilitación"
          style={{ overlay: styles.modalOverlay, content: styles.modalContent }}
        >
          <h2>¿Está seguro de deshabilitar su cuenta?</h2>
          <div style={styles.buttonGroup}>
            <button
              onClick={() => setShowModal(false)}
              style={{ ...styles.button }}
            >
              Cancelar
            </button>
            <button
              onClick={confirmarDeshabilitarPE}
              style={{
                ...styles.button,
                ...styles.dangerButton
              }}
            >
              Sí, deshabilitar
            </button>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default EventProducerForm;

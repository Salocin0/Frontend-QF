import React, { useState } from "react";
import Modal from "react-modal";
import useDynamicColors from "../../UseDinamicColors";

const EncargadoPuesto = ({
  mostrarContenidoEncargadoPuesto,
  editModeEPC,
  cuitEPC,
  razonSocialEPC,
  condicionEPC,
  handleSaveChangesEPC,
  handleCancelChangesEPC,
  handleEditModeToggleEPC,
  handleCuitChangeEPC,
  handleRazonSocialChangeEPC,
  handleCondicionEPC,
  handleDocumentosChangeEPC,
  handleDeshabilitarEPC,
  showModal,
  setShowModal,
  confirmarDeshabilitarEPC,
}) => {
  const Colors = useDynamicColors();
  const styles = {
    container: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
      marginTop: "20px",
      backgroundColor: Colors.GrisAzuladoClaro,
      borderRadius: "10px",
      border: `1px solid ${Colors.Blanco}`,
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    },
    form: {
      padding: "1rem",
      width: "100%",
    },
    row: {
      display: "flex",
      justifyContent: "space-between",
      width: "100%",
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      width: "100%",
    },
    h1: {
      fontWeight: "bold",
      color: Colors.Blanco,
    },
    buttonContainer: {
      display: "flex",
      justifyContent: "flex-end",
    },
    button: {
        padding: "0.5rem 1rem",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        marginRight: "0.5rem",
      },
    input: {
      width: "100%",
      padding: "0.5rem",
      marginBottom: "1rem",
      border: "none",
      borderRadius: "5px",
      backgroundColor: Colors.GrisAzuladoOscuro,
      color: Colors.Blanco,
    },
    fileInput: {
      width: "100%",
      padding: "0.5rem",
      borderRadius: "5px",
      border: `none`,
      backgroundColor: Colors.GrisAzuladoOscuro,
      color: Colors.Blanco,
      marginBottom: "1rem",
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
    label: {
      margin: "0",
      marginBottom: "5px",
      fontWeight: "bold",
    },
    dangerButton: { backgroundColor: Colors.Rojo, color: "white" },
    successButton: { backgroundColor: Colors.Verde, color: "white" },
    primaryButton: { backgroundColor: Colors.Azul, color: "white" },
  };

  return mostrarContenidoEncargadoPuesto ? (
    <section style={styles.container}>
      <div style={styles.form}>
        <div style={styles.header}>
          <h1 style={styles.h1}>Encargado Puesto de Comida</h1>
          <div style={styles.buttonContainer}>
            {editModeEPC ? (
              <>
                <button
                  type="button"
                  style={{ ...styles.button, ...styles.successButton}}
                  onClick={handleSaveChangesEPC}
                >
                  Guardar
                </button>
                <button
                  type="button"
                  style={{ ...styles.button, ...styles.dangerButton}}
                  onClick={handleCancelChangesEPC}
                >
                  Cancelar
                </button>
              </>
            ) : (
              <button
                type="button"
                style={{ ...styles.button, ...styles.primaryButton}}
                onClick={handleEditModeToggleEPC}
              >
                Editar
              </button>
            )}
          </div>
        </div>
        <form onSubmit={handleSaveChangesEPC}>
          <div>
            <label style={styles.label} htmlFor="cuit">
              CUIT
            </label>
            <input
              type="number"
              id="cuit"
              style={styles.input}
              value={cuitEPC}
              onChange={handleCuitChangeEPC}
              readOnly={!editModeEPC}
              disabled={!editModeEPC}
              required
            />
          </div>
          <div>
            <label style={styles.label} htmlFor="razonSocial">
              Razon Social
            </label>
            <input
              type="text"
              id="razonSocial"
              style={styles.input}
              value={razonSocialEPC}
              onChange={handleRazonSocialChangeEPC}
              readOnly={!editModeEPC}
              disabled={!editModeEPC}
              required
            />
          </div>
          <div>
            <label style={styles.label} htmlFor="Condicon">
              Condicion IVA
            </label>
            <input
              type="text"
              id="IVA"
              style={styles.input}
              value={condicionEPC}
              onChange={handleCondicionEPC}
              readOnly={!editModeEPC}
              disabled={!editModeEPC}
            />
          </div>
          <div>
            <label style={styles.label} htmlFor="documentos">Documentos</label>
            <input
              type="file"
              id="documentos"
              style={styles.fileInput}
              onChange={handleDocumentosChangeEPC}
              readOnly={!editModeEPC}
              disabled={!editModeEPC}
            />
          </div>
        </form>
        <button
          type="button"
          style={{ ...styles.button, ...styles.dangerButton, width: "100%" }}
          onClick={handleDeshabilitarEPC}
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
            <button onClick={() => setShowModal(false)} style={styles.button}>
              Cancelar
            </button>
            <button onClick={confirmarDeshabilitarEPC} style={styles.button}>
              Sí, deshabilitar
            </button>
          </div>
        </Modal>
      </div>
    </section>
  ) : null;
};

export default EncargadoPuesto;

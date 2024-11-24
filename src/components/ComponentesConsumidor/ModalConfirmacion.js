import Modal from "react-modal";
import Boton from "./Boton";
export const ModalConfirmacion = ({ isOpen, onClose, onConfirm, texto }) => (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Confirmación"
      style={{
        overlay: {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
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
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        },
      }}
    >
      <h2 style={{ marginBottom: "16px" }}>{texto}</h2>
      <div>
        <Boton texto="Cancelar" onClick={onClose} />
        <Boton
          texto="Sí, deshabilitar"
          onClick={onConfirm}
          estilo={{
            backgroundColor: "#d9534f",
            color: "white",
          }}
        />
      </div>
    </Modal>
  );
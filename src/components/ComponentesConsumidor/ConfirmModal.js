  import Modal from "react-modal";
  export const ConfirmModal = ({ isOpen, onClose, onConfirm, title, description }) => (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Confirmación"
      style={{
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
      }}
    >
      <h2>{title}</h2>
      <p>{description}</p>
      <div>
        <button onClick={onClose}>Cancelar</button>
        <button onClick={onConfirm}>Confirmar</button>
      </div>
    </Modal>
  );
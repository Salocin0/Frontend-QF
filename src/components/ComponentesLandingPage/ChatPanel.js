import React from "react";
import Chatbot from "./ChatBot";

const Panel = ({ onClose, onMinimize, position, bottom, right, top, left, isLogin }) => {
  const styles = {
    panel: {
      position: position || "fixed",
      bottom: bottom || (isLogin ? "56px" : "57px"),
      top: top || "auto",
      left: left || "auto",
      right: left ? "auto" : (right ?? (isLogin ? "calc(80% - 400px)" : 0)),
      width: "min(400px, 100%)",
      maxWidth: "calc(100vw - 20px)",
      height: "auto",
      backgroundColor: "var(--qf-bg-main)",
      border: "2px solid #ffbd59",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
      transition: "left 0.3s ease",
      zIndex: 1000,
      boxSizing: "border-box",
      borderRadius: "20px",
    },
    closeButton: {
      position: "absolute",
      top: "14px",
      right: "20px",
      background: "none",
      border: "none",
      fontSize: "30px",
      color: "#b0002c",
      zIndex: 2,
      width: "36px",
      height: "36px",
      display: "grid",
      placeItems: "center",
      lineHeight: 1,
      cursor: "pointer",
    },
  };
  return (
    <div style={styles.panel}>
      <button type="button" aria-label="Cerrar chat" style={styles.closeButton} onClick={onClose}>
        &times;
      </button>
      {onMinimize && (
        <button type="button" aria-label="Minimizar chat" title="Minimizar" style={{ ...styles.closeButton, right: "56px", fontSize: "24px", width: "36px", height: "36px" }} onClick={onMinimize}>
          <span aria-hidden="true">−</span>
        </button>
      )}
      <Chatbot />
    </div>
  );
};

export default Panel;

import React from "react";
import Chatbot from "./ChatBot";

const Panel = ({ onClose, position, bottom, right, top, left, isLogin }) => {
  const styles = {
    panel: {
      position: position || "fixed",
      bottom: bottom || (isLogin ? "56px" : "57px"),
      top: top || "auto",
      left: left || "auto",
      right: left ? "auto" : (right ?? (isLogin ? "calc(80% - 400px)" : 0)),
      width: "400px",
      maxWidth: "calc(100vw - 20px)",
      height: "auto",
      backgroundColor: "var(--qf-bg-main)",
      border: `2px solid var(--qf-naranja)`,
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
      transition: "left 0.3s ease",
      zIndex: 1000,
      boxSizing: "border-box",
      borderRadius: "20px",
    },
    closeButton: {
      position: "absolute",
      top: "10px",
      right: "12px",
      // Por encima del header del chat (que tiene su propio fondo y padding).
      zIndex: 2,
      width: "32px",
      height: "32px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "rgba(0, 0, 0, 0.35)",
      border: "1px solid var(--qf-naranja)",
      borderRadius: "50%",
      fontSize: "20px",
      lineHeight: 1,
      color: "var(--qf-naranja)",
      cursor: "pointer",
      padding: 0,
    },
  };
  return (
    <div style={styles.panel}>
      <button style={styles.closeButton} onClick={onClose}>
        &times;
      </button>
      <Chatbot />
    </div>
  );
};

export default Panel;

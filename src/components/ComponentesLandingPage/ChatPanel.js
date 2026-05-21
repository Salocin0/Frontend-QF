import React from "react";
import Chatbot from "./ChatBot";

const Panel = ({ onClose, position, bottom,right,top,left,isLogin }) => {
  const styles = {
    panel: {
      position: "fixed",
      bottom: "57px",
      right: isLogin ? "calc(80% - 400px)": 0,
      width: "400px",
      height: "auto",
      backgroundColor: "var(--qf-bg-main)",
      border: `2px solid var(--qf-naranja)`,
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
      zIndex: 1000,
      boxSizing: "border-box",
      borderRadius: "20px",
    },
    closeButton: {
      position: "absolute",
      top: "5px",
      right: "20px",
      background: "none",
      border: "none",
      fontSize: "30px",
      color: "var(--qf-text-muted)",
      cursor: "pointer",
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

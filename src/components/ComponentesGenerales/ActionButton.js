import React from "react";
import { FaRegSquare } from "react-icons/fa";

const ActionButton = ({ title, icon, onClick, style }) => {
  
  const styles = {
    container: {
      ...style,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      border: `2px solid var(--qf-blanco-puro)`,
    },
    icon: {
      width: "80px",
      height: "80px",
      marginRight: "20px",
      borderRadius: "50%",
    },
    iconFont: {
      width: "25px",
      height: "25px",
      marginRight: "20px",
      color: "black"
    },
    title: {
      fontWeight: "bold",
      fontSize: "1.2rem",
      color: "black",
    },
  };

  // Renderiza el icono recibido por prop o un icono genérico por defecto
  const renderIcon = () => {
    if (React.isValidElement(icon)) return <span style={styles.iconFont}>{icon}</span>;
    return <span style={styles.iconFont}><FaRegSquare /></span>;
  };

  return (
    <div style={styles.container} onClick={onClick}>
      {renderIcon()}
      <h2 style={styles.title}>{title}</h2>
    </div>
  );
};

export default ActionButton;

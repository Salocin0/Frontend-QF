import React from "react";
import useDynamicColors from "../../UseDinamicColors";

const ActionButton = ({ title, icon, onClick, style }) => {
  const Colors = useDynamicColors();
  const ICON = "ICON";
  
  const styles = {
    container: {
      ...style,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      border: `2px solid ${Colors.BlancoEnBlanco}`,
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

  // Nueva lógica para seleccionar el ícono basado en el título
  const renderIcon = () => {
    return <span style={styles.iconFont}>{ICON}</span>;
  };

  return (
    <div style={styles.container} onClick={onClick}>
      {renderIcon()}
      <h2 style={styles.title}>{title}</h2>
    </div>
  );
};

export default ActionButton;

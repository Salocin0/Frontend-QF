import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faArrowRightToBracket, faShoppingCart } from '@fortawesome/free-solid-svg-icons'; // Asegúrate de importar faShoppingCart
import useDynamicColors from "../../UseDinamicColors";

const ActionButton = ({ title, icon, onClick, style }) => {
  const Colors = useDynamicColors();
  
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
    if (title === "Carrito") {
      return <FontAwesomeIcon icon={faShoppingCart} style={styles.iconFont} />;
    } else if (title === "Mi Perfil") {
      return <FontAwesomeIcon icon={faUser} style={styles.iconFont} />;
    } else {
      return <FontAwesomeIcon icon={faArrowRightToBracket} style={styles.iconFont} />;
    }
  };

  return (
    <div style={styles.container} onClick={onClick}>
      {renderIcon()}
      <h2 style={styles.title}>{title}</h2>
    </div>
  );
};

export default ActionButton;

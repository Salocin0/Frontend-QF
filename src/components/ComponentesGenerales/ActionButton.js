import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faArrowRightToBracket } from '@fortawesome/free-solid-svg-icons';
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
    },
    title: {
      fontWeight: "bold",
      fontSize: "1.2rem",
      color: "black",
    },
  };

  // Comprobar si el ícono no se proporciona y el título es "Mi Perfil"
  const renderIcon = () => {
    if (!icon && title === "Mi Perfil") {
      return <FontAwesomeIcon icon={faUser} style={styles.iconFont} />;
    }
    // Si hay un ícono, se utiliza el proporcionado; de lo contrario, se muestra otro ícono
    return icon ? <img src={icon} alt={title} style={styles.icon} /> : <FontAwesomeIcon icon={faArrowRightToBracket} style={styles.iconFont} />;
  };

  return (
    <div style={styles.container} onClick={onClick}>
      {renderIcon()}
      <h2 style={styles.title}>{title}</h2>
    </div>
  );
};

export default ActionButton;

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInstagram,
  faTwitterSquare,
  faFacebookSquare,
} from "@fortawesome/free-brands-svg-icons";
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons"; // Importación de iconos de sol y luna
import useDynamicColors from "../../UseDinamicColors";

const Footer = () => {
  const Colors = useDynamicColors();
  
  const toggleTheme = () => {
    const newMode = !Colors.modoOscuroActivo;
    localStorage.setItem("modoOscuroActivo", newMode);
    window.location.reload(); // Recarga para aplicar el cambio en toda la aplicación
  };

  const styles = {
    footerStyle: {
      padding: "1rem",
      backgroundColor: Colors.Blanco,
      borderTop: `1px solid ${Colors.GrisClaro}`,
      textAlign: "center",
      position: "fixed",
      bottom: "0",
      width: "100%",
      left: "0",
    },
    containerStyle: {
      maxWidth: "960px",
      margin: "0 auto",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    rowStyle: {
      display: "flex",
      width: "100%",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    leftSection: {
      display: "flex",
      gap: "1rem",
      alignItems: "center",
    },
    rightSection: {
      textAlign: "right",
    },
    linkStyle: {
      color: Colors.Azul,
      textDecoration: "none",
      fontSize: "0.875rem",
      cursor: "pointer",
    },
    iconStyle: {
      color: Colors.Azul,
      textDecoration: "none",
      cursor: "pointer",
    },
    textStyle: {
      fontSize: "0.875rem",
      color: Colors.Negro,
      margin: 0,
    },
  };

  return (
    <footer style={styles.footerStyle}>
      <div style={styles.containerStyle}>
        <div style={styles.rowStyle}>
          <div style={styles.leftSection}>
            <a href="/" style={styles.linkStyle}>
              Trabaja con Nosotros
            </a>
            <a href="/registrarse" style={styles.linkStyle}>
              Contacto
            </a>
            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              style={styles.iconStyle}
            >
              <FontAwesomeIcon icon={faInstagram} size="lg" />
            </a>
            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              style={styles.iconStyle}
            >
              <FontAwesomeIcon icon={faTwitterSquare} size="lg" />
            </a>
            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              style={styles.iconStyle}
            >
              <FontAwesomeIcon icon={faFacebookSquare} size="lg" />
            </a>
            <FontAwesomeIcon
              icon={Colors.modoOscuroActivo ? faSun : faMoon}
              onClick={toggleTheme}
              style={{ ...styles.iconStyle, marginRight: "1rem", fontSize: "1.5rem" }}
            />
          </div>
          <div style={styles.rightSection}>
            
            <p style={styles.textStyle}>
              QuickFood. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

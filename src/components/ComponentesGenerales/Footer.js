import React from "react";
import useDynamicColors from "../../UseDinamicColors";
import { FaInstagram, FaFacebook, FaTwitter } from "react-icons/fa";

const Footer = () => {
  const Colors = useDynamicColors();

  const styles = {
    footerStyle: {
      padding: "0.5rem 1rem",
      backgroundColor: Colors.GrisAzuladoOscuro,
      textAlign: "center",
      position: "fixed",
      bottom: "0",
      width: "100%",
      left: "0",
      borderTop: `1px solid ${Colors.BlancoEnBlanco}`,
      zIndex: 900
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
      color: Colors.Naranja,
      textDecoration: "none",
      fontSize: "0.875rem",
      cursor: "pointer",
    },
    iconStyle: {
      color: Colors.Naranja,
      textDecoration: "none",
      cursor: "pointer",
    },
    textStyle: {
      fontSize: "0.875rem",
      color: Colors.BlancoEnBlanco,
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
              <FaInstagram />
            </a>
            <a
              href="https://www.facebook.com/"
              target="_blank"
              rel="noopener noreferrer"
              style={styles.iconStyle}
            >
              <FaFacebook />
            </a>
            <a
              href="https://www.twitter.com/"
              target="_blank"
              rel="noopener noreferrer"
              style={styles.iconStyle}
            >
              <FaTwitter />
            </a>
          </div>
          <div style={styles.rightSection}>
            
            <p style={styles.textStyle}>
              &copy; QuickFood - Todos los derechos reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

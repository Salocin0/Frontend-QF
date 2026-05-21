import React from "react";
import { FaInstagram, FaFacebook, FaTwitter } from "react-icons/fa";
import useBreakpoint from "../../useBreakpoint";

const Footer = () => {
  const { isMobile } = useBreakpoint();

  const styles = {
    footerStyle: {
      padding: isMobile ? "0.5rem" : "0.5rem 1rem",
      backgroundColor: "var(--qf-bg-main)",
      textAlign: "center",
      position: "fixed",
      bottom: "0",
      width: "100%",
      left: "0",
      borderTop: "1px solid var(--qf-blanco-puro)",
      zIndex: 900,
    },
    containerStyle: {
      maxWidth: "960px",
      margin: "0 auto",
      display: "flex",
      flexDirection: isMobile ? "column" : "row",
      gap: isMobile ? "0.25rem" : "0",
      justifyContent: "space-between",
      alignItems: "center",
    },
    rowStyle: {
      display: "flex",
      width: "100%",
      flexDirection: isMobile ? "column" : "row",
      justifyContent: isMobile ? "center" : "space-between",
      alignItems: "center",
      gap: isMobile ? "0.5rem" : "0",
    },
    leftSection: {
      display: "flex",
      gap: isMobile ? "0.5rem" : "1rem",
      alignItems: "center",
      justifyContent: "center",
      flexWrap: "wrap",
    },
    rightSection: {
      textAlign: "center",
    },
    linkStyle: {
      color: "var(--qf-naranja)",
      textDecoration: "none",
      fontSize: isMobile ? "0.75rem" : "0.875rem",
      cursor: "pointer",
    },
    iconStyle: {
      color: "var(--qf-naranja)",
      textDecoration: "none",
      cursor: "pointer",
      fontSize: isMobile ? "0.9rem" : "1rem",
    },
    textStyle: {
      fontSize: isMobile ? "0.65rem" : "0.875rem",
      color: "var(--qf-blanco-puro)",
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

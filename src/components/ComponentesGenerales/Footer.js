import React from "react";
import { FaInstagram, FaFacebook, FaTwitter } from "react-icons/fa";
import useBreakpoint from "../../useBreakpoint";

const Footer = () => {
  const { isMobile } = useBreakpoint();

  const styles = {
    footerStyle: {
      padding: isMobile ? "0.25rem 0.5rem" : "0.5rem 1rem",
      backgroundColor: "var(--qf-bg-main)",
      textAlign: "center",
      position: "fixed",
      bottom: "0",
      width: "100%",
      left: "0",
      borderTop: "1px solid var(--qf-naranja)",
      zIndex: 900,
    },
    containerStyle: {
      maxWidth: isMobile ? "100%" : "960px",
      margin: "0 auto",
      display: "flex",
      flexDirection: isMobile ? "column" : "row",
      gap: "0",
      justifyContent: "space-between",
      alignItems: "center",
    },
    rowStyle: {
      display: "flex",
      width: "100%",
      flexDirection: isMobile ? "column" : "row",
      justifyContent: isMobile ? "center" : "space-between",
      alignItems: "center",
      gap: isMobile ? "0.1rem" : "0",
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
      fontSize: "0.875rem",
      cursor: "pointer",
    },
    iconStyle: {
      color: "var(--qf-naranja)",
      textDecoration: "none",
      cursor: "pointer",
      fontSize: "1rem",
    },
    textStyle: {
      fontSize: isMobile ? "0.7rem" : "0.875rem",
      color: "var(--qf-text-primary)",
      margin: 0,
    },
  };

  return (
    <footer style={styles.footerStyle} data-testid="footer">
      <div style={styles.containerStyle}>
        <div style={styles.rowStyle}>
          <div style={styles.leftSection}>
            <a href="/seleccion-perfil" style={styles.linkStyle}>
              Trabaja con Nosotros
            </a>
            <a href="mailto:consultas@QF.com" style={styles.linkStyle}>
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

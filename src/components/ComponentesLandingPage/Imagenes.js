import React from "react";
import Carrousel from "./Carrousel";
import useBreakpoint from "../../useBreakpoint";

const Imagenes = () => {
  const { isMobile } = useBreakpoint();

  const styles = {
    container: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      padding: "2rem 0", 
      backgroundColor: "var(--qf-bg-secondary)",
    },
    titleContainer: {
      textAlign: "center",
      paddingBottom: "1rem",
    },
    contentRow: {
      display: "flex",
      flexDirection: isMobile ? "column" : "row",
      alignItems: "center",
      width: "100%",
      maxWidth: "1200px",
      justifyContent: "space-between",
      padding: isMobile ? "0 1rem" : "0",
    },
    colLg8: {
      flex: isMobile ? "none" : 2,
      width: isMobile ? "100%" : "auto",
      paddingRight: isMobile ? "0" : "1rem",
    },
    colLg4: {
      flex: isMobile ? "none" : 1,
      width: isMobile ? "100%" : "auto",
    },
    descripcion: {
      textAlign: "center",
    },
    text: {
      color: "#E0E0E0",
    }
  };
  
  return (
    <div style={styles.container}>
      <div style={styles.titleContainer}>
        <h2>Próximos Eventos</h2>
      </div>
      <div style={styles.contentRow}>
        <div style={styles.colLg8}>
          <Carrousel />
        </div>
        <div style={styles.colLg4}>
          <div style={styles.descripcion}>
            <p style={styles.text}>
              Estos son los próximos eventos en los que trabajaremos con
              Quickfood para mejorar la experiencia de compra de los
              espectadores.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Imagenes;

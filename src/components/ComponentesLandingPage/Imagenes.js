import React from "react";
import Carrousel from "./Carrousel";
import useDynamicColors from "../../UseDinamicColors";

const Imagenes = () => {
  const Colors = useDynamicColors();

  const styles = {
    container: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      padding: "2rem 0", 
      backgroundColor: Colors.GrisAzuladoClaro,
    },
    titleContainer: {
      textAlign: "center",
      paddingBottom: "1rem",
    },
    contentRow: {
      display: "flex",
      alignItems: "center",
      width: "100%",
      maxWidth: "1200px",
      justifyContent: "space-between",
    },
    colLg8: {
      flex: 2,
      paddingRight: "1rem",
    },
    colLg4: {
      flex: 1,
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

import React from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./../sass/main.scss";
import img from "./../img/comida-rapida-casera.jpg";
import useDynamicColors from "../../UseDinamicColors";

const ComoFunciona = () => {
  const Colors = useDynamicColors();
  const styles = {
    comofunciona: {
      height: "100%",
      backgroundColor: Colors.Blanco,
    },
    row: {
      height: "100%",
      marginLeft: "0",
      marginRight: "0",
    },
    colLg6Text: {
      paddingLeft: "3rem",
      paddingRight: "3rem",
    },
    title: {
      textAlign: "center",
      marginTop: "1rem",
      color: Colors.Negro,
    },
    itemsContainer: {
      display: "flex",
      flexDirection: "column",
      width: "66.6667%",
      margin: "0 auto",
    },
    item: {
      paddingTop: "0.5rem",
      paddingBottom: "0.5rem",
      textAlign: "center",
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      color: Colors.Negro,
    },
    icon: {
      fontSize: "2rem",
      marginBottom: "0.5rem",
      color: Colors.Negro,
    },
    imageContainer: {
      paddingLeft: "0",
      paddingRight: "0",
    },
    image: {
      height: "100%",
      width: "100%",
      objectFit: "cover",
    },
    text: {
      color: Colors.Negro,
    },
  };
  return (
    <div style={styles.comofunciona}>
      <div style={styles.row} className="row">
        <div style={styles.colLg6Text} className="col-lg-6">
          <h2 style={styles.title}>Cómo Funciona</h2>
          <p style={styles.text}>
            Realiza pedidos desde tu asiento y disfruta del evento mientras tu
            pedido se hace y llega hacia ti, sin filas ni frustaciones.
          </p>
          <div style={styles.itemsContainer}>
            <div style={styles.item}>
              <i style={styles.icon} className="circleicon bi bi-balloon"></i>
              <p style={styles.text}>Selecciona el evento en el que deseas realizar tu pedido</p>
            </div>

            <div style={styles.item}>
              <i style={styles.icon} className="circleicon bi bi-shop"></i>
              <p style={styles.text}>Selecciona el puesto al cual quieres hacer el pedido</p>
            </div>

            <div style={styles.item}>
              <i style={styles.icon} className="circleicon bi bi-cart"></i>
              <p style={styles.text}>Realiza la compra de tu pedido</p>
            </div>

            <div style={styles.item}>
              <i
                style={styles.icon}
                className="circleicon bi bi-signpost-split"
              ></i>
              <p style={styles.text}>
                Recibe el pedido en cualquier parte del evento
              </p>
            </div>
          </div>
        </div>
        <div style={styles.imageContainer} className="col-lg-6">
          <img src={img} alt="Comida Rápida Casera" style={styles.image} />
        </div>
      </div>
    </div>
  );
};

export default ComoFunciona;

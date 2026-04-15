import React from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./../sass/main.scss";
import img from "./../img/comida-rapida-casera.jpg";
import useDynamicColors from "../../UseDinamicColors";
import { FaCalendarAlt, FaStore, FaShoppingCart, FaMapMarkedAlt } from 'react-icons/fa'

const ComoFunciona = () => {
  const Colors = useDynamicColors();
  const styles = {
    comofunciona: {
      height: "100%",
      backgroundColor: Colors.GrisAzuladoOscuro,
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
              <span className="circleicon" style={styles.icon}><FaCalendarAlt /></span>
              <p style={styles.text}>Seleccioná el evento en el que deseas realizar tu pedido.</p>
            </div>

            <div style={styles.item}>
              <span className="circleicon" style={styles.icon}><FaStore /></span>
              <p style={styles.text}>Elegí el puesto de comida de tu preferencia.</p>
            </div>

            <div style={styles.item}>
              <span className="circleicon" style={styles.icon}><FaShoppingCart /></span>
              <p style={styles.text}>Realizá tu pedido de forma rápida y sencilla.</p>
            </div>

            <div style={styles.item}>
              <span className="circleicon" style={styles.icon}><FaMapMarkedAlt /></span>
              <p style={styles.text}>
                Recibilo en cualquier parte del evento, sin filas ni demoras.
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

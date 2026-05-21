import React from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./../sass/main.scss";
import img from "./../img/comida-rapida-casera.jpg";
import { FaCalendarAlt, FaStore, FaShoppingCart, FaMapMarkedAlt } from 'react-icons/fa'
import useBreakpoint from "../../useBreakpoint";

const ComoFunciona = () => {
  const { isMobile } = useBreakpoint();

  const styles = {
    comofunciona: {
      height: "100%",
      backgroundColor: "var(--qf-bg-main)",
    },
    row: {
      height: "100%",
      marginLeft: "0",
      marginRight: "0",
      flexDirection: isMobile ? "column-reverse" : "row",
    },
    colLg6Text: {
      paddingLeft: isMobile ? "1rem" : "3rem",
      paddingRight: isMobile ? "1rem" : "3rem",
    },
    title: {
      textAlign: "center",
      marginTop: "1rem",
      color: "var(--qf-text-white)",
    },
    itemsContainer: {
      display: "flex",
      flexDirection: "column",
      width: isMobile ? "100%" : "66.6667%",
      margin: "0 auto",
    },
    item: {
      paddingTop: "0.5rem",
      paddingBottom: "0.5rem",
      textAlign: "center",
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      color: "var(--qf-text-white)",
    },
    icon: {
      fontSize: "2rem",
      marginBottom: "0.5rem",
      color: "var(--qf-text-white)",
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
      color: "var(--qf-text-white)",
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

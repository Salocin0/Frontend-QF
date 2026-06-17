import React from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./../sass/main.scss";
import img from "./../img/comida-rapida-casera.jpg";
import { FaCalendarAlt, FaStore, FaShoppingCart, FaMapMarkedAlt } from 'react-icons/fa'
import useBreakpoint from "../../useBreakpoint";

const items = [
  { icon: <FaCalendarAlt />, text: "Seleccioná el evento en el que deseas realizar tu pedido." },
  { icon: <FaStore />, text: "Elegí el puesto de comida de tu preferencia." },
  { icon: <FaShoppingCart />, text: "Realizá tu pedido de forma rápida y sencilla." },
  { icon: <FaMapMarkedAlt />, text: "Recibilo en cualquier parte del evento, sin filas ni demoras." },
];

const ComoFunciona = () => {
  const { isMobile } = useBreakpoint();

  return (
    <div
      style={{
        backgroundColor: "var(--qf-bg-main)",
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
        minHeight: isMobile ? "auto" : "550px",
      }}
    >
      {/* Columna izquierda: título, texto e items */}
      <div
        style={{
          padding: isMobile ? "2.5rem 1.25rem" : "3rem 4rem",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            marginBottom: "1rem",
            color: "var(--qf-text-primary)",
            fontWeight: 700,
            fontSize: "2rem",
          }}
        >
          Cómo Funciona
        </h2>

        <p
          style={{
            color: "var(--qf-text-primary)",
            textAlign: "center",
            marginBottom: "2rem",
            fontSize: "1.05rem",
            lineHeight: 1.6,
          }}
        >
          Realiza pedidos desde tu asiento y disfruta del evento mientras tu
          pedido se hace y llega hacia ti, sin filas ni frustaciones.
        </p>

        <div style={{ width: "100%" }}>
          {items.map((item, idx) => (
            <div
              key={idx}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                padding: "0.6rem 0",
                color: "var(--qf-text-primary)",
              }}
            >
              <span
                className="circleicon"
                style={{
                  flexShrink: 0,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "60px",
                  height: "60px",
                  borderRadius: "50%",
                  backgroundColor: "#F7B813",
                  color: "#000",
                  fontSize: "1.4rem",
                }}
              >
                {item.icon}
              </span>
              <p
                style={{
                  margin: 0,
                  color: "var(--qf-text-primary)",
                  flex: 1,
                  fontSize: "0.95rem",
                  lineHeight: 1.5,
                }}
              >
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Columna derecha: imagen */}
      <div
        style={{
          overflow: "hidden",
        }}
      >
        <img
          src={img}
          alt="Comida Rápida Casera"
          style={{
            width: "100%",
            height: isMobile ? "280px" : "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
      </div>
    </div>
  );
};

export default ComoFunciona;

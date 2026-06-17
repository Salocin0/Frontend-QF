import React, { useRef, useState, useEffect } from "react";
import imgDefault from "./../img/puestoLogoDefault.jpg";
import { useNavigate } from "react-router-dom";

const PuestoUser = ({ carrito, selectedDay, evento }) => {
  const navigate = useNavigate();
  const cardRef = useRef(null);
  const [cardWidth, setCardWidth] = useState(0);
  const isNarrow = cardWidth < 600;

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      setCardWidth(entry.contentRect.width);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  const handleClick = () => {
    navigate(`/productos-puesto/${carrito?.id}`, {
      state: { selectedDay, evento },
    });
  };

  const styles = {
    cardLink: {
      textDecoration: "none",
    },
    card: {
      border: `1px solid var(--qf-naranja)`,
      borderRadius: "10px",
      width: "98%",
      backgroundColor: "var(--qf-bg-secondary)",
      marginBottom: "16px",
      margin: "0 auto 16px auto",
      color: "var(--qf-text-primary)",
      transition: "transform 0.2s ease-in-out",
      cursor: "pointer",
      display: "flex",
      flexDirection: isNarrow ? "column" : "row",
      alignItems: isNarrow ? "stretch" : "center",
      paddingTop: "12px",
      paddingBottom: "12px",
      paddingLeft: "16px",
      paddingRight: "16px",
      gap: isNarrow ? "12px" : "0",
    },
    cardBody: {
      display: "flex",
      flexDirection: "row",
      gap: "20px",
      alignItems: "center",
      cursor: "pointer",
    },
    imageContainer: {
      width: isNarrow ? "100%" : "140px",
      minWidth: isNarrow ? "auto" : "140px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "0",
      backgroundColor: "transparent",
    },
    img: {
      width: "100%",
      maxWidth: isNarrow ? "200px" : "150px",
      height: isNarrow ? "120px" : "auto",
      objectFit: "cover",
      borderRadius: "8px",
      marginLeft: "0",
      marginRight: isNarrow ? "0" : "16px",
      boxShadow: "none",
      display: "block",
    },
    content: {
      flexGrow: 1,
      position: "relative",
      justifyContent: "start",
      alignItems: "start",
      display: "flex",
      flexDirection: "column",
      marginLeft: "0",
    },
    title: {
      fontSize: "24px",
      fontWeight: "bold",
      color: "var(--qf-naranja)",
      marginBottom: "10px",
    },
    descripcion: {
      fontSize: "18px",
      color: "var(--qf-text-primary)",
      marginBottom: "10px",
    },
    text: {
      fontSize: "16px",
      color: "var(--qf-text-muted)",
      marginBottom: "5px",
    },
    estadoContainer: {
      display: "flex",
      position: "absolute",
      top: "10px",
      right: "10px",
      width: "100px",
    },
  };

  return (
    <div onClick={() => handleClick()} style={styles.cardLink}>
      <div ref={cardRef} style={styles.card}>
        <div style={styles.imageContainer}>
          <img
            src={carrito?.img || imgDefault}
            style={styles.img}
            alt="Thumbnail"
          />
        </div>
        <div style={styles.content}>
          <p style={styles.title}>{carrito.nombreCarro}</p>
          <p style={styles.descripcion}>{carrito.tipoNegocio}</p>
        </div>
      </div>
    </div>
  );
};

export default PuestoUser;

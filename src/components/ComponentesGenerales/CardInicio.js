import { Link } from "react-router-dom";

const CardInicio = ({ data }) => {
  const styles = {
    card: {
      display: "flex",
      flexDirection: "column",
      alignItems: "stretch",
      justifyContent: "flex-start",
      textDecoration: "none",
      color: "black",
      backgroundColor: "var(--qf-naranja)",
      border: "1px solid white",
      borderRadius: "10px",
      boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
      transition: "transform 0.3s, boxShadow 0.3s",
      cursor: "pointer",
      height: "100%",
      minHeight: "180px",
      width: "100%",
      overflow: "hidden",
    },
    link: {
      textDecoration: "none",
      color: "inherit",
      display: "flex",
      flexDirection: "column",
      height: "100%",
      width: "100%",
    },
    imagen: {
      width: "100%",
      flex: 1, // la imagen toma todo el alto disponible
      minHeight: 0, // permite que flex funcione con overflow
      objectFit: "cover",
      display: "block",
    },
    textContainer: {
      flexShrink: 0, // el texto mantiene su tamaño
      padding: "0 8px 8px 8px",
    },
    title: {
      fontSize: "1.5rem",
      margin: "10px 0",
      textAlign: "center",
      color: "black",
    },
    subtitle: {
      textAlign: "center",
      fontStyle: "italic",
      color: "black",
      fontSize: "1rem",
    },
  };

  const { to, imgSrc, title, subtitle } = data;

  const cardContent = (
    <div style={styles.card}>
      <img src={imgSrc} alt={title} style={styles.imagen} />
      <div style={styles.textContainer}>
        <h2 style={styles.title}>{title}</h2>
        <p style={styles.subtitle}>{subtitle}</p>
      </div>
    </div>
  );

  return (
    <div style={styles.card}>
      {to ? (
        <Link to={to} style={styles.link}>
          {cardContent}
        </Link>
      ) : (
        cardContent
      )}
    </div>
  );
};

export default CardInicio;

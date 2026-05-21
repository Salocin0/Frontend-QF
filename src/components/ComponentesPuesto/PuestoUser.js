import imgDefault from "./../img/puestoLogoDefault.jpg";
import { useNavigate } from "react-router-dom";
import { useEffect,useState } from "react";
import { FaClock, FaStar } from "react-icons/fa";

const PuestoUser = ({ carrito, selectedDay, evento }) => {
  const navigate = useNavigate();
  const [estrellas, setEstrellas] = useState(0);
  const [tiempoEntrega, setTiempoEntrega] = useState(0);
  const handleClick = () => {
    navigate(`/productos-puesto/${carrito?.id}`, {
      state: { selectedDay, evento },
    });
  };

  useEffect(() => {
    fetch(`${process.env?.REACT_APP_BACK_URL}puesto/getEstadisticas/${carrito.id}`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data.data)
        setEstrellas(data.data.estrellas);
        setTiempoEntrega(data.data.tiempo);
      })
      .catch((error) => console.log("error al obtener estadisticas."));
  }, [carrito]);

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
      color: "var(--qf-text-white)",
      transition: "transform 0.2s ease-in-out",
      cursor: "pointer",
      display: "flex",
      flexDirection: "row",
      paddingTop: "12px",
      paddingBottom: "12px",
      paddingLeft: "16px",
      paddingRight: "16px",
    },
    cardBody: {
      display: "flex",
      flexDirection: "row",
      gap: "20px",
      alignItems: "center",
      cursor: "pointer",
    },
    imageContainer: {
      width: "140px",
      minWidth: "140px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "0",
      backgroundColor: "transparent",
    },
    img: {
      width: "100%",
      maxWidth: "150px",
      borderRadius: "8px",
      marginLeft: "0",
      marginRight: "16px",
      objectFit: "cover",
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
      color: "var(--qf-text-white)",
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
    iconText: {
      fontSize: "16px",
      color: "var(--qf-text-white)",
    },
  };

  return (
    <div onClick={() => handleClick()} style={styles.cardLink}>
      <div style={styles.card}>
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
          <div style={styles.iconWrapper}>
            <FaClock />
            <span style={styles.iconText}>
              {tiempoEntrega || " 30"} {"Min"}
            </span>
          </div>
          <div style={styles.iconWrapper}>
            <FaStar />
            <span style={styles.iconText}>{estrellas || " 4.5"}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PuestoUser;

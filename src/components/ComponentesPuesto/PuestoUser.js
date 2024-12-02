import imgDefault from "./../img/puestoLogoDefault.jpg";
import useDynamicColors from "../../UseDinamicColors";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faStar } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const PuestoUser = ({ carrito, selectedDay,evento }) => {
  const Color = useDynamicColors();
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`/productos-puesto/${carrito?.id}`, { state: { selectedDay,evento } });
  };
  const styles = {
    cardLink: {
      textDecoration: "none",
    },
    card: {
      border: `1px solid ${Color.Naranja}`,
      borderRadius: "10px",
      width: "85%",
      backgroundColor: Color.GrisAzuladoClaro,
      marginBottom: "20px",
      color: Color.Negro,
      transition: "transform 0.2s ease-in-out",
      cursor: "pointer",
      display: "flex",
      flexDirection: "row",
      paddingTop: "20px",
      paddingBottom: "20px",
    },
    cardBody: {
      display: "flex",
      flexDirection: "row",
      gap: "20px",
      alignItems: "center",
      cursor: "pointer",
    },
    img: {
      width: "100%",
      maxWidth: "150px",
      borderRadius: "8px",
      marginLeft: "40px",
      objectFit: "cover",
    },
    content: {
      flexGrow: 1,
      position: "relative",
      justifyContent: "start",
      alignItems: "start",
      display: "flex",
      flexDirection: "column",
      marginLeft: "40px",
    },
    title: {
      fontSize: "24px",
      fontWeight: "bold",
      color: Color.Naranja,
      marginBottom: "10px",
    },
    descripcion: {
      fontSize: "18px",
      color: Color.Negro,
      marginBottom: "10px",
    },
    text: {
      fontSize: "16px",
      color: Color.Gris,
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
      color: Color.Negro,
    },
  };

  return (
    <div onClick={() => handleClick()} style={styles.cardLink}>
      <div style={styles.card}>
        <img
          src={carrito?.img || imgDefault}
          style={styles.img}
          alt="Thumbnail"
        />
        <div style={styles.content}>
          <p style={styles.title}>{carrito.nombreCarro}</p>
          <p style={styles.descripcion}>{carrito.tipoNegocio}</p>
          <div style={styles.iconWrapper}>
            <FontAwesomeIcon icon={faClock} />
            <span style={styles.iconText}>
              {carrito?.tiempoEntrega || " 30 min"}
            </span>
          </div>
          <div style={styles.iconWrapper}>
            <FontAwesomeIcon icon={faStar} />
            <span style={styles.iconText}>{carrito?.estrellas || " 4.5"}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PuestoUser;

import imgDefault from "./../img/puestoLogoDefault.jpg";
import useDynamicColors from "../../UseDinamicColors";
import { useNavigate } from "react-router-dom";
import { useEffect,useState } from "react";

const ICON = "ICON";

const PuestoUser = ({ carrito, selectedDay, evento }) => {
  const Color = useDynamicColors();
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
            <span>{ICON}</span>
            <span style={styles.iconText}>
              {tiempoEntrega || " 30"} {"Min"}
            </span>
          </div>
          <div style={styles.iconWrapper}>
            <span>{ICON}</span>
            <span style={styles.iconText}>{estrellas || " 4.5"}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PuestoUser;

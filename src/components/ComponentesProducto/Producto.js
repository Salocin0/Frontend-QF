import { default as React, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useContext } from "react";
import { UserContext } from "../ComponentesGenerales/UserContext";
import imgDefault from "../img/productoDefecto.png";
import useDynamicColors from "../../UseDinamicColors";
const Producto = ({ producto, idpuesto, recargar }) => {
  const { user } = useContext(UserContext);
  const Colors = useDynamicColors();
  const handleDelete = () => {
    const headers = new Headers();
    headers.append("ConsumidorId", user.consumidorId);

    fetch(`${process.env?.REACT_APP_BACK_URL}producto/${producto.id}`, {
      method: "DELETE",
      headers: headers,
    })
      .then((response) => {
        if (response.ok) {
          toast.success("Producto deshabilitado correctamente");
          recargar();
        } else {
          response.json().then((errorData) => {
            const errorMessage = errorData.message || "Ha ocurrido un error";
            toast.error(errorMessage);
          });
        }
      })
      .catch((error) => console.error("Error:", error));
  };

  useEffect(() => {}, []);

  const styles = {
    cardLink: {
      display: "flex",
      flexDirection: "column",
      width: "100%",
      margin: "0 auto",
      marginBottom: "10px",
      height: "100%",
    },
    card: {
      boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
      borderRadius: "8px",
      overflow: "hidden",
      backgroundColor: Colors.GrisAzuladoClaro,
      width: "100%",
    },
    cardImgTop: {
      width: "100%",
      height: "250px",
      overflow: "hidden",
      resizeMode: "cover",
      backgroundColor: Colors.BlancoEnBlanco,
      objectFit: "cover",
    },    
    cardBody: {
      padding: "16px",
      display: "flex",
      flexDirection: "column",
    },
    cardTitle: {
      fontSize: "1.25rem",
      fontWeight: "bold",
      textAlign: "center",
      marginBottom: "8px",
      color: Colors.Naranja,
    },
    cardText: {
      fontSize: "1rem",
      textAlign: "center",
      marginBottom: "8px",
      height: "100px",
      overflow: "hidden",
      textOverflow: "ellipsis",
      color: Colors.BlancoEnBlanco,
    },
    priceRow: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    },
    priceText: {
      fontSize: "1.5rem",
      fontWeight: "bold",
      color: Colors.Naranja,
    },
    actionsContainer: {
      display: "flex",
      justifyContent: "space-between",
      marginTop: "10px",
    },
    actionButton: {
      flex: "1 1 0",
      padding: "0.4rem 0.8rem",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      fontWeight: "bold",
      fontSize: "0.9rem",
      color: Colors.BlancoEnBlanco,
    },
  };

  return (
    <div style={styles.cardLink}>
      <div style={styles.card}>
        <img
          src={producto?.img || imgDefault}
          alt="Thumbnail"
          style={styles.cardImgTop}
        />
        <div style={styles.cardBody}>
          <h6 style={styles.cardTitle}>{producto?.nombre}</h6>
          <p style={styles.cardText}>{producto?.descripcion}</p>

          <div style={styles.priceRow}>
            <h4 style={styles.priceText}>$ {producto?.precio}</h4>
          </div>
          <div style={styles.actionsContainer}>
            <Link
              to={`/producto/${producto?.id}`}
              style={{
                ...styles.actionButton,
                backgroundColor: Colors.Azul,
                marginRight: "5px",
                textAlign: "center",
                textDecoration: "none",
              }}
            >
              Actualizar
            </Link>
            <button
              onClick={handleDelete}
              style={{
                ...styles.actionButton,
                backgroundColor: Colors.Rojo,
                marginLeft: "5px",
              }}
            >
              Deshabilitar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Producto;

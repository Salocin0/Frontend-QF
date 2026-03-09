import { default as React, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useContext } from "react";
import { UserContext } from "../ComponentesGenerales/UserContext";
import imgDefault from "../img/productoDefecto.png";
import useDynamicColors from "../../UseDinamicColors";
const Producto = ({
  producto,
  idpuesto,
  recargar,
  isDisabled = false,
  onEnable,
}) => {
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

  const habilitarNuevamente = () => {
    if (onEnable) {
      onEnable();
    } else {
      fetch(`${process.env?.REACT_APP_BACK_URL}producto/${producto.id}/habilitar`, {
        method: "PUT",
      })
        .then((response) => response.json())
        .then(() => {
          toast.success("Producto habilitado nuevamente con éxito");
          recargar();
        })
        .catch(() => toast.error("Error al habilitar el producto"));
    }
  };

  useEffect(() => {}, []);

  const styles = {
    cardLink: {
      display: "flex",
      flexDirection: "row",
      width: "100%",
      margin: "0 auto",
      marginBottom: "10px",
      height: "auto",
    },
    card: {
      boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
      borderRadius: "8px",
      overflow: "hidden",
      backgroundColor: Colors.GrisAzuladoClaro,
      display: "flex",
      width: "100%",
      /* height auto to fit content */
    },
    cardImgTop: {
      width: "30%",
      height: "100%",
      overflow: "hidden",
      resizeMode: "cover",
      backgroundColor: Colors.BlancoEnBlanco,
      objectFit: "cover",
    },    
    cardBody: {
      padding: "16px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      width: "70%",
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
      /* allow more space for description if needed */
      height: "auto",
      overflow: "visible",
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
    enableButton: {
      backgroundColor: Colors.Verde,
    },
    primaryButton: {
      backgroundColor: Colors.Azul,
    },
    dangerButton: {
      backgroundColor: Colors.Rojo,
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
            {isDisabled ? (
              <>
                <Link
                  to={`/producto/${producto?.id}`}
                  style={{
                    ...styles.actionButton,
                    ...styles.primaryButton,
                    marginRight: "5px",
                    textAlign: "center",
                    textDecoration: "none",
                  }}
                >
                  Editar
                </Link>
                <button
                  onClick={habilitarNuevamente}
                  style={{
                    ...styles.actionButton,
                    ...styles.enableButton,
                    marginLeft: "5px",
                  }}
                >
                  Habilitar
                </button>
              </>
            ) : (
              <>
                <Link
                  to={`/producto/${producto?.id}`}
                  style={{
                    ...styles.actionButton,
                    ...styles.primaryButton,
                    marginRight: "5px",
                    textAlign: "center",
                    textDecoration: "none",
                  }}
                >
                  Editar
                </Link>
                <button
                  onClick={handleDelete}
                  style={{
                    ...styles.actionButton,
                    ...styles.dangerButton,
                    marginLeft: "5px",
                  }}
                >
                  Deshabilitar
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Producto;

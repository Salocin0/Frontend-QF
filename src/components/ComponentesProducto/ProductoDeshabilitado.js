import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import imgDefault from "../img/productoDefecto.png";

const ProductoDeshabilitado = ({ producto, idpuesto, recargar }) => {

  const habilitarNuevamente = () => {
    fetch(`${process.env?.REACT_APP_BACK_URL}producto/${producto.id}/habilitar`, {
      method: "PUT",
    })
      .then((response) => response.json())
      .then(() => {
        toast.success("Producto habilitado nuevamente con éxito");
        recargar();
      })
      .catch(() => toast.error("Error al habilitar el producto"));
  };

  const eliminarPermanente = () => {
    fetch(`${process.env?.REACT_APP_BACK_URL}producto/${producto.id}/permanently`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then(() => {
        toast.success("Producto eliminado permanentemente");
        recargar();
      })
      .catch(() => toast.error("Error al eliminar permanentemente el producto"));
  };

  useEffect(() => {}, []);

  const styles = {
    cardLink: {
      display: "flex",
      flexDirection: "row",
      width: "100%",
      margin: "0 auto",
      marginBottom: "20px",
      height: "150px",
    },
    card: {
      boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
      borderRadius: "8px",
      overflow: "hidden",
      backgroundColor: "var(--qf-bg-secondary)",
      display: "flex",
      width: "100%",
      height: "100%",
    },
    cardImgTop: {
      width: "30%",
      height: "100%",
      overflow: "hidden",
      resizeMode: "cover",
      backgroundColor: "var(--qf-blanco-puro)",
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
      color: "var(--qf-naranja)",
    },
    cardText: {
      fontSize: "1rem",
      textAlign: "center",
      marginBottom: "8px",
      height: "100px",
      overflow: "hidden",
      textOverflow: "ellipsis",
      color: "var(--qf-blanco-puro)",
    },
    priceRow: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    },
    priceText: {
      fontSize: "1.5rem",
      fontWeight: "bold",
      color: "var(--qf-naranja)",
    },
    actionsContainer: {
      display: "flex",
      justifyContent: "flex-end",
      gap: "5px",
    },
    actionButton: {
      padding: "0.4rem 0.8rem",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      fontWeight: "bold",
      fontSize: "0.9rem",
      color: "var(--qf-blanco-puro)",
    },
    editButton: {
      backgroundColor: "var(--qf-blue)",
      marginRight: "5px",
    },
    enableButton: {
      backgroundColor: "var(--qf-green)",
      marginLeft: "5px",
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
            <div style={styles.actionsContainer}>
              <Link
                to={`/producto/${producto?.id}`}
                style={{
                  ...styles.actionButton,
                  ...styles.editButton,
                  textDecoration: "none",
                  textAlign: "center",
                }}
              >
                Editar
              </Link>
              <button
                onClick={habilitarNuevamente}
                style={{
                  ...styles.actionButton,
                  ...styles.enableButton,
                }}
              >
                Habilitar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductoDeshabilitado;

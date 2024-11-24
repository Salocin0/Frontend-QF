import React, { useEffect } from "react";
import { Dropdown } from "react-bootstrap";
import { toast } from "react-toastify";
import imgDefault from "../img/productoDefecto.png";
import useDynamicColors from "../../UseDinamicColors";

const ProductoDeshabilitado = ({ producto, idpuesto, recargar }) => {
  const Colors = useDynamicColors();

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
      flexDirection: "column",
      width: "100%",
      margin: "0 auto",
      marginBottom: "20px",
    },
    card: {
      boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
      borderRadius: "8px",
      overflow: "hidden",
      backgroundColor: Colors.GrisAzuladoClaro,
      maxWidth: "300px",
      width: "100%",
    },
    cardImgTop: {
      height: "auto",
      objectFit: "cover",
      width: "100%",
      backgroundColor: Colors.BlancoEnBlanco,
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
    dropdownContainer: {
      display: "flex",
      justifyContent: "flex-end",
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
            <div style={styles.dropdownContainer}>
              <Dropdown>
                <Dropdown.Toggle variant="danger" />
                <Dropdown.Menu>
                  <Dropdown.Item onClick={habilitarNuevamente}>
                    Habilitar Producto Nuevamente
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={eliminarPermanente}>
                    Eliminar Producto Definitivamente
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductoDeshabilitado;

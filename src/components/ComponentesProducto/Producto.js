import { default as React, useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useContext } from "react";
import { UserContext } from "../ComponentesGenerales/UserContext";
import ConfirmDialog from "../ComponentesGenerales/ConfirmDialog";
import imgDefault from "../img/productoDefecto.png";
const Producto = ({
  producto,
  idpuesto,
  recargar,
  isDisabled = false,
  onEnable,
}) => {
  const { user } = useContext(UserContext);
  const [showConfirm, setShowConfirm] = useState(false);
  const cardRef = useRef(null);
  const [cardWidth, setCardWidth] = useState(0);
  const isNarrow = cardWidth > 0 && cardWidth < 400;

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      setCardWidth(entry.contentRect.width);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

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
      marginBottom: "10px",
      height: "auto",
    },
    card: {
      boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
      borderRadius: "8px",
      overflow: "hidden",
      backgroundColor: "var(--qf-bg-secondary)",
      display: "flex",
      flexDirection: isNarrow ? "column" : "row",
      width: "100%",
    },
    cardImgTop: {
      width: isNarrow ? "100%" : "30%",
      height: isNarrow ? "180px" : "100%",
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
      width: isNarrow ? "100%" : "70%",
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
      /* allow more space for description if needed */
      height: "auto",
      overflow: "visible",
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
      color: "var(--qf-blanco-puro)",
    },
    enableButton: {
      backgroundColor: "var(--qf-green)",
    },
    primaryButton: {
      backgroundColor: "var(--qf-blue)",
    },
    dangerButton: {
      backgroundColor: "var(--qf-rojo)",
    },
  };

  return (
    <div style={styles.cardLink}>
      <div ref={cardRef} style={styles.card}>
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
                  onClick={() => setShowConfirm(true)}
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
          <ConfirmDialog
            open={showConfirm}
            title="Deshabilitar Producto"
            message={`¿Estás seguro de que querés deshabilitar el producto "${producto?.nombre}"?`}
            onConfirm={() => {
              setShowConfirm(false);
              handleDelete();
            }}
            onCancel={() => setShowConfirm(false)}
          />
        </div>
      </div>
    </div>
  );
};

export default Producto;

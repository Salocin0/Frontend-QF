import { default as React } from "react";
import { toast } from "react-toastify";
import productoDefecto from "./../img/productoDefecto.png";

const ProductoUser = ({ producto, user, selectedDay, evento }) => {
  const [isHovered, setIsHovered] = React.useState(false);

  const handleAddtocart = () => {
    const headers = new Headers();
    headers.append("ConsumidorId", user.consumidorId);
    headers.append("Content-Type", "application/json");

    fetch(
      `${process.env?.REACT_APP_BACK_URL}carrito/addToCart/${producto.id}`,
      {
        method: "PUT",
        headers: headers,
        body: JSON.stringify({ fecha: selectedDay,eventoId:evento.id }),
      }
    )
      .then((response) => {
        if (response.ok) {
          toast.success("Se agregó un producto al carrito: " + producto.nombre);
        } else {
          toast.error("Error al agregar producto al carrito");
        }
      })
      .catch((error) => console.error("Error:", error));
  };

  const styles = {
    cardContainer: {
      boxShadow: isHovered ? "0px 8px 15px rgba(0, 0, 0, 0.3)" : "0px 4px 6px rgba(0, 0, 0, 0.1)",
      borderRadius: "12px",
      width: "98%",
      minHeight: "120px",
      overflow: "hidden",
      backgroundColor: "var(--qf-bg-secondary)",
      margin: "0 auto 14px auto",
      border: `1px solid var(--qf-naranja)`,
      transition: "all 0.25s ease",
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      cursor: "default",
      transform: isHovered ? "translateY(-2px)" : "none",
      paddingLeft: "16px",
      paddingRight: "16px",
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
    image: {
      width: "100%",
      height: "90px",
      objectFit: "cover",
      borderRadius: "8px",
      boxShadow: "none",
      display: "block",
    },
    cardBody: {
      flex: 1,
      padding: "10px 18px",
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },

    infoSection: {
      display: "flex",
      flexDirection: "column",
      gap: "5px",
    },
    title: {
      fontSize: "18px",
      fontWeight: "700",
      margin: 0,
      color: "var(--qf-text-primary)",
      letterSpacing: "0.3px",
    },
    description: {
      fontSize: "13px",
      color: "var(--qf-text-primary)",
      opacity: 0.8,
      margin: "0",
      lineHeight: "1.2",
      display: "-webkit-box",
      WebkitLineClamp: "1",
      WebkitBoxOrient: "vertical",
      overflow: "hidden",
    },
    aderezos: {
      fontSize: "12px",
      color: "var(--qf-naranja)",
      fontWeight: "600",
      fontStyle: "italic",
      margin: "0",
    },
    actionSection: {
      display: "flex",
      justifyContent: "flex-end",
      alignItems: "center",
      gap: "14px",
      marginTop: "0",
    },
    button: {
      backgroundColor: "var(--qf-green)",
      border: "none",
      color: "var(--qf-text-white)",
      padding: "10px 25px",
      borderRadius: "8px",
      cursor: "pointer",
      fontWeight: "bold",
      fontSize: "15px",
      transition: "all 0.2s ease",
      boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
      marginLeft: "8px",
    },
    price: {
      fontSize: "28px",
      fontWeight: "bold",
      color: "var(--qf-text-primary)",
      margin: 0,
    },
    priceSymbol: {
      fontSize: "18px",
      marginRight: "4px",
      color: "var(--qf-naranja)",
    },
  };

  return (
    <div 
      style={styles.cardContainer}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={styles.imageContainer}>
        <img
          src={producto?.img || productoDefecto}
          alt={producto?.nombre}
          style={styles.image}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = productoDefecto;
          }}
        />
      </div>
      <div style={styles.cardBody}>
        <div style={styles.infoSection}>
          <h2 style={styles.title}>{producto?.nombre}</h2>
          <p style={styles.description}>{producto?.descripcion}</p>
          {producto?.aderezos && (
            <p style={styles.aderezos}>Aderezos: {producto.aderezos}</p>
          )}
        </div>
        
        <div style={styles.actionSection}>
          <div>
            <p style={styles.price}>
              <span style={styles.priceSymbol}>$</span>
              {producto?.precio}
            </p>
          </div>
          <button 
            style={{
              ...styles.button,
              transform: isHovered ? "scale(1.05)" : "scale(1)",
              backgroundColor: isHovered ? "#38a169" : "var(--qf-green)" // Ajuste ligero de color en hover
            }} 
            onClick={handleAddtocart}
          >
            Agregar al carrito
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductoUser;

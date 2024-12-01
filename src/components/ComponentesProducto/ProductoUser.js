import { default as React } from "react";
import { toast } from "react-toastify";
import productoDefecto from "./../img/productoDefecto.png";
import useDynamicColors from "../../UseDinamicColors";

const ProductoUser = ({ producto, user, selectedDay }) => {
  const Colors = useDynamicColors();
  const handleAddtocart = () => {
    const headers = new Headers();
    headers.append("ConsumidorId", user.consumidorId);
    headers.append("Content-Type", "application/json");

    fetch(
      `${process.env?.REACT_APP_BACK_URL}carrito/addToCart/${producto.id}`,
      {
        method: "PUT",
        headers: headers,
        body: JSON.stringify({ fecha: selectedDay }),
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
      boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
      borderRadius: "10px",
      width: "75%",
      overflow: "hidden",
      backgroundColor: Colors.GrisAzuladoClaro,
      marginBottom: "20px",
      marginLeft: "30px",
      border: `1px solid ${Colors.Naranja}`,
    },
    image: {
      width: "150px",
      height: "140px",
      objectFit: "cover",
      borderRadius: "10px",
      backgroundColor: Colors.BlancoEnBlanco,
      display: "flex",
      margin: "auto 0",
      marginLeft: "45px",
    },
    cardBody: {
      width: "100%",
      padding: "15px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
    },
    title: {
      fontSize: "24px",
      fontWeight: "bold",
      textAlign: "center",
      marginBottom: "10px",
      color: Colors.Negro,
    },
    description: {
      fontSize: "18px",
      textAlign: "center",
      overflow: "hidden",
      color: Colors.Negro,
    },
    priceAndButtonContainer: {
      display: "flex",
      justifyContent: "center",
      alingItems: "center",
    },
    containerbtn:{
      display: "flex",
      justifyContent: "center",
      alingItems: "center",
      flexDirection: "column",
    },
    price: {
      fontSize: "24px",
      fontWeight: "bold",
      color: Colors.Negro,
      display: "flex",
      marginTop: "auto",
      marginBottom: "20px",
    },
    button: {
      backgroundColor: Colors.Verde,
      border: "none",
      color: Colors.Negro,
      padding: "10px 20px",
      borderRadius: "10px",
      cursor: "pointer",
    },
    buttonIcon: {
      fontSize: "20px",
    },
    card: {
      display: "flex",
      flexDirection: "row",
    },
  };
  console.log(producto);
  return (
    <div style={styles.cardContainer}>
      <div style={styles.card}>
        <img
          src={producto?.img || productoDefecto}
          alt="Thumbnail"
          style={styles.image}
        />
        <div style={styles.cardBody}>
          <div>
            <h6 style={styles.title}>{producto?.nombre}</h6>
          </div>
          <div>
            <p style={styles.description}>{producto?.descripcion}</p>
          </div>
          <div style={styles.containerbtn}>
            <div style={styles.priceAndButtonContainer}>
              <h4 style={styles.price}>$ {producto?.precio}</h4>
            </div>
            <div style={styles.priceAndButtonContainer}>
              <button style={styles.button} onClick={handleAddtocart}>
                Agregar a carrito
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductoUser;

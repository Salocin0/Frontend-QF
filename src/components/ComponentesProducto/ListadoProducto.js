import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Footer from "../ComponentesGenerales/Footer";
import Sidebar from "../ComponentesGenerales/Sidebar";
import Producto from "./Producto";
import { UserContext } from "../ComponentesGenerales/UserContext";
import { useContext } from "react";
import useDynamicColors from "../../UseDinamicColors";
import { useLocation } from "react-router-dom";

const ListadoProducto = ( ) => {
  const { id } = useParams();
  const { user } = useContext(UserContext);
  const [productos, setProductos] = useState([]);
  const [recargar, setRecargar] = useState(0);
  const Colors = useDynamicColors();
  const location = useLocation();
  const carrito = location.state; 
  console.log(carrito)

  const recargarComponente = () => {
    setRecargar((prev) => prev + 1);
  };

  useEffect(() => {
    if (user) {
      const headers = new Headers();
      headers.append("ConsumidorId", user.consumidorId);
      headers.append("puestoId", id);

      fetch(`${process.env?.REACT_APP_BACK_URL}producto`, {
        method: "GET",
        headers: headers,
      })
        .then((response) => response.json())
        .then((data) => setProductos(data.data))
        .catch((error) => console.log("No existen carritos.", error));
    }
  }, [user, recargar]);

  const styles = {
    mainContainer: {
      display: "flex",
      flexDirection: "column",
      backgroundColor: Colors.GrisAzuladoOscuro,
      minHeight: "100vh",
    },
    header: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: "1rem",
      color: Colors.Naranja,
      marginLeft: "20%",
      width: "80%",
    },
    pageTitle: {
      paddingTop: "1rem",
      color: Colors.Naranja,
    },
    disabledLink: {
      position: "absolute",
      top: "25px",
      right: "20px",
      backgroundColor: Colors.GrisOscuro,
      padding: "10px",
      borderRadius: "10px",
      color: Colors.BlancoEnBlanco,
      fontWeight: "bold",
      cursor: "pointer",
    },
    divider: {
      color: Colors.Naranja,
      marginRight: "1rem",
    },
    addButtonContainer: {
      position: "fixed",
      bottom: "80px",
      right: "20px",
      zIndex: 10,
    },
    addButton: {
      backgroundColor: Colors.Verde,
      color: Colors.BlancoEnBlanco,
      fontSize: "1.25rem",
      textDecoration: "none",
      padding: "10px 15px",
      borderRadius: "10px",
      cursor: "pointer",
    },
    contentContainer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      paddingTop: "1rem",
      width: "80%",
      marginLeft: "20%",
      paddingBottom: "50px"
    },
    gridContainer: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
      gap: "1rem",
      width: "80%",
      margin:"0 auto",
    },
    noProductsMessage: {
      fontSize: "1.5rem",
      color: Colors.Naranja,
    },
  };

  return (
    <div>
      <div style={styles.mainContainer}>
        <Sidebar tipoUsuario={user?.tipoUsuario} />
        <div>
          <div style={styles.header}>
            <h1 style={styles.pageTitle}>{carrito?.nombreCarro?"Productos de " + carrito?.nombreCarro:"Productos"}</h1>
            <Link
              to={`/listado-productos-deshabilitados/${id}`}
              style={styles.disabledLink}
            >
              Productos Deshabilitados
            </Link>
          </div>
          <hr style={styles.divider} />
          <div style={styles.addButtonContainer}>
            <Link to={`/registrar-productos/${id}`} style={styles.addButton}>
              <i className="bi bi-plus-lg"></i> Agregar Producto
            </Link>
          </div>
          <div style={styles.contentContainer}>
            {Array.isArray(productos) && productos.length > 0 ? (
              <div style={styles.gridContainer}>
                {productos.map((producto, index) => (
                  <Producto
                    key={index}
                    producto={producto}
                    idpuesto={id}
                    recargar={recargarComponente}
                  />
                ))}
              </div>
            ) : (
              <h2 style={styles.noProductsMessage}>
                No tienes ningún producto asociado a este carrito.
              </h2>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ListadoProducto;

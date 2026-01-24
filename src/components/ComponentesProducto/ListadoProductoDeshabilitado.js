import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Footer from "../ComponentesGenerales/Footer";
import Sidebar from "../ComponentesGenerales/Sidebar";
import ProductoDeshabilitado from "./ProductoDeshabilitado";
import { useContext } from "react";
import { UserContext } from "../ComponentesGenerales/UserContext";
import useDynamicColors from "../../UseDinamicColors";
import Breadcrumb from "../ComponentesGenerales/Breadcrumb";

const ListadoProductoDeshabilitado = ({ carrito }) => {
  const { user } = useContext(UserContext);
  const { id } = useParams();
  const [productos, setProductos] = useState([]);
  const [recargar, setRecargar] = useState(0);
  const Colors = useDynamicColors();

  const recargarComponente = () => {
    setRecargar((prev) => prev + 1);
  };

  useEffect(() => {
    if (user) {
      const headers = new Headers();
      headers.append("ConsumidorId", user.consumidorId);
      headers.append("puestoId", id);

      fetch(`${process.env?.REACT_APP_BACK_URL}producto/${id}/deshabilitados`, {
        method: "GET",
        headers: headers,
      })
        .then((response) => response.json())
        .then((data) => setProductos(data.data))
        .catch((error) => console.log("No existen carritos.", error));
    }
  }, [user, recargar, id]);

  const styles = {
    container: {
      height: "100vh",
      backgroundColor: Colors.GrisAzuladoOscuro,
      width: "100%",
    },
    contentColumn: {
      marginLeft: "20%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    header: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
      padding: "20px",
    },
    title: {
      color: Colors.Naranja,
      fontWeight: "bold",
      textAlign: "center",
    },
    divider: {
      borderColor: Colors.Naranja,
      width: "100%",
      margin: "10px 0",
    },
    gridContainer: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
      gap: "1rem",
      width: "Calc(100% - 40px)",
    },
    noProductsMessage: {
      fontSize: "1.5rem",
      color: Colors.Naranja,
      textAlign: "center",
    },
    backLink: {
      color: Colors.BlancoEnBlanco,
      position: "absolute",
      right: "20px",
      backgroundColor: Colors.Naranja,
      padding: "10px",
      borderRadius: "10px",
      fontWeight: "bold",
      cursor: "pointer",
    },
    breadcrumbWrapper: {
      width: "Calc(100%)",
      paddingTop: "10px",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    },
  };

  const breadcrumbItems = [
    { title: "Inicio", url: "/inicio" },
    { title: "Mis Puestos", url: "/listado-puestos-encargado" },
    { title: "Mis Productos", url: `/listado-productos/${id}` },
    { title: "Mis Productos Deshabilitados", url: `/listado-productos-deshabilitados/${id}` },
  ];

  return (
    <div style={styles.container}>
      <Sidebar tipoUsuario={user?.tipoUsuario} />
      <div style={styles.contentColumn}>
        <div style={styles.header}>
          <h1 style={styles.title}>Productos Deshabilitados</h1>
          <Link to={`/listado-productos/${id}`} style={styles.backLink}>
            Productos Habilitados
          </Link>
        </div>
        <hr style={styles.divider} />
        <div style={styles.breadcrumbWrapper}>
          <Breadcrumb
            items={breadcrumbItems}
            style={{ width: "Calc(100% - 40px)", marginLeft: "20px" }}
          />
        </div>
        <div style={styles.gridContainer}>
          {Array.isArray(productos) && productos.length > 0 ? (
            productos.map((producto, index) => (
              <ProductoDeshabilitado
                key={index}
                producto={producto}
                idpuesto={id}
                recargar={recargarComponente}
              />
            ))
          ) : (
            <h2 style={styles.noProductsMessage}>
              No tienes ningún producto deshabilitado en este carrito.
            </h2>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ListadoProductoDeshabilitado;

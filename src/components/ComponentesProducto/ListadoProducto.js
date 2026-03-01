import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Footer from "../ComponentesGenerales/Footer";
import Sidebar from "../ComponentesGenerales/Sidebar";
import Producto from "./Producto";
import { UserContext } from "../ComponentesGenerales/UserContext";
import { useContext } from "react";
import useDynamicColors from "../../UseDinamicColors";
import { useLocation } from "react-router-dom";
import Breadcrumb from "../ComponentesGenerales/Breadcrumb";
import LoandingComponent from "../ComponentesGenerales/LoandingComponent";
import { FaEyeSlash, FaPlus } from "react-icons/fa";

const ListadoProducto = () => {
  const { id } = useParams();
  const { user } = useContext(UserContext);
  const [productos, setProductos] = useState([]);
  const [recargar, setRecargar] = useState(0);
  const [busqueda, setBusqueda] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const Colors = useDynamicColors();
  const location = useLocation();
  const carrito = location.state;

  const recargarComponente = () => {
    setRecargar((prev) => prev + 1);
  };

  useEffect(() => {
    if (user) {
      const headers = new Headers();
      headers.append("ConsumidorId", user.consumidorId);
      headers.append("puestoId", id);

      setIsLoading(true);
      fetch(`${process.env?.REACT_APP_BACK_URL}producto`, {
        method: "GET",
        headers: headers,
      })
        .then((response) => response.json())
        .then((data) => setProductos(data.data))
        .catch((error) => console.log("No existen carritos.", error))
        .finally(() => setIsLoading(false));
    }
  }, [user, recargar, id]);

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
      backgroundColor: Colors.GrisAzuladoClaro,
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
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "flex-start",
      paddingTop: "1rem",
      width: "80%",
      marginLeft: "20%",
      paddingBottom: "50px",
      gap: "20px",
    },
    cardsContainer: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      width: "70%",
      gap: "10px",
      paddingRight: "20px",
    },
    sidebarContainer: {
      width: "30%",
      minWidth: "260px",
      backgroundColor: Colors.GrisAzuladoClaro,
      border: `1px solid ${Colors.Naranja}`,
      borderRadius: "8px",
      padding: "20px",
      display: "flex",
      flexDirection: "column",
      gap: "10px",
    },
    sidebarButton: {
      backgroundColor: Colors.Verde,
      color: Colors.BlancoEnBlanco,
      fontSize: "1rem",
      textDecoration: "none",
      padding: "10px",
      borderRadius: "5px",
      cursor: "pointer",
      textAlign: "center",
    },
    noProductsMessage: {
      fontSize: "1.5rem",
      color: Colors.Naranja,
    },
    noProductsMessage: {
      fontSize: "1.5rem",
      color: Colors.Naranja,
    },
    breadcrumbWrapper: {
      marginLeft: "20%",
      width: "Calc(80%)",
      paddingTop: "10px",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    },
  };

  const breadcrumbItems = [
    { title: "Inicio", url: "/inicio" },
    { title: "Mis Puestos", url: "/listado-puestos-encargado" },
    { title: "Mis Productos", url: `/listado-productos${carrito?.id}` },
  ];

  return (
    <div>
      <div style={styles.mainContainer}>
        <Sidebar tipoUsuario={user?.tipoUsuario} />
        <div>
          <div style={styles.header}>
            <h1 style={styles.pageTitle}>
              {carrito?.nombreCarro
                ? "Productos de " + carrito?.nombreCarro
                : "Productos"}
            </h1>
            <Link
              to={`/listado-productos-deshabilitados/${id}`}
              style={styles.disabledLink}
            >
              <FaEyeSlash /> Productos Deshabilitados
            </Link>
          </div>
          <hr style={styles.divider} />
          <div style={styles.breadcrumbWrapper}>
            <Breadcrumb
              items={breadcrumbItems}
              style={{ width: "Calc(100% - 40px)", marginLeft: "20px" }}
            />
          </div>
          <div style={styles.contentContainer}>
            <div style={styles.sidebarContainer}>
              <input
                type="text"
                placeholder="Buscar productos..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                style={{
                  padding: "8px",
                  borderRadius: "4px",
                  border: `1px solid ${Colors.Gris}`,
                  width: "100%",
                }}
              />
              <Link
                to={`/registrar-productos/${id}`}
                style={styles.sidebarButton}
              >
                <FaPlus style={{ marginRight: "6px" }} />
                Agregar Producto
              </Link>
            </div>
            <div style={styles.cardsContainer}>
              {isLoading ? (
                <LoandingComponent />
              ) : Array.isArray(productos) &&
                productos.filter((p) =>
                  JSON.stringify(p)
                    .toLowerCase()
                    .includes(busqueda.toLowerCase())
                ).length > 0 ? (
                productos
                  .filter((p) =>
                    JSON.stringify(p)
                      .toLowerCase()
                      .includes(busqueda.toLowerCase())
                  )
                  .map((producto, index) => (
                    <Producto
                      key={index}
                      producto={producto}
                      idpuesto={id}
                      recargar={recargarComponente}
                    />
                  ))
              ) : (
                <h2 style={styles.noProductsMessage}>
                  No tienes ningún producto asociado a este carrito.
                </h2>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ListadoProducto;

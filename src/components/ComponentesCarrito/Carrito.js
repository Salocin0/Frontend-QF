import React, { useState, useEffect, useContext } from "react";
import RenderizarTarjeta from "./Tarjeta";
import Sidebar from "../ComponentesGenerales/Sidebar";
import Footer from "../ComponentesGenerales/Footer";
import { UserContext } from "../ComponentesGenerales/UserContext";
import useDynamicColors from "../../UseDinamicColors";
import Breadcrumb from "../ComponentesGenerales/Breadcrumb";
import { CircularProgress } from "@mui/material";

const Carrito = () => {
  const [carrito, setCarrito] = useState(null);
  const { user } = useContext(UserContext);
  const [recargar, setRecargar] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const Colors = useDynamicColors();

  const recargarComponente = () => {
    setRecargar((prevRecargar) => prevRecargar + 1);
  };

  useEffect(() => {
    if (user) {
      setIsLoading(true);
      const headers = new Headers();
      headers.append("ConsumidorId", user.consumidorId);

      fetch(`${process.env?.REACT_APP_BACK_URL}carrito/`, {
        method: "GET",
        headers: headers,
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.data) {
            setCarrito(data.data);
          } else {
            setCarrito(null);
          }
        })
        .catch((error) => console.log("No existen carritos.", error))
        .finally(() => setIsLoading(false));
    }
  }, [user, recargar]);

  // Función para agrupar los productos por eventoId, puestoId y fecha
  const agruparProductos = () => {
    if (!carrito || !carrito.ItemCarritos) return {};

    return carrito.ItemCarritos.reduce((acc, item) => {
      const { eventoId, producto, fecha } = item;
      const puestoId = producto.puestoId;
      const fechaKey = fecha ? `conFecha-${fecha}` : "sinFecha";

      if (!acc[eventoId]) acc[eventoId] = {};
      if (!acc[eventoId][puestoId]) acc[eventoId][puestoId] = {};
      if (!acc[eventoId][puestoId][fechaKey])
        acc[eventoId][puestoId][fechaKey] = [];

      acc[eventoId][puestoId][fechaKey].push(item);

      return acc;
    }, {});
  };

  const productosAgrupados = agruparProductos();

  const styles = {
    container: {
      display: "flex",
      flexDirection: "column",
      height: "100%",
      width: "100%",
      backgroundColor: Colors.GrisAzuladoOscuro,
      minHeight: "100vh",
    },
    sidebar: {
      width: "20%",
    },
    mainContent: {
      width: "80%",
      marginLeft: "20%",
      paddingLeft: "20px",
      paddingRight: "20px",
      height: "100%",
      marginBottom: "5rem",
    },
    titleSection: {
      display: "flex",
      justifyContent: "center",
      marginBottom: "1rem",
      color: Colors.Naranja,
    },
    separator: {
      border: "none",
      borderTop: `1px solid ${Colors.Naranja}`,
    },
    productContainer: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    productList: {
      width: "100%",
    },
    breadcrumbWrapper: {
      width: "100%",
      paddingTop: "10px",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    },
    loadingContainer: {
      height: "30rem",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: Colors.GrisAzuladoOscuro,
      gap: "20px",
    },
    loadingText: {
      fontSize: "16px",
      color: Colors.Blanco,
      fontWeight: "bold",
    },
  };

  const breadcrumbItems = [
    { title: "Inicio", url: "/inicio" },
    { title: "Mi Carrito", url: "/carrito" },
  ];

  return (
    <div style={styles.container}>
      <div style={styles.sidebar}>
        <Sidebar tipoUsuario={user?.tipoUsuario} />
      </div>
      <div style={styles.mainContent}>
        <div style={styles.titleSection}>
          <h1>Carrito</h1>
        </div>
        <hr style={styles.separator} />
        <div style={styles.breadcrumbWrapper}>
          <Breadcrumb
            items={breadcrumbItems}
            style={{ width: "Calc(100% - 40px)", marginLeft: "20px" }}
          />
        </div>

        <div style={styles.productContainer}>
          <div style={styles.productList}>
            {isLoading ? (
              <div style={styles.loadingContainer}>
                <CircularProgress style={{ color: Colors.Naranja }} size={50} />
                <div style={styles.loadingText}>Cargando carrito...</div>
              </div>
            ) : Object.keys(productosAgrupados).length > 0 ? (
              Object.entries(productosAgrupados).map(([eventoId, puestos]) =>
                Object.entries(puestos).map(([puestoId, grupos]) =>
                  Object.entries(grupos).map(([fechaKey, productos], index) => (
                    <RenderizarTarjeta
                      key={`${eventoId}-${puestoId}-${fechaKey}-${index}`}
                      productos={productos}
                      titulo={`Evento: ${eventoId} | Puesto: ${puestoId} | ${
                        fechaKey.startsWith("conFecha")
                          ? `Fecha: ${productos[0]?.fecha}`
                          : "Sin fecha"
                      }`}
                      recargarComponente={recargarComponente}
                      evento={eventoId}
                    />
                  ))
                )
              )
            ) : (
              <div style={{height: "30rem", display: "flex", justifyContent: "center", alignItems: "center",backgroundColor: Colors.GrisAzuladoOscuro}}>
                <h2 style={{ color: Colors.Naranja, textAlign: "center",  }}>
                  No hay productos en el carrito
                </h2>
              </div>
            )}
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Carrito;

import React, { useState, useEffect, useContext } from "react";
import RenderizarTarjeta from "./Tarjeta";
import PageLayout from "../ComponentesGenerales/PageLayout";
import Footer from "../ComponentesGenerales/Footer";
import { UserContext } from "../ComponentesGenerales/UserContext";
import Breadcrumb from "../ComponentesGenerales/Breadcrumb";
import { CircularProgress } from "@mui/material";

const Carrito = () => {
  const [carrito, setCarrito] = useState(null);
  const { user } = useContext(UserContext);
  const [recargar, setRecargar] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

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
    mainContent: {
      width: "100%",
      padding: "0 20px",
      height: "100%",
      marginBottom: "5rem",
    },
    titleSection: {
      display: "flex",
      justifyContent: "center",
      marginBottom: "1rem",
      color: "var(--qf-naranja)",
    },
    separator: {
      border: "none",
      borderTop: `1px solid var(--qf-naranja)`,
    },
    productContainer: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    productList: {
      width: "100%",
    },
    loadingContainer: {
      height: "30rem",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "var(--qf-bg-main)",
      gap: "20px",
    },
    loadingText: {
      fontSize: "16px",
      color: "var(--qf-text-primary)",
      fontWeight: "bold",
    },
  };

  const breadcrumbItems = [
    { title: "Inicio", url: "/inicio" },
    { title: "Mi Carrito", url: "/carrito" },
  ];

  return (
    <PageLayout sidebarProps={{ tipoUsuario: user?.tipoUsuario }}>
      <div style={styles.mainContent}>
        <div style={styles.titleSection}>
          <h1 className="qf-page-title">Carrito</h1>
        </div>
        <hr className="qf-separator" style={{ marginLeft: "-40px", marginRight: "-40px", width: "auto", marginBottom: "20px" }} />
        <Breadcrumb
          items={breadcrumbItems}
          style={{ width: "100%", margin: "10px 0" }}
        />

        <div style={styles.productContainer}>
          <div style={styles.productList}>
            {isLoading ? (
              <div style={styles.loadingContainer}>
                <CircularProgress style={{ color: "var(--qf-naranja)" }} size={50} />
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
              <div style={{height: "30rem", display: "flex", justifyContent: "center", alignItems: "center",backgroundColor: "var(--qf-bg-main)"}}>
                <h2 style={{ color: "var(--qf-naranja)", textAlign: "center",  }}>
                  No hay productos en el carrito
                </h2>
              </div>
            )}
          </div>
        </div>
        <Footer />
      </div>
    </PageLayout>
  );
};

export default Carrito;

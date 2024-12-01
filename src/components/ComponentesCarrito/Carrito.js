import React, { useState, useEffect, useContext } from "react";
import RenderizarTarjeta from "./Tarjeta";
import Sidebar from "../ComponentesGenerales/Sidebar";
import Footer from "../ComponentesGenerales/Footer";
import { UserContext } from "../ComponentesGenerales/UserContext";
import useDynamicColors from "../../UseDinamicColors";

const Carrito = () => {
  const [carrito, setCarrito] = useState([]);
  const [productos, setProductos] = useState([]);
  const { user } = useContext(UserContext);
  const [recargar, setRecargar] = useState(0);
  const Colors = useDynamicColors();
  console.log(carrito);

  const recargarComponente = () => {
    setRecargar((prevRecargar) => prevRecargar + 1);
  };

  useEffect(() => {
    if (user) {
      const headers = new Headers();
      headers.append("ConsumidorId", user.consumidorId);

      fetch(`${process.env?.REACT_APP_BACK_URL}carrito/estructura`, {
        method: "GET",
        headers: headers,
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.data) {
            setCarrito(data.data);
            setProductos(data.data.productos);
          } else {
            setCarrito([]);
            setProductos([]);
          }
        })
        .catch((error) => console.log("No existen carritos.", error));
    }
  }, [user, recargar]);

  const agruparProductosPorPuestoYFecha = (productos) => {
    const productosAgrupados = {};

    productos?.forEach((item) => {
      const puestoId = item.puestoId;
      const fechaKey = item.fecha ? `conFecha-${item.fecha}` : "sinFecha";

      if (!productosAgrupados[puestoId]) {
        productosAgrupados[puestoId] = {};
      }

      if (!productosAgrupados[puestoId][fechaKey]) {
        productosAgrupados[puestoId][fechaKey] = [];
      }

      productosAgrupados[puestoId][fechaKey].push(item);
    });

    return productosAgrupados;
  };

  const productosAgrupados = agruparProductosPorPuestoYFecha(productos);

  const styles = {
    container: {
      display: "flex",
      flexDirection: "row",
      margin: 0,
      padding: 0,
      height: "100vh",
      backgroundColor: Colors.GrisAzuladoOscuro,
    },
    sidebar: {
      width: "20%",
      padding: 0,
    },
    mainContent: {
      width: "80%",
      padding: 0,
    },
    titleSection: {
      display: "flex",
      justifyContent: "center",
      marginBottom: "1rem",
      color: Colors.Naranja,
    },
    sectionTitleText: {
      paddingTop: "0.5rem",
    },
    sectionTitleNegative: {
      color: Colors.Naranja,
      textAlign: "center",
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
      paddingTop: "0.5rem",
      paddingBottom: "1rem",
      height: "100%",
      width: "100%",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.sidebar}>
        <Sidebar tipoUsuario={user?.tipoUsuario} />
      </div>
      <div style={styles.mainContent}>
        <div style={styles.titleSection}>
          <h1 style={styles.sectionTitleText}>Carrito</h1>
        </div>
        <hr style={styles.separator} />
        <div style={styles.productContainer}>
          <div style={styles.productList}>
            {Object.keys(productosAgrupados).length > 0 ? (
              Object.entries(productosAgrupados).map(([puestoId, grupos]) =>
                Object.entries(grupos).map(([fechaKey, productos], index) => (
                  <RenderizarTarjeta
                    key={`${puestoId}-${fechaKey}-${index}`}
                    productos={productos}
                    titulo={
                      fechaKey.startsWith("conFecha")
                        ? `Fecha: ${productos[0]?.fecha}`
                        : "Productos sin fecha"
                    }
                    recargarComponente={recargarComponente}
                  />
                ))
              )
            ) : (
              <h2 style={styles.sectionTitleNegative}>
                No hay productos en el carrito
              </h2>
            )}
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Carrito;

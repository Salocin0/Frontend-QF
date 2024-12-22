import React, { useState, useEffect, useContext } from "react";
import RenderizarTarjeta from "./Tarjeta";
import Sidebar from "../ComponentesGenerales/Sidebar";
import Footer from "../ComponentesGenerales/Footer";
import { UserContext } from "../ComponentesGenerales/UserContext";
import useDynamicColors from "../../UseDinamicColors";
import Breadcrumb from "../ComponentesGenerales/Breadcrumb";

const Carrito = () => {
  const [carrito, setCarrito] = useState([]);
  const [productos, setProductos] = useState([]);
  const { user } = useContext(UserContext);
  const [recargar, setRecargar] = useState(0);
  const [evento, setEvento] = useState([]);
  const Colors = useDynamicColors();
  console.log(evento);

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

  useEffect(() => {
    if (user) {
      const headers = new Headers();
      headers.append("ConsumidorId", user.consumidorId);
      fetch(
        `${process.env?.REACT_APP_BACK_URL}evento/${productos[0]?.eventoId}`,
        {
          method: "GET",
          headers: headers,
        }
      )
        .then((response) => response.json())
        .then((data) => {
          setEvento(data.data);
          console.log(data.data);
        })
        .catch((error) => console.log("No existen eventos.", error));
    }
  }, [productos, user]);

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
      flexDirection: "column",
      margin: 0,
      padding: 0,
      height: "100vh",
      width: "100%",
      backgroundColor: Colors.GrisAzuladoOscuro,
    },
    sidebar: {
      width: "20%",
      padding: 0,
    },
    mainContent: {
      width: "80%",
      marginLeft: "20%",
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
      paddingTop: "0rem",
      paddingBottom: "1rem",
      height: "100%",
      width: "100%",
    },
    breadcrumbWrapper: {
      width: "100%",
      margin: "0",
      padding: "0",
      paddingTop: "10px",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    },
  };

  const breadcrumbItems = [
    { title: "Inicio", url: "/inicio" },
    { title: "Mis pedidos", url: "/Listado-eventos" },
  ];

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
        <div style={styles.breadcrumbWrapper}>
          <Breadcrumb
            items={breadcrumbItems}
            style={{ width: "Calc(100% - 40px)", marginLeft: "20px" }}
          />
        </div>

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
                    evento={evento}
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

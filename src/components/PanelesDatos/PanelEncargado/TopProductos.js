import React, { useState, useEffect, useContext, useRef } from "react";
import GraficaTortaProductos from "../GraficaTortaProductos";
import { UserContext } from "../../ComponentesGenerales/UserContext";
import { CircularProgress } from "@mui/material";

const TopProductos = ({ puestoId = "Todos", eventoId = "Todos" }) => {
  const [productos, setProductos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const { user } = useContext(UserContext);
  const graficoRef = useRef(null);
  const [graficoHeight, setGraficoHeight] = useState(300); // Altura inicialn
  useEffect(() => {
    const fetchTopProductos = async () => {
      try {
        setIsLoading(true);
        setError(false);

        const response = await fetch(
          `${process.env?.REACT_APP_BACK_URL}estadisticas/top-productos-puesto-evento/${user.consumidorId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ idPuesto: puestoId, idEvento: eventoId }),
          }
        );

        const data = await response.json();
        console.log(data);
        if (data.status === "success") {
          setProductos(data.data);
        } else {
          setError(true);
        }
      } catch (error) {
        console.error("Error al obtener los productos", error);
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };

    if (puestoId && eventoId) {
      fetchTopProductos();
    }
  }, [puestoId, eventoId, user?.consumidorId]);

  useEffect(() => {
    if (graficoRef.current) {
      const resizeObserver = new ResizeObserver((entries) => {
        for (let entry of entries) {
          setGraficoHeight(entry.contentRect.height);
        }
      });

      resizeObserver.observe(graficoRef.current);
      return () => resizeObserver.disconnect();
    }
  }, []);

  const styles = {
    torta: {
      borderRadius: "10px",
      marginTop: "20px",
      width: "100%",
      height: "auto",
    },
      topProductos:{
      gridArea: "toppuestos",
      padding: "20px",
      borderRadius: "20px",
      background: "var(--qf-bg-secondary)",
      backgroundSize: "cover",
      position: "relative",
      border: `2px solid var(--qf-naranja)`,
      overflow: "hidden",
    },
    tabla: {
      width: "100%",
      borderCollapse: "collapse",
      color: "var(--qf-naranja)",
    },
    thTd: {
      border: "1px solid var(--qf-naranja)",
      padding: "8px",
      textAlign: "left",
      color: "var(--qf-naranja)",
    },
    th: {
      border: "1px solid var(--qf-naranja)",
      padding: "8px",
      textAlign: "left",
      color: "var(--qf-naranja)",
      fontWeight: "bold",
    },
  };

  const sinDatos = error || productos.length === 0;

  if (isLoading) {
    return (
      <div style={styles.topProductos}>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "200px", width: "100%" }}>
          <CircularProgress style={{ color: "var(--qf-naranja)" }} />
        </div>
      </div>
    );
  }

  if (sinDatos) {
    return (
      <div style={styles.topProductos}>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "200px", width: "100%", color: "var(--qf-naranja)" }}>
          Sin datos
        </div>
      </div>
    );
  }

  return (
    <div style={styles.topProductos}>
      <h2 style={{ color: "var(--qf-naranja)", margin: 0, padding: 0 }}>Top Productos</h2>
      <hr style={{ color: "var(--qf-naranja)", borderColor: "var(--qf-naranja)" }} />
      <div style={{ overflowX: "auto" }}>
        <table style={styles.tabla}>
          <thead>
            <tr>
              <th style={styles.th}>Nombre</th>
              <th style={styles.th}>Pedidos</th>
              <th style={styles.th}>Dinero</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((producto, index) => (
              <tr key={index}>
                <td style={styles.thTd}>{producto.nombre}</td>
                <td style={styles.thTd}>{producto.pedidos}</td>
                <td style={styles.thTd}>${Math.round(Number(producto.dinero)).toLocaleString("es-AR")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div ref={graficoRef} style={styles.torta}>
        <GraficaTortaProductos height={graficoHeight} productos={productos} />
      </div>
    </div>
  );
};

export default TopProductos;

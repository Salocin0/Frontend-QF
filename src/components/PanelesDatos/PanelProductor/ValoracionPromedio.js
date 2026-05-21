import React, { useState, useEffect } from "react";
import { CircularProgress } from "@mui/material";

const ValoracionPromedio = ({ eventoId }) => {
  const [promedio, setPromedio] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const styles = {
    promedio: {
      fontWeight: "bold",
      textAlign: "center",
      color: "var(--qf-naranja)",
      margin: "0",
      fontSize: "2rem",
    },
    texto: {
        fontWeight: "bold",
        margin: "0",
        color: "var(--qf-naranja)",
        fontSize: "1rem",
    },
  };

  useEffect(() => {
    const fetchPromedioValoracion = async () => {
      try {
        const response = await fetch(
          `${process.env?.REACT_APP_BACK_URL}estadisticas/promedio-valoracion-puesto/${eventoId}`
        );
        if (!response.ok) {
          throw new Error("Error al obtener el promedio de valoraciones");
        }
        const data = await response.json();
        setPromedio(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (eventoId) fetchPromedioValoracion();
  }, [eventoId]);

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
        <CircularProgress style={{ color: "var(--qf-naranja)" }} />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ ...styles.container }}>
        <strong>Error:</strong> {error}
      </div>
    );
  }

  return (
    <div>
      <h1 style={styles.promedio}>
        {promedio ? promedio.toFixed(1) + "/5" : "N/A"}
      </h1>
      <p style={styles.texto}>Valoración promedio</p>
    </div>
  );
};

export default ValoracionPromedio;

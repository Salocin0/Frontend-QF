import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../../ComponentesGenerales/UserContext";
import { CircularProgress } from "@mui/material";

const TiempoPromedioEntrega = ({ puestoId = "Todos", eventoId = "Todos" }) => {
  const [tiempoPromedio, setTiempoPromedio] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const { user } = useContext(UserContext);

  const styles = {
    div3Encargado: {
      gridArea: "div3",
      borderRadius: "20px",
      backgroundColor: "var(--qf-bg-secondary)",
      alignItems: "center",
      border: `2px solid var(--qf-naranja)`,
      height: "100%",
      width: "100%",
    },
    contentContainer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "100%",
      width: "100%",
    },
    textWhite: {
      color: "var(--qf-naranja)",
      margin: 0,
      padding: 0,
      fontWeight: "bold",
      textAlign: "center",
    },
    textBold: {
      fontWeight: "bold",
      margin: 0,
      padding: 0,
      fontSize: "2rem",
    },
    valoracionText: {
      color: "var(--qf-naranja)",
      margin:0,
      padding:0,
      fontSize: "2rem",
      textAlign: "center",
    },
  };

  useEffect(() => {
    const fetchTiempoPromedio = async () => {
      try {
        setIsLoading(true);
        setError(false);

        const response = await fetch(
          `${process.env?.REACT_APP_BACK_URL}estadisticas/promedio-tiempo-entrega-puesto-evento/${user.consumidorId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ idPuesto: puestoId, idEvento: eventoId }),
          }
        );

        if (!response.ok) {
          throw new Error("Error al obtener el tiempo promedio de entrega");
        }

        const data = await response.json();
        console.log(data);
        setTiempoPromedio(data.data || 0); // Ajusta según el formato de la respuesta del backend
      } catch (error) {
        console.error("Error al obtener el tiempo promedio de entrega", error);
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };

    // Ejecutar fetch solo si al menos uno de los parámetros tiene un valor
    if (puestoId || eventoId) {
      fetchTiempoPromedio();
    }
  }, [puestoId, eventoId, user?.consumidorId]);

  const sinDatos = error || !tiempoPromedio || tiempoPromedio === 0;

  if (isLoading) {
    return (
      <div style={styles.div3Encargado}>
        <div style={styles.contentContainer}>
          <CircularProgress style={{ color: "var(--qf-naranja)" }} />
        </div>
      </div>
    );
  }

  if (sinDatos) {
    return (
      <div style={styles.div3Encargado}>
        <div style={styles.contentContainer}>
          <h1 style={styles.valoracionText}>Sin datos</h1>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.div3Encargado}>
      <div style={styles.contentContainer}>
        <h1 style={styles.valoracionText}>
          {tiempoPromedio} minutos
        </h1>
        <p style={styles.textWhite}>
            Tiempo Promedio de entrega
        </p>
      </div>
    </div>
  );
};

export default TiempoPromedioEntrega;

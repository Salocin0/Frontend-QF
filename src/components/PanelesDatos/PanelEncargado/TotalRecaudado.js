import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../../ComponentesGenerales/UserContext";
import { CircularProgress } from "@mui/material";

const TotalRecaudadoEvento = ({ puestoId = "Todos", eventoId = "Todos" }) => {
  const [totalRecaudado, setTotalRecaudado] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(false);
        const response = await fetch(
          `${process.env?.REACT_APP_BACK_URL}estadisticas/total-recaudado-puesto-evento/${user.consumidorId}`,
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
        setTotalRecaudado(data.data);
      } catch (error) {
        console.error("Error al obtener el total recaudado", error);
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };

    if (puestoId || eventoId) {
      fetchData();
    }
    console.log(puestoId, eventoId);
  }, [puestoId, eventoId, user?.consumidorId]);

  const styles = {
    container: {
      position: "relative",
      gridArea: "div1",
      borderRadius: "20px",
      alignItems: "center",
      border: `2px solid var(--qf-naranja)`,
      background: "var(--qf-bg-secondary)",
      height: "100%",
      width: "100%",
    },
    loadingContainer: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100%",
      width: "100%",
    },
    loadingText: {
      color: "var(--qf-naranja)",
      fontSize: "1.5rem",
      margin: 0,
      padding: 0,
    },
    errorContainer: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100%",
      width: "100%",
    },
    errorText: {
      color: "var(--qf-naranja)",
      fontSize: "1.5rem",
      margin: 0,
      padding: 0,
    },
    resultContainer: {
      justifyContent: "center",
      alignItems: "center",
      display: "flex",
      height: "100%",
      width: "100%",
      flexDirection: "column",
    },
    resultText: {
      color: "var(--qf-naranja)",
      fontSize: "2rem",
      margin: 0,
      padding: 0,
    },
    label: {
      color: "var(--qf-naranja)",
      margin: 0,
      padding: 0,
    },
  };

  const sinDatos = error || !totalRecaudado || totalRecaudado === 0;

  return (
    <div style={styles.container}>
      {isLoading ? (
        <div style={styles.loadingContainer}>
          <CircularProgress style={{ color: "var(--qf-naranja)" }} />
        </div>
      ) : sinDatos ? (
        <div style={styles.errorContainer}>
          <p style={styles.errorText}>Sin datos</p>
        </div>
      ) : (
        <div style={styles.resultContainer}>
          <h1 style={styles.resultText}>
            ${totalRecaudado?.toLocaleString("es-ES")}
          </h1>
          <p style={styles.label}>
            <strong>Total Recaudado</strong>
          </p>
        </div>
      )}
    </div>
  );
};

export default TotalRecaudadoEvento;

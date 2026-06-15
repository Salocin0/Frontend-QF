import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../../ComponentesGenerales/UserContext";
import { CircularProgress } from "@mui/material";

const ValoracionPromedio = ({ puestoId = "Todos", eventoId = "Todos" }) => {
  const [valoracion, setValoracion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(UserContext);

  const styles = {
    div2Encargado: {
      gridArea: "div2",
      borderRadius: 20,
      backgroundColor: "var(--qf-bg-secondary)", 
      alignItems: "center",
      border: `2px solid var(--qf-naranja)`,
      position: "relative",
      height: "100%",
      width: "100%",
    },
    loadingText: {
      color: "var(--qf-naranja)",
      textAlign: "center",
      margin:0,
      padding:0
    },
    errorText: {
      color: "var(--qf-naranja)",
      textAlign: "center",
      margin:0,
      padding:0
    },
    contentContainer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "100%",
      margin:0,
      padding:0
    },
    valoracionText: {
      color: "var(--qf-naranja)",
      margin:0,
      padding:0,
      fontSize: "2rem",
    },
    strongText: {
      color: "var(--qf-naranja)",
      margin:0,
      padding:0,
      fontWeight: "bold",
    },
  };

  useEffect(() => {
    const fetchValoracionPromedio = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${process.env?.REACT_APP_BACK_URL}estadisticas/promedio-valoracion-puesto-evento/${user.consumidorId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ idPuesto: puestoId, idEvento: eventoId }),
          }
        );

        if (!response.ok) {
          throw new Error("Error al obtener la valoración promedio");
        }

        const data = await response.json();
        setValoracion(data.data);
        console.log(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchValoracionPromedio();
  }, [puestoId, eventoId, user?.consumidorId]);

  const sinDatos = error || !valoracion || valoracion === 0;

  if (loading) {
    return (
      <div style={styles.div2Encargado}>
        <div style={styles.contentContainer}>
          <CircularProgress style={{ color: "var(--qf-naranja)" }} />
        </div>
      </div>
    );
  }

  if (sinDatos) {
    return (
      <div style={styles.div2Encargado}>
        <div style={styles.contentContainer}>
          <h1 style={styles.valoracionText}>Sin datos</h1>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.div2Encargado}>
      <div style={styles.contentContainer}>
        <h1 style={styles.valoracionText}>
          {valoracion}/5
        </h1>
        <p style={styles.strongText}>
          Valoración Promedio
        </p>
      </div>
    </div>
  );
};

export default ValoracionPromedio;

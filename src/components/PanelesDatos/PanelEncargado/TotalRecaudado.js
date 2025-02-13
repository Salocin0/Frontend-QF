import React, { useEffect, useState, useContext } from "react";
import useDynamicColors from "../../../UseDinamicColors";
import { UserContext } from "../../ComponentesGenerales/UserContext";

const TotalRecaudadoEvento = ({ puestoId = "Todos", eventoId = "Todos" }) => {
  const [totalRecaudado, setTotalRecaudado] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const { user } = useContext(UserContext);
  const Colors = useDynamicColors();

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
  }, [puestoId, eventoId]);

  const styles = {
    container: {
      position: "relative",
      gridArea: "div1",
      marginTop: "20px",
      borderRadius: "20px",
      alignItems: "center",
      border: "2px solid white",
      background: Colors.GrisAzuladoClaro,
      marginLeft: "20px",
    },
    loadingContainer: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100%",
      width: "100%",
    },
    loadingText: {
      color: Colors.Blanco,
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
      color: Colors.Blanco,
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
      color: Colors.Blanco,
      fontSize: "2rem",
      margin: 0,
      padding: 0,
    },
    label: {
      color: Colors.Blanco,
      margin: 0,
      padding: 0,
    },
  };

  return (
    <div style={styles.container}>
      {isLoading ? (
        <div style={styles.loadingContainer}>
          <p style={styles.loadingText}>Cargando datos...</p>
        </div>
      ) : error ? (
        <div style={styles.errorContainer}>
          <p style={styles.errorText}>Error al cargar los datos</p>
        </div>
      ) : (
        <div style={styles.resultContainer}>
          <h1 style={styles.resultText}>
            ${totalRecaudado?.toLocaleString("es-ES") || "0"}
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

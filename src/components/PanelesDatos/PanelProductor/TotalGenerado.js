import React, { useEffect, useState } from "react";
import useDynamicColors from "../../../UseDinamicColors";
import { CircularProgress } from "@mui/material";

const TotalQuickFood = ({ eventId }) => {
  const [totalRecaudado, setTotalRecaudado] = useState(null); // Estado para almacenar el total recaudado
  const [loading, setLoading] = useState(true); // Estado de carga
  const [error, setError] = useState(null); // Estado para errores
  const Colors = useDynamicColors();
  console.log(eventId);
  useEffect(() => {
    const fetchTotalRecaudado = async () => {
      try {
        const response = await fetch(
          `${process.env?.REACT_APP_BACK_URL}estadisticas/total-recaudado-evento/${eventId}`
        );
        if (!response.ok) {
          throw new Error(`Error en la solicitud: ${response.statusText}`);
        }
        const data = await response.json();
        setTotalRecaudado(data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener el total recaudado:", error);
        setError(error.message);
        setLoading(false);
      }
    };
    if(eventId) fetchTotalRecaudado();
  }, [eventId]);

  const styles = {
    container: {
      gridArea: "div1",
      marginTop: "20px",
      borderRadius: "20px",
      backgroundColor: Colors.GrisAzuladoClaro,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      backgroundImage: "url(./../../img/wave1.svg)",
      backgroundSize: "cover",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "70% 25%",
      border: `2px solid ${Colors.Naranja}`,
      position: "relative",
      
    },
    heading: {
      color: Colors.Naranja,
      margin: "0",
      fontSize: "2rem",
    },
    paragraph: {
      color: Colors.Naranja,
      fontWeight: "bold",
      margin: "0",
      fontSize: "1rem",
    },
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <CircularProgress style={{ color: Colors.Naranja }} />
      </div>
    );
  }

  if (error) {
    return <div style={styles.container}>Error: {error}</div>;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>ARS$ {totalRecaudado}</h1>
      <p style={styles.paragraph}>Total Generado en evento</p>
    </div>
  );
};

export default TotalQuickFood;

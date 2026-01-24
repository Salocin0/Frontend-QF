import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../../ComponentesGenerales/UserContext";
import useDynamicColors from "../../../UseDinamicColors";

const ValoracionPromedio = ({ puestoId = "Todos", eventoId = "Todos" }) => {
  const [valoracion, setValoracion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(UserContext);
  const Colors = useDynamicColors();

  const styles = {
    div2Encargado: {
      gridArea: "div2",
      marginTop: 20,
      borderRadius: 20,
      backgroundColor: Colors.GrisAzuladoClaro, 
      alignItems: "center",
      border: "2px solid white",
      position: "relative",
    },
    loadingText: {
      color: Colors.Blanco,
      textAlign: "center",
      margin:0,
      padding:0
    },
    errorText: {
      color: Colors.Blanco,
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
      color: Colors.Blanco,
      margin:0,
      padding:0,
      fontSize: "2rem",
    },
    strongText: {
      color: Colors.Blanco,
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

  if (loading) {
    return (
      <div style={styles.div2Encargado}>
        <p style={styles.loadingText}>Cargando...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.div2Encargado}>
        <p style={styles.errorText}>{error}</p>
      </div>
    );
  }

  return (
    <div style={styles.div2Encargado}>
      <div style={styles.contentContainer}>
        <h1 style={styles.valoracionText}>
          {valoracion ? `${valoracion}/5` : "N/A"}
        </h1>
        <p style={styles.strongText}>
          Valoración Promedio
        </p>
      </div>
    </div>
  );
};

export default ValoracionPromedio;

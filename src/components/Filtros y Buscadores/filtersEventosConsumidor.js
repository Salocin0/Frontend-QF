import React, { useState,useEffect } from "react";
import useDynamicColors from "../../UseDinamicColors";

const FiltersEventosConsumidor = ({ setDistancia, setPreventa }) => {
  const Colors = useDynamicColors();

  // Estado local para los filtros de preventa
  const [localPreventa, setLocalPreventa] = useState({
    conPreventa: true,
    sinPreventa: true,
  });

  useEffect(() => {
    setPreventa(localPreventa);
  }, [localPreventa, setPreventa]);

  // Manejo de cambios en los filtros
  const handleDistanciaChange = (value) => {
    setDistancia(value); // Actualiza el estado en el componente padre
  };

  const handlePreventaChange = (key, value) => {
    setLocalPreventa((prev) => ({ ...prev, [key]: value }));
    setPreventa((prev) => ({ ...prev, [key]: value }));
  };

  // Estilos
  const styles = {
    container: {
      padding: "20px",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      borderRadius: "10px",
      backgroundColor: Colors.GrisAzuladoClaro,
      width: "100%",
    },
    header: {
      fontSize: "20px",
      fontWeight: "bold",
      textAlign: "center",
      marginBottom: "15px",
    },
    header2: {
      fontSize: "16px",
      fontWeight: "bold",
      marginBottom: "15px",
    },
    divider: {
      border: "none",
      height: "1px",
      backgroundColor: Colors.GrisClaro,
      margin: "15px 0",
    },
    filterGroup: {
      marginBottom: "15px",
    },
    label: {
      display: "block",
      marginBottom: "10px",
      fontSize: "16px",
      cursor: "pointer",
    },
    checkbox: {
      marginRight: "10px",
      cursor: "pointer",
    },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>FILTROS</h2>
      <hr style={styles.divider} />

      {/* Filtro de Distancia */}
      <h3 style={styles.header2}>DISTANCIA</h3>
      <div style={styles.filterGroup}>
        <label style={styles.label} htmlFor="menos5">
          <input
            id="menos5"
            type="radio"
            name="distancia"
            value="5"
            style={styles.checkbox}
            onChange={() => handleDistanciaChange("5")}
          />
          Menos de 5 KM
        </label>
        <label style={styles.label} htmlFor="menos25">
          <input
            id="menos25"
            type="radio"
            name="distancia"
            value="25"
            style={styles.checkbox}
            onChange={() => handleDistanciaChange("25")}
          />
          Menos de 25 KM
        </label>
        <label style={styles.label} htmlFor="menos100">
          <input
            id="menos100"
            type="radio"
            name="distancia"
            value="100"
            style={styles.checkbox}
            defaultChecked
            onChange={() => handleDistanciaChange("100")}
          />
          Menos de 100 KM
        </label>
      </div>

      <hr style={styles.divider} />

      {/* Filtro de Preventa */}
      <h3 style={styles.header2}>PREVENTA</h3>
      <div style={styles.filterGroup}>
        <label style={styles.label} htmlFor="conPreventa">
          <input
            id="conPreventa"
            type="checkbox"
            style={styles.checkbox}
            checked={localPreventa.conPreventa}
            onChange={(e) => handlePreventaChange("conPreventa", e.target.checked)}
          />
          Con Preventa
        </label>
        <label style={styles.label} htmlFor="sinPreventa">
          <input
            id="sinPreventa"
            type="checkbox"
            style={styles.checkbox}
            checked={localPreventa.sinPreventa}
            onChange={(e) => handlePreventaChange("sinPreventa", e.target.checked)}
          />
          Sin Preventa
        </label>
      </div>
    </div>
  );
};

export default FiltersEventosConsumidor;

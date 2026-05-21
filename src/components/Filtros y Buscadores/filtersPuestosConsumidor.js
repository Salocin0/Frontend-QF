import React from "react";

const FiltersPuestosConsumidor = ({ setEstrella, setTiempo }) => {
  const handleEstrellasChange = (value) => {
    setEstrella(value);
  };

  const handleTiempoChange = (value) => {
    setTiempo(value);
  };

  const styles = {
    container: {
      padding: "20px",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      borderRadius: "10px",
      backgroundColor: "var(--qf-bg-secondary)",
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
      backgroundColor: "var(--qf-bg-card)",
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
      <h3 style={styles.header2}>Estrellas Minimas</h3>
      <div style={styles.filterGroup}>
        <label style={styles.label} htmlFor="estrella1">
          <input
            id="estrella1"
            type="radio"
            name="Estrellas"
            value="5"
            style={styles.checkbox}
            onChange={() => handleEstrellasChange("1")}
          />
          1 Estrella
        </label>
        <label style={styles.label} htmlFor="estrella2">
          <input
            id="estrella2"
            type="radio"
            name="Estrellas"
            value="25"
            style={styles.checkbox}
            onChange={() => handleEstrellasChange("2")}
          />
          2 Estrellas
        </label>
        <label style={styles.label} htmlFor="estrella3">
          <input
            id="estrella3"
            type="radio"
            name="Estrellas"
            value="25"
            style={styles.checkbox}
            onChange={() => handleEstrellasChange("3")}
          />
          3 Estrellas
        </label>
        <label style={styles.label} htmlFor="estrella4">
          <input
            id="estrella4"
            type="radio"
            name="Estrellas"
            value="25"
            style={styles.checkbox}
            onChange={() => handleEstrellasChange("4")}
          />
          4 Estrellas
        </label>
        <label style={styles.label} htmlFor="estrella5">
          <input
            id="estrella5"
            type="radio"
            name="Estrellas"
            value="25"
            style={styles.checkbox}
            onChange={() => handleEstrellasChange("5")}
          />
          5 Estrellas
        </label>
      </div>

      <hr style={styles.divider} />

      <h3 style={styles.header2}>Tiempo Entrega</h3>
      <div style={styles.filterGroup}>
        <label style={styles.label} htmlFor="tiempo1">
          <input
            id="tiempo1"
            type="radio"
            name="Tiempo"
            style={styles.checkbox}
            onChange={() => handleTiempoChange("15")}
          />
          Menos de 15 Min
        </label>
        <label style={styles.label} htmlFor="tiempo2">
          <input
            id="tiempo2"
            type="radio"
            name="Tiempo"
            style={styles.checkbox}
            onChange={() => handleTiempoChange("60")}
          />
          Menos de 1 Hora
        </label>
      </div>
    </div>
  );
};

export default FiltersPuestosConsumidor;

import React, { useState } from "react";
import useDynamicColors from "../../UseDinamicColors";

const Filtros = ({ gruposFiltros = [], onFiltrar, titulo = "FILTROS" }) => {
  const [filtrosSeleccionados, setFiltrosSeleccionados] = useState({});
  const Colors = useDynamicColors();

  const styles = {
    container: {
      backgroundColor: Colors.GrisAzuladoClaro,
      padding: "20px",
      borderRadius: "8px",
      marginBottom: "20px",
      border: `1px solid ${Colors.Naranja}`,
      marginTop: "10px",
    },
    title: {
      color: Colors.Blanco,
      fontSize: "1.5rem",
      fontWeight: "bold",
      marginBottom: "15px",
      textTransform: "uppercase",
    },
    divider: {
      border: "none",
      height: "1px",
      backgroundColor: Colors.Blanco,
      margin: "15px 0",
    },
    filterGroup: {
      marginBottom: "10px",
    },
    label: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      cursor: "pointer",
      margin: "8px 0",
      color: Colors.Blanco,
      fontSize: "1rem",
    },
    checkbox: {
      width: "16px",
      height: "16px",
      cursor: "pointer",
    },
  };

  const handleCheckboxChange = (grupo, valor) => {
    const nuevosFiltros = {
      ...filtrosSeleccionados,
      [grupo]: filtrosSeleccionados[grupo] === valor ? null : valor,
    };
    setFiltrosSeleccionados(nuevosFiltros);
    onFiltrar(nuevosFiltros);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>{titulo}</h2>
      <hr style={styles.divider} />

      {gruposFiltros.map((grupo, index) => (
        <React.Fragment key={index}>
          {grupo.opciones.map((opcion, idx) => (
            <div key={`${index}-${idx}`} style={styles.filterGroup}>
              <label style={styles.label}>
                <input
                  type="checkbox"
                  name={`filtroGrupo${index}`}
                  checked={filtrosSeleccionados[grupo.nombre] === opcion.valor}
                  onChange={() =>
                    handleCheckboxChange(grupo.nombre, opcion.valor)
                  }
                  style={styles.checkbox}
                />{" "}
                {opcion.etiqueta}
              </label>
            </div>
          ))}
          {index < gruposFiltros.length - 1 && <hr style={styles.divider} />}
        </React.Fragment>
      ))}
    </div>
  );
};

export default Filtros;

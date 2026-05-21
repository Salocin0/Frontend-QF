import React, { useState } from "react";

const BuscadorEventosConsumidor = ({ setNombre }) => {
  const [searchText, setSearchText] = useState("");

  const handleInputChange = (event) => {
    setSearchText(event.target.value);
  };

  const handleSearch = () => {
    if (setNombre ) {
      setNombre(searchText);
    }
  };

  const styles = {
    container: {
      display: "flex",
      width: "100%",
      gap: "10px",
      padding: "10px",
      borderRadius: "8px",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      flexDirection: "column",
      backgroundColor: "var(--qf-bg-secondary)",
    },
    input: {
      flex: 1,
      padding: "10px",
      border: `1px solid var(--qf-text-muted)`,
      borderRadius: "4px",
      fontSize: "16px",
      outline: "none",
    },
    button: {
      padding: "10px 15px",
      backgroundColor: "var(--qf-green)",
      color: "var(--qf-text-primary)",
      fontWeight: "bold",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      fontSize: "16px",
      transition: "background-color 0.3s",
      width: "100%",
    },
  };

  return (
    <div style={styles.container}>
      <input
        type="text"
        placeholder="Buscar..."
        value={searchText}
        onChange={handleInputChange}
        style={styles.input}
      />
      <button style={styles.button} onClick={handleSearch}>
        Buscar
      </button>
    </div>
  );
};

export default BuscadorEventosConsumidor;

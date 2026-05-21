import React, { useState, useEffect } from "react";

const Buscador = ({ 
  placeholder = "Buscar...", 
  onBuscar, 
  botonBuscar = true,
  delay = 300,
  style = {}
}) => {
  const [searchText, setSearchText] = useState("");

  // Estilos consistentes con BuscadorEventosConsumidor
  const styles = {
    container: {
      display: "flex",
      width: "100%",
      gap: "10px",
      padding: "10px",
      borderRadius: "8px",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      flexDirection: "row",
      backgroundColor: "var(--qf-bg-secondary)",
      alignItems: "center",
      border: `1px solid var(--qf-naranja)`,
    },
    input: {
      flex: 1,
      minWidth: 0,
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
      width: "auto",
    },
  };

  // Efecto para búsqueda con debounce
  useEffect(() => {
    if (!botonBuscar) {
      const timer = setTimeout(() => {
        onBuscar(searchText);
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [searchText, delay, botonBuscar, onBuscar]);

  const handleInputChange = (event) => {
    setSearchText(event.target.value);
  };

  const handleSearch = () => {
    onBuscar(searchText);
  };

  return (
    <div style={{...styles.container, ...style}}>
      <input
        type="text"
        placeholder={placeholder}
        value={searchText}
        onChange={handleInputChange}
        style={styles.input}
        onKeyPress={(e) => !botonBuscar && e.key === 'Enter' && handleSearch()}
      />
      {botonBuscar && (
        <button style={styles.button} onClick={handleSearch}>
          Buscar
        </button>
      )}
    </div>
  );
};

export default Buscador;